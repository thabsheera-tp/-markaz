import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';
import { authenticateToken, requireRole, JWT_SECRET } from '../middleware/auth.js';

const router = express.Router();

// Helper to log administrative actions
export async function logActivity(userId, userName, action, details, ip) {
  try {
    await query.run(
      `INSERT INTO activity_logs (user_id, user_name, action, details, ip_address) VALUES (?, ?, ?, ?, ?)`,
      [userId || null, userName || 'Anonymous', action, details, ip || '127.0.0.1']
    );
  } catch (err) {
    console.error('Failed to write activity log:', err);
  }
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await query.get('SELECT * FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Update last_login
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    await query.run('UPDATE users SET last_login = ? WHERE id = ?', [now, user.id]);

    // Issue JWT
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Audit log
    await logActivity(user.id, user.name, 'Admin Login', `Logged in successfully from ${req.ip || '127.0.0.1'}`, req.ip);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        last_login: now
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during authentication.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await query.get('SELECT id, name, email, role, created_at, last_login FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
});

// GET /api/auth/users (Super Admin only)
router.get('/users', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const users = await query.all('SELECT id, name, email, role, created_at, last_login FROM users ORDER BY id ASC');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: 'Failed to list users.' });
  }
});

// POST /api/auth/users (Super Admin only)
router.post('/users', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields (name, email, password, role) are required.' });
    }

    if (!['admin', 'editor', 'viewer'].includes(role)) {
      return res.status(400).json({ error: 'Role must be admin, editor, or viewer.' });
    }

    const existing = await query.get('SELECT id FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    if (existing) {
      return res.status(409).json({ error: 'A user with this email already exists.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const result = await query.run(
      `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`,
      [name.trim(), email.trim().toLowerCase(), password_hash, role]
    );

    await logActivity(req.user.id, req.user.name, 'Created User', `Created ${role} account for ${email}`, req.ip);

    res.status(201).json({
      message: 'User created successfully.',
      user: { id: result.lastID, name, email, role }
    });
  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ error: 'Failed to create user.' });
  }
});

// PUT /api/auth/users/:id (Super Admin only: update user info/role)
router.put('/users/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({ error: 'Name, email, and role are required.' });
    }

    const targetUser = await query.get('SELECT * FROM users WHERE id = ?', [id]);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Prevent demoting the only admin
    if (targetUser.role === 'admin' && role !== 'admin') {
      const adminCount = await query.get("SELECT COUNT(*) as count FROM users WHERE role = 'admin'");
      if (adminCount.count <= 1) {
        return res.status(400).json({ error: 'Cannot demote the last remaining Super Admin.' });
      }
    }

    await query.run(
      'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
      [name.trim(), email.trim().toLowerCase(), role, id]
    );

    await logActivity(req.user.id, req.user.name, 'Updated User', `Updated user ID ${id} (${email})`, req.ip);

    res.json({ message: 'User updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user.' });
  }
});

// PUT /api/auth/users/:id/password (Super Admin or Self: reset password)
router.put('/users/:id/password', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters.' });
    }

    // Must be admin or the user themselves
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ error: 'Permission denied to reset this password.' });
    }

    const password_hash = await bcrypt.hash(newPassword, 10);
    await query.run('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash, id]);

    await logActivity(req.user.id, req.user.name, 'Password Reset', `Password reset for user ID ${id}`, req.ip);

    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset password.' });
  }
});

// DELETE /api/auth/users/:id (Super Admin only)
router.delete('/users/:id', authenticateToken, requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'You cannot delete your own account.' });
    }

    const targetUser = await query.get('SELECT * FROM users WHERE id = ?', [id]);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (targetUser.role === 'admin') {
      const adminCount = await query.get("SELECT COUNT(*) as count FROM users WHERE role = 'admin'");
      if (adminCount.count <= 1) {
        return res.status(400).json({ error: 'Cannot delete the only Super Admin.' });
      }
    }

    await query.run('DELETE FROM users WHERE id = ?', [id]);
    await logActivity(req.user.id, req.user.name, 'Deleted User', `Deleted user ${targetUser.email} (ID ${id})`, req.ip);

    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user.' });
  }
});

export default router;

import jwt from 'jsonwebtoken';
import { query } from './db.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'koyyam_markaz_super_secret_jwt_key_2026';

export function getClientIp(req) {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || '127.0.0.1';
}

export function verifyAuth(req) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return { error: 'Access token required. Please log in.', status: 401 };
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    return { user };
  } catch (err) {
    return { error: 'Token expired or invalid. Please log in again.', status: 403 };
  }
}

export function checkRole(user, allowedRoles = []) {
  if (!user) {
    return { error: 'Unauthorized.', status: 401 };
  }
  if (!allowedRoles.includes(user.role)) {
    return {
      error: `Permission denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${user.role}`,
      status: 403
    };
  }
  return null;
}

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

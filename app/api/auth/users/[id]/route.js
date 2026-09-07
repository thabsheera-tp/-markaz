import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth, checkRole, logActivity, getClientIp } from '@/lib/auth';

export async function PUT(req, { params }) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const roleErr = checkRole(auth.user, ['admin']);
    if (roleErr) return NextResponse.json({ error: roleErr.error }, { status: roleErr.status });

    const { id } = await params;
    const body = await req.json();
    const { name, email, role } = body;

    if (!name || !email || !role) {
      return NextResponse.json({ error: 'Name, email, and role are required.' }, { status: 400 });
    }

    const targetUser = await query.get('SELECT * FROM users WHERE id = ?', [id]);
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    if (targetUser.role === 'admin' && role !== 'admin') {
      const adminCount = await query.get("SELECT COUNT(*) as count FROM users WHERE role = 'admin'");
      if (adminCount.count <= 1) {
        return NextResponse.json({ error: 'Cannot demote the last remaining Super Admin.' }, { status: 400 });
      }
    }

    await query.run(
      'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
      [name.trim(), email.trim().toLowerCase(), role, id]
    );

    const ip = getClientIp(req);
    await logActivity(auth.user.id, auth.user.name, 'Updated User', `Updated user ID ${id} (${email})`, ip);

    return NextResponse.json({ message: 'User updated successfully.' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update user.' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const roleErr = checkRole(auth.user, ['admin']);
    if (roleErr) return NextResponse.json({ error: roleErr.error }, { status: roleErr.status });

    const { id } = await params;
    if (parseInt(id) === auth.user.id) {
      return NextResponse.json({ error: 'You cannot delete your own account.' }, { status: 400 });
    }

    const targetUser = await query.get('SELECT * FROM users WHERE id = ?', [id]);
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    if (targetUser.role === 'admin') {
      const adminCount = await query.get("SELECT COUNT(*) as count FROM users WHERE role = 'admin'");
      if (adminCount.count <= 1) {
        return NextResponse.json({ error: 'Cannot delete the only Super Admin.' }, { status: 400 });
      }
    }

    await query.run('DELETE FROM users WHERE id = ?', [id]);
    const ip = getClientIp(req);
    await logActivity(auth.user.id, auth.user.name, 'Deleted User', `Deleted user ${targetUser.email} (ID ${id})`, ip);

    return NextResponse.json({ message: 'User deleted successfully.' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete user.' }, { status: 500 });
  }
}

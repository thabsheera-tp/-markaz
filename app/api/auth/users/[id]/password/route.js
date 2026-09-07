import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';
import { verifyAuth, logActivity, getClientIp } from '@/lib/auth';

export async function PUT(req, { params }) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { id } = await params;
    const body = await req.json();
    const { newPassword } = body;

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters.' }, { status: 400 });
    }

    if (auth.user.role !== 'admin' && auth.user.id !== parseInt(id)) {
      return NextResponse.json({ error: 'Permission denied to reset this password.' }, { status: 403 });
    }

    const password_hash = await bcrypt.hash(newPassword, 10);
    await query.run('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash, id]);

    const ip = getClientIp(req);
    await logActivity(auth.user.id, auth.user.name, 'Password Reset', `Password reset for user ID ${id}`, ip);

    return NextResponse.json({ message: 'Password updated successfully.' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to reset password.' }, { status: 500 });
  }
}

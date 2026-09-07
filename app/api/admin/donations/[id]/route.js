import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth, checkRole, logActivity, getClientIp } from '@/lib/auth';

export async function DELETE(req, { params }) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const roleErr = checkRole(auth.user, ['admin']);
    if (roleErr) return NextResponse.json({ error: roleErr.error }, { status: roleErr.status });

    const { id } = await params;
    await query.run('DELETE FROM donations WHERE id = ?', [id]);

    const ip = getClientIp(req);
    await logActivity(auth.user.id, auth.user.name, 'Deleted Donation', `Deleted donation ID ${id}`, ip);

    return NextResponse.json({ message: 'Donation deleted.' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete donation.' }, { status: 500 });
  }
}

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
    const { status } = body;

    if (!['Completed', 'Pending', 'Failed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
    }

    await query.run('UPDATE donations SET status = ? WHERE id = ?', [status, id]);

    const ip = getClientIp(req);
    await logActivity(auth.user.id, auth.user.name, 'Updated Donation Status', `Set donation ID ${id} status to ${status}`, ip);

    return NextResponse.json({ message: 'Donation status updated.' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update donation status.' }, { status: 500 });
  }
}

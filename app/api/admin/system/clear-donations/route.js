import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth, checkRole, logActivity, getClientIp } from '@/lib/auth';

export async function POST(req) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const roleErr = checkRole(auth.user, ['admin']);
    if (roleErr) return NextResponse.json({ error: roleErr.error }, { status: roleErr.status });

    if (process.env.NODE_ENV === 'production' && req.headers.get('x-confirm-destructive') !== 'CONFIRM_CLEAR') {
      return NextResponse.json({
        error: 'Clearing all donations is locked in production. Manual confirmation required.'
      }, { status: 403 });
    }

    await query.run('DELETE FROM donations');

    const ip = getClientIp(req);
    await logActivity(auth.user.id, auth.user.name, 'DANGER: Cleared Donations', 'Wiped all donation records from database', ip);

    return NextResponse.json({ message: 'All donation records cleared successfully.' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to clear donations.' }, { status: 500 });
  }
}

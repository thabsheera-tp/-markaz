import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed';
import { verifyAuth, checkRole, logActivity, getClientIp } from '@/lib/auth';

export async function POST(req) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const roleErr = checkRole(auth.user, ['admin']);
    if (roleErr) return NextResponse.json({ error: roleErr.error }, { status: roleErr.status });

    await seedDatabase(true);

    const ip = getClientIp(req);
    await logActivity(auth.user.id, auth.user.name, 'Reset Database', 'Restored sample mock data across all tables', ip);

    return NextResponse.json({ message: 'Database reset to clean sample data successfully.' });
  } catch (err) {
    console.error('Reset mock error:', err);
    return NextResponse.json({ error: 'Failed to reset mock data.' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(req) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const logs = await query.all('SELECT * FROM activity_logs ORDER BY id DESC LIMIT 100');
    return NextResponse.json({ logs });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch activity logs.' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(req) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const missionVision = await query.all('SELECT * FROM mission_vision ORDER BY id ASC');
    return NextResponse.json({ mission_vision: missionVision });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch mission and vision.' }, { status: 500 });
  }
}

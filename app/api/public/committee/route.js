import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const committee = await query.all(
      'SELECT id, name, designation, role_type, photo_url, phone, email, term_period, bio, order_num FROM temporary_committee WHERE is_active = 1 ORDER BY order_num ASC, id ASC'
    );
    return NextResponse.json({ committee });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load committee members.' }, { status: 500 });
  }
}

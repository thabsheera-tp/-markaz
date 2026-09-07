import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const announcements = await query.all(
      'SELECT id, title, category, event_date, event_time, location, content, image_url, link_url, is_featured, order_num FROM announcements WHERE is_active = 1 ORDER BY order_num ASC, id ASC'
    );
    return NextResponse.json({ announcements });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load announcements.' }, { status: 500 });
  }
}

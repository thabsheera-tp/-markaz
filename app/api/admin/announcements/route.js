import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth, checkRole, logActivity, getClientIp } from '@/lib/auth';

export async function GET(req) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const announcements = await query.all('SELECT * FROM announcements ORDER BY order_num ASC, id ASC');
    return NextResponse.json({ announcements });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch announcements.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const roleErr = checkRole(auth.user, ['admin', 'editor']);
    if (roleErr) return NextResponse.json({ error: roleErr.error }, { status: roleErr.status });

    const body = await req.json();
    const { title, category, event_date, event_time, location, content, image_url, link_url, is_featured, is_active, order_num } = body;

    if (!title || !category || !content) {
      return NextResponse.json({ error: 'Title, category, and content are required.' }, { status: 400 });
    }

    const result = await query.run(
      `INSERT INTO announcements (title, category, event_date, event_time, location, content, image_url, link_url, is_featured, is_active, order_num)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title.trim(), category, event_date, event_time, location, content, image_url, link_url, is_featured ? 1 : 0, is_active !== undefined ? is_active : 1, order_num || 0]
    );

    const ip = getClientIp(req);
    await logActivity(auth.user.id, auth.user.name, 'Created Announcement', `Added ${category}: "${title}"`, ip);

    return NextResponse.json({ message: 'Announcement created successfully.', id: result.lastID }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create announcement.' }, { status: 500 });
  }
}

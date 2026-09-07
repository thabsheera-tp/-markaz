import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth, checkRole, logActivity, getClientIp } from '@/lib/auth';

export async function GET(req) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const slides = await query.all('SELECT * FROM hero_slides ORDER BY order_num ASC, id ASC');
    return NextResponse.json({ slides });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch hero slides.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const roleErr = checkRole(auth.user, ['admin', 'editor']);
    if (roleErr) return NextResponse.json({ error: roleErr.error }, { status: roleErr.status });

    const body = await req.json();
    const { image_url, title, subtitle, button_text, button_link, order_num, is_active } = body;

    if (!image_url || !title) {
      return NextResponse.json({ error: 'Image URL and title are required.' }, { status: 400 });
    }

    const result = await query.run(
      `INSERT INTO hero_slides (image_url, title, subtitle, button_text, button_link, order_num, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [image_url, title, subtitle, button_text, button_link, order_num || 0, is_active !== undefined ? is_active : 1]
    );

    const ip = getClientIp(req);
    await logActivity(auth.user.id, auth.user.name, 'Created Hero Slide', `Added slide "${title}"`, ip);

    return NextResponse.json({ message: 'Slide created successfully.', id: result.lastID }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create slide.' }, { status: 500 });
  }
}

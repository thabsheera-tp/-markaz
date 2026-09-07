import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth, checkRole, logActivity, getClientIp } from '@/lib/auth';

export async function GET(req) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const about = await query.get('SELECT * FROM about WHERE id = 1');
    if (about && about.stats_json) {
      try {
        about.stats = JSON.parse(about.stats_json);
      } catch (e) {
        about.stats = [];
      }
    }
    return NextResponse.json({ about: about || {} });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch about data.' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const roleErr = checkRole(auth.user, ['admin', 'editor']);
    if (roleErr) return NextResponse.json({ error: roleErr.error }, { status: roleErr.status });

    const body = await req.json();
    const { title, content, image_url, stats } = body;
    const stats_json = stats ? JSON.stringify(stats) : null;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    await query.run(
      `INSERT INTO about (id, title, content, image_url, stats_json, updated_at)
       VALUES (1, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET title = excluded.title, content = excluded.content, image_url = excluded.image_url, stats_json = excluded.stats_json, updated_at = excluded.updated_at`,
      [title, content, image_url, stats_json, now]
    );

    const ip = getClientIp(req);
    await logActivity(auth.user.id, auth.user.name, 'Updated About Us', 'Updated About Us section & stats', ip);

    return NextResponse.json({ message: 'About Us updated successfully.' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update about section.' }, { status: 500 });
  }
}

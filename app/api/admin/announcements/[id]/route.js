import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth, checkRole, logActivity, getClientIp } from '@/lib/auth';

export async function PUT(req, { params }) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const roleErr = checkRole(auth.user, ['admin', 'editor']);
    if (roleErr) return NextResponse.json({ error: roleErr.error }, { status: roleErr.status });

    const { id } = await params;
    const body = await req.json();
    const { title, category, event_date, event_time, location, content, image_url, link_url, is_featured, is_active, order_num } = body;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    await query.run(
      `UPDATE announcements SET title = ?, category = ?, event_date = ?, event_time = ?, location = ?, content = ?, image_url = ?, link_url = ?, is_featured = ?, is_active = ?, order_num = ?, updated_at = ?
       WHERE id = ?`,
      [title.trim(), category, event_date, event_time, location, content, image_url, link_url, is_featured ? 1 : 0, is_active, order_num, now, id]
    );

    const ip = getClientIp(req);
    await logActivity(auth.user.id, auth.user.name, 'Updated Announcement', `Updated ${category} ID ${id} ("${title}")`, ip);

    return NextResponse.json({ message: 'Announcement updated successfully.' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update announcement.' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const roleErr = checkRole(auth.user, ['admin']);
    if (roleErr) return NextResponse.json({ error: roleErr.error }, { status: roleErr.status });

    const { id } = await params;
    await query.run('DELETE FROM announcements WHERE id = ?', [id]);

    const ip = getClientIp(req);
    await logActivity(auth.user.id, auth.user.name, 'Deleted Announcement', `Deleted announcement ID ${id}`, ip);

    return NextResponse.json({ message: 'Announcement deleted successfully.' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete announcement.' }, { status: 500 });
  }
}

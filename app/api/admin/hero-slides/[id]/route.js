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
    const { image_url, title, subtitle, button_text, button_link, order_num, is_active } = body;

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    await query.run(
      `UPDATE hero_slides SET image_url = ?, title = ?, subtitle = ?, button_text = ?, button_link = ?, order_num = ?, is_active = ?, updated_at = ?
       WHERE id = ?`,
      [image_url, title, subtitle, button_text, button_link, order_num, is_active, now, id]
    );

    const ip = getClientIp(req);
    await logActivity(auth.user.id, auth.user.name, 'Updated Hero Slide', `Updated slide ID ${id} (${title})`, ip);

    return NextResponse.json({ message: 'Slide updated successfully.' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update slide.' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const roleErr = checkRole(auth.user, ['admin']);
    if (roleErr) return NextResponse.json({ error: roleErr.error }, { status: roleErr.status });

    const { id } = await params;
    await query.run('DELETE FROM hero_slides WHERE id = ?', [id]);

    const ip = getClientIp(req);
    await logActivity(auth.user.id, auth.user.name, 'Deleted Hero Slide', `Deleted slide ID ${id}`, ip);

    return NextResponse.json({ message: 'Slide deleted successfully.' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete slide.' }, { status: 500 });
  }
}

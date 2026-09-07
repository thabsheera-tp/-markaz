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
    const { name, description, icon_url, category, order_num, is_active, enrollment_count } = body;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    await query.run(
      `UPDATE institutions SET name = ?, description = ?, icon_url = ?, category = ?, order_num = ?, is_active = ?, enrollment_count = ?, updated_at = ?
       WHERE id = ?`,
      [name.trim(), description, icon_url, category, order_num, is_active, enrollment_count, now, id]
    );

    const ip = getClientIp(req);
    await logActivity(auth.user.id, auth.user.name, 'Updated Institution', `Updated institution ID ${id} (${name})`, ip);

    return NextResponse.json({ message: 'Institution updated successfully.' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update institution.' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const roleErr = checkRole(auth.user, ['admin']);
    if (roleErr) return NextResponse.json({ error: roleErr.error }, { status: roleErr.status });

    const { id } = await params;
    await query.run('DELETE FROM institutions WHERE id = ?', [id]);

    const ip = getClientIp(req);
    await logActivity(auth.user.id, auth.user.name, 'Deleted Institution', `Deleted institution ID ${id}`, ip);

    return NextResponse.json({ message: 'Institution deleted successfully.' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete institution.' }, { status: 500 });
  }
}

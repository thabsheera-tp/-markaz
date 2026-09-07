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
    const { name, designation, role_type, photo_url, phone, email, term_period, bio, order_num, is_active } = body;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    await query.run(
      `UPDATE temporary_committee SET name = ?, designation = ?, role_type = ?, photo_url = ?, phone = ?, email = ?, term_period = ?, bio = ?, order_num = ?, is_active = ?, updated_at = ?
       WHERE id = ?`,
      [name.trim(), designation.trim(), role_type, photo_url, phone, email, term_period, bio, order_num, is_active, now, id]
    );

    const ip = getClientIp(req);
    await logActivity(auth.user.id, auth.user.name, 'Updated Committee Member', `Updated member ID ${id} (${name})`, ip);

    return NextResponse.json({ message: 'Committee member updated successfully.' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update committee member.' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const roleErr = checkRole(auth.user, ['admin']);
    if (roleErr) return NextResponse.json({ error: roleErr.error }, { status: roleErr.status });

    const { id } = await params;
    await query.run('DELETE FROM temporary_committee WHERE id = ?', [id]);

    const ip = getClientIp(req);
    await logActivity(auth.user.id, auth.user.name, 'Deleted Committee Member', `Deleted member ID ${id}`, ip);

    return NextResponse.json({ message: 'Committee member deleted successfully.' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete committee member.' }, { status: 500 });
  }
}

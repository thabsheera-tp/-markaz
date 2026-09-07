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
    const { title, description, icon } = body;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    await query.run(
      'UPDATE mission_vision SET title = ?, description = ?, icon = ?, updated_at = ? WHERE id = ?',
      [title, description, icon, now, id]
    );

    const ip = getClientIp(req);
    await logActivity(auth.user.id, auth.user.name, 'Updated Mission/Vision', `Updated item ID ${id} (${title})`, ip);

    return NextResponse.json({ message: 'Updated successfully.' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update mission/vision item.' }, { status: 500 });
  }
}

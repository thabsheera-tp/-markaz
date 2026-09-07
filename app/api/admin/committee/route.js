import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth, checkRole, logActivity, getClientIp } from '@/lib/auth';

export async function GET(req) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const committee = await query.all('SELECT * FROM temporary_committee ORDER BY order_num ASC, id ASC');
    return NextResponse.json({ committee });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch committee members.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const roleErr = checkRole(auth.user, ['admin', 'editor']);
    if (roleErr) return NextResponse.json({ error: roleErr.error }, { status: roleErr.status });

    const body = await req.json();
    const { name, designation, role_type, photo_url, phone, email, term_period, bio, order_num, is_active } = body;

    if (!name || !designation) {
      return NextResponse.json({ error: 'Name and designation are required.' }, { status: 400 });
    }

    const result = await query.run(
      `INSERT INTO temporary_committee (name, designation, role_type, photo_url, phone, email, term_period, bio, order_num, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name.trim(), designation.trim(), role_type || 'other', photo_url, phone, email, term_period, bio, order_num || 0, is_active !== undefined ? is_active : 1]
    );

    const ip = getClientIp(req);
    await logActivity(auth.user.id, auth.user.name, 'Added Committee Member', `Added ${name} (${designation})`, ip);

    return NextResponse.json({ message: 'Committee member added successfully.', id: result.lastID }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to add committee member.' }, { status: 500 });
  }
}

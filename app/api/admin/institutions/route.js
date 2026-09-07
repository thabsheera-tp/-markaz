import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth, checkRole, logActivity, getClientIp } from '@/lib/auth';

export async function GET(req) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const institutions = await query.all('SELECT * FROM institutions ORDER BY order_num ASC, id ASC');
    return NextResponse.json({ institutions });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch institutions.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const roleErr = checkRole(auth.user, ['admin', 'editor']);
    if (roleErr) return NextResponse.json({ error: roleErr.error }, { status: roleErr.status });

    const body = await req.json();
    const { name, description, icon_url, category, order_num, is_active, enrollment_count } = body;

    if (!name || !description || !category) {
      return NextResponse.json({ error: 'Name, description, and category are required.' }, { status: 400 });
    }

    const result = await query.run(
      `INSERT INTO institutions (name, description, icon_url, category, order_num, is_active, enrollment_count)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name.trim(), description, icon_url, category, order_num || 0, is_active !== undefined ? is_active : 1, enrollment_count || 0]
    );

    const ip = getClientIp(req);
    await logActivity(auth.user.id, auth.user.name, 'Created Institution', `Added institution "${name}"`, ip);

    return NextResponse.json({ message: 'Institution created successfully.', id: result.lastID }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create institution.' }, { status: 500 });
  }
}

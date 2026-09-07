import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth, checkRole, logActivity, getClientIp } from '@/lib/auth';

export async function GET(req) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const footer = await query.get('SELECT * FROM footer_settings WHERE id = 1');
    return NextResponse.json({ footer_settings: footer || {} });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch footer settings.' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const roleErr = checkRole(auth.user, ['admin']);
    if (roleErr) return NextResponse.json({ error: roleErr.error }, { status: roleErr.status });

    const body = await req.json();
    const { address, phone, email, facebook, instagram, youtube, whatsapp } = body;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    await query.run(
      `INSERT INTO footer_settings (id, address, phone, email, facebook, instagram, youtube, whatsapp, updated_at)
       VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         address = excluded.address,
         phone = excluded.phone,
         email = excluded.email,
         facebook = excluded.facebook,
         instagram = excluded.instagram,
         youtube = excluded.youtube,
         whatsapp = excluded.whatsapp,
         updated_at = excluded.updated_at`,
      [address, phone, email, facebook, instagram, youtube, whatsapp, now]
    );

    const ip = getClientIp(req);
    await logActivity(auth.user.id, auth.user.name, 'Updated Footer Settings', 'Updated contact and social media details', ip);

    return NextResponse.json({ message: 'Footer settings updated successfully.' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update footer settings.' }, { status: 500 });
  }
}

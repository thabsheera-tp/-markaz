import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth, checkRole, logActivity, getClientIp } from '@/lib/auth';

export async function GET(req) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const settings = await query.get('SELECT * FROM donation_settings WHERE id = 1');
    if (settings && settings.preset_amounts) {
      try {
        settings.presets = JSON.parse(settings.preset_amounts);
      } catch (e) {
        settings.presets = [500, 1000, 2500, 5000];
      }
    }
    return NextResponse.json({ donation_settings: settings || {} });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch donation settings.' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const roleErr = checkRole(auth.user, ['admin']);
    if (roleErr) return NextResponse.json({ error: roleErr.error }, { status: roleErr.status });

    const body = await req.json();
    const {
      preset_amounts,
      custom_enabled,
      qr_code_url,
      upi_id,
      merchant_name,
      bank_name,
      branch_name,
      account_number,
      ifsc_code,
      account_name,
      google_pay_number
    } = body;
    const presetsStr = typeof preset_amounts === 'string' ? preset_amounts : JSON.stringify(preset_amounts || [500, 1000, 2500, 5000]);
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    await query.run(
      `INSERT INTO donation_settings (
        id, preset_amounts, custom_enabled, qr_code_url, upi_id, merchant_name,
        bank_name, branch_name, account_number, ifsc_code, account_name, google_pay_number, updated_at
      )
       VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         preset_amounts = excluded.preset_amounts,
         custom_enabled = excluded.custom_enabled,
         qr_code_url = excluded.qr_code_url,
         upi_id = excluded.upi_id,
         merchant_name = excluded.merchant_name,
         bank_name = excluded.bank_name,
         branch_name = excluded.branch_name,
         account_number = excluded.account_number,
         ifsc_code = excluded.ifsc_code,
         account_name = excluded.account_name,
         google_pay_number = excluded.google_pay_number,
         updated_at = excluded.updated_at`,
      [
        presetsStr,
        custom_enabled !== undefined ? (custom_enabled ? 1 : 0) : 1,
        qr_code_url,
        upi_id,
        merchant_name,
        bank_name || 'FEDERAL BANK',
        branch_name || 'TALIPPARAMBA',
        account_number || '11270100353081',
        ifsc_code || 'FDRL0001127',
        account_name || 'MARKAZU DA-WATHIL ISLAMIYYA, KOYYAM',
        google_pay_number || '9656790577',
        now
      ]
    );

    const ip = getClientIp(req);
    await logActivity(auth.user.id, auth.user.name, 'Updated Donation Settings', `Updated bank details & UPI ID to ${upi_id}`, ip);

    return NextResponse.json({ message: 'Donation settings updated successfully.' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update donation settings.' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth, checkRole } from '@/lib/auth';

export async function GET(req) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const roleErr = checkRole(auth.user, ['admin', 'editor', 'viewer']);
    if (roleErr) {
      return NextResponse.json({ error: roleErr.error }, { status: roleErr.status });
    }

    const donations = await query.all('SELECT * FROM donations ORDER BY date DESC');

    const headers = ['ID', 'Donor Name', 'Phone', 'Amount (INR)', 'Payment Method', 'Transaction ID', 'Status', 'Prayer Request', 'Date'];
    const rows = donations.map(d => [
      d.id,
      `"${(d.donor_name || '').replace(/"/g, '""')}"`,
      `"${(d.donor_phone || '').replace(/"/g, '""')}"`,
      d.amount,
      d.payment_method,
      `"${(d.upi_transaction_id || '').replace(/"/g, '""')}"`,
      d.status,
      `"${(d.prayer_request || '').replace(/"/g, '""')}"`,
      `"${d.date}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="koyyam_markaz_donations.csv"'
      }
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to export CSV.' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '@/lib/db';
import { JWT_SECRET } from '@/lib/auth';

export async function GET(req) {
  try {
    const authHeader = req.headers.get('authorization');
    const headerToken = authHeader && authHeader.split(' ')[1];
    const { searchParams } = new URL(req.url);
    const queryToken = searchParams.get('token');
    const token = headerToken || queryToken;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 403 });
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

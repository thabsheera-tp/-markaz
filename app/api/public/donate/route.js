import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { logActivity, getClientIp } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(req) {
  try {
    const ip = getClientIp(req);
    const rateLimit = await checkRateLimit(`donate:${ip}`, 10, 10 * 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many donation submissions from this IP. Please try again shortly.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { donor_name, donor_phone, amount, payment_method, upi_transaction_id, prayer_request } = body;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json({ error: 'Please enter a valid donation amount.' }, { status: 400 });
    }

    const method = payment_method || 'UPI';
    // For manual UPI / Bank QR transfers, default to Pending until admin verifies reference in bank account
    const status = 'Pending';
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const result = await query.run(
      `INSERT INTO donations (donor_name, donor_phone, amount, payment_method, upi_transaction_id, prayer_request, status, date, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        donor_name?.trim() || 'Anonymous Philanthropist',
        donor_phone?.trim() || null,
        numAmount,
        method,
        upi_transaction_id?.trim() || null,
        prayer_request?.trim() || null,
        status,
        now,
        now
      ]
    );

    await logActivity(
      null,
      donor_name?.trim() || 'Anonymous Donor',
      'Donation Received',
      `Received ₹${numAmount.toLocaleString('en-IN')} via ${method} (${status})`,
      ip
    );

    return NextResponse.json({
      message: 'Thank you for your noble contribution to Koyyam Markaz!',
      donation: {
        id: result.lastID,
        donor_name: donor_name || 'Anonymous Philanthropist',
        amount: numAmount,
        payment_method: method,
        status,
        date: now
      }
    }, { status: 201 });
  } catch (err) {
    console.error('Donation error:', err);
    return NextResponse.json({ error: 'Failed to record donation.' }, { status: 500 });
  }
}

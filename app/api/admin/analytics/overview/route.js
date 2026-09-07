import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(req) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const totalRow = await query.get(
      "SELECT COALESCE(SUM(amount), 0) as total_amount, COUNT(*) as count FROM donations WHERE status = 'Completed'"
    );

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const startOfMonthStr = startOfMonth.toISOString().replace('T', ' ').substring(0, 19);

    const monthRow = await query.get(
      "SELECT COALESCE(SUM(amount), 0) as month_amount, COUNT(*) as count FROM donations WHERE status = 'Completed' AND date >= ?",
      [startOfMonthStr]
    );

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const startOfDayStr = startOfDay.toISOString().replace('T', ' ').substring(0, 19);

    const todayRow = await query.get(
      "SELECT COALESCE(SUM(amount), 0) as today_amount, COUNT(*) as count FROM donations WHERE status = 'Completed' AND date >= ?",
      [startOfDayStr]
    );

    const avgDonation = totalRow.count > 0 ? Math.round(totalRow.total_amount / totalRow.count) : 0;

    const monthlyTrends = await query.all(`
      SELECT 
        strftime('%Y-%m', date) as month,
        SUM(CASE WHEN status = 'Completed' THEN amount ELSE 0 END) as total_amount,
        COUNT(*) as total_donations
      FROM donations
      WHERE date >= date('now', '-6 months')
      GROUP BY month
      ORDER BY month ASC
    `);

    const sources = await query.all(`
      SELECT 
        payment_method,
        COUNT(*) as count,
        COALESCE(SUM(amount), 0) as total_amount
      FROM donations
      WHERE status = 'Completed'
      GROUP BY payment_method
    `);

    const totalStudents = await query.get('SELECT COUNT(*) as count FROM students');
    const studentsByInstitution = await query.all(`
      SELECT 
        i.name as institution_name,
        i.category,
        COUNT(s.id) as enrolled_count
      FROM institutions i
      LEFT JOIN students s ON s.institution_id = i.id
      GROUP BY i.id
      ORDER BY enrolled_count DESC
    `);

    const activeInstitutionsCount = await query.get('SELECT COUNT(*) as count FROM institutions WHERE is_active = 1');

    const recentDonations = await query.all(
      'SELECT id, donor_name, amount, payment_method, status, date FROM donations ORDER BY date DESC LIMIT 8'
    );

    const recentActivities = await query.all(
      'SELECT id, user_name, action, details, created_at FROM activity_logs ORDER BY id DESC LIMIT 10'
    );

    return NextResponse.json({
      kpis: {
        total_collected: totalRow.total_amount,
        total_donations_count: totalRow.count,
        this_month: monthRow.month_amount,
        today: todayRow.today_amount,
        today_count: todayRow.count,
        avg_donation: avgDonation,
        total_students: totalStudents.count,
        active_institutions: activeInstitutionsCount.count
      },
      monthly_trends: monthlyTrends,
      sources,
      students_by_institution: studentsByInstitution,
      recent_donations: recentDonations,
      recent_activities: recentActivities
    });
  } catch (err) {
    console.error('Analytics overview error:', err);
    return NextResponse.json({ error: 'Failed to calculate analytics.' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(req) {
  try {
    const auth = verifyAuth(req);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    // Total all-time completed donations
    const totalRow = await query.get(
      "SELECT COALESCE(SUM(amount), 0) as total_amount, COUNT(*) as count FROM donations WHERE status = 'Completed'"
    );

    // This month's completed donations (PostgreSQL date_trunc)
    const monthRow = await query.get(
      "SELECT COALESCE(SUM(amount), 0) as month_amount, COUNT(*) as count FROM donations WHERE status = 'Completed' AND date >= date_trunc('month', NOW())"
    );

    // Today's completed donations
    const todayRow = await query.get(
      "SELECT COALESCE(SUM(amount), 0) as today_amount, COUNT(*) as count FROM donations WHERE status = 'Completed' AND date >= date_trunc('day', NOW())"
    );

    const avgDonation = totalRow && totalRow.count > 0 ? Math.round(totalRow.total_amount / totalRow.count) : 0;

    // Monthly trends — last 6 months (PostgreSQL TO_CHAR + INTERVAL)
    const monthlyTrends = await query.all(`
      SELECT 
        TO_CHAR(date, 'YYYY-MM') as month,
        SUM(CASE WHEN status = 'Completed' THEN amount ELSE 0 END) as total_amount,
        COUNT(*) as total_donations
      FROM donations
      WHERE date >= NOW() - INTERVAL '6 months'
      GROUP BY month
      ORDER BY month ASC
    `);

    // Payment method breakdown
    const sources = await query.all(`
      SELECT 
        payment_method,
        COUNT(*) as count,
        COALESCE(SUM(amount), 0) as total_amount
      FROM donations
      WHERE status = 'Completed'
      GROUP BY payment_method
    `);

    // Total students
    const totalStudents = await query.get('SELECT COUNT(*) as count FROM students');

    // Students per institution
    const studentsByInstitution = await query.all(`
      SELECT 
        i.name as institution_name,
        i.category,
        COUNT(s.id) as enrolled_count
      FROM institutions i
      LEFT JOIN students s ON s.institution_id = i.id
      GROUP BY i.id, i.name, i.category
      ORDER BY enrolled_count DESC
    `);

    // Active institutions count
    const activeInstitutionsCount = await query.get('SELECT COUNT(*) as count FROM institutions WHERE is_active = 1');

    // Recent donations
    const recentDonations = await query.all(
      'SELECT id, donor_name, amount, payment_method, status, date FROM donations ORDER BY date DESC LIMIT 8'
    );

    // Recent activity logs
    const recentActivities = await query.all(
      'SELECT id, user_name, action, details, created_at FROM activity_logs ORDER BY id DESC LIMIT 10'
    );

    return NextResponse.json({
      kpis: {
        total_collected: totalRow ? Number(totalRow.total_amount) : 0,
        total_donations_count: totalRow ? Number(totalRow.count) : 0,
        this_month: monthRow ? Number(monthRow.month_amount) : 0,
        today: todayRow ? Number(todayRow.today_amount) : 0,
        today_count: todayRow ? Number(todayRow.count) : 0,
        avg_donation: avgDonation,
        total_students: totalStudents ? Number(totalStudents.count) : 0,
        active_institutions: activeInstitutionsCount ? Number(activeInstitutionsCount.count) : 0
      },
      monthly_trends: monthlyTrends,
      sources,
      students_by_institution: studentsByInstitution,
      recent_donations: recentDonations,
      recent_activities: recentActivities
    });
  } catch (err) {
    console.error('Analytics overview error:', err);
    return NextResponse.json({ error: 'Failed to calculate analytics.', detail: err.message }, { status: 500 });
  }
}

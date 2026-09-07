import express from 'express';
import { query } from '../db.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { logActivity } from './auth.js';
import { seedDatabase } from '../seed.js';

const router = express.Router();

// Apply auth middleware to all admin endpoints
router.use(authenticateToken);

// ==================== 1. ANALYTICS & TRACKER ====================

// GET /api/admin/analytics/overview
router.get('/analytics/overview', async (req, res) => {
  try {
    // Total donations all-time
    const totalRow = await query.get(
      "SELECT COALESCE(SUM(amount), 0) as total_amount, COUNT(*) as count FROM donations WHERE status = 'Completed'"
    );

    // This month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const startOfMonthStr = startOfMonth.toISOString().replace('T', ' ').substring(0, 19);

    const monthRow = await query.get(
      "SELECT COALESCE(SUM(amount), 0) as month_amount, COUNT(*) as count FROM donations WHERE status = 'Completed' AND date >= ?",
      [startOfMonthStr]
    );

    // Today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const startOfDayStr = startOfDay.toISOString().replace('T', ' ').substring(0, 19);

    const todayRow = await query.get(
      "SELECT COALESCE(SUM(amount), 0) as today_amount, COUNT(*) as count FROM donations WHERE status = 'Completed' AND date >= ?",
      [startOfDayStr]
    );

    const avgDonation = totalRow.count > 0 ? Math.round(totalRow.total_amount / totalRow.count) : 0;

    // Monthly trends for the last 6 months
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

    // Sources breakdown (UPI vs Bank vs Cash)
    const sources = await query.all(`
      SELECT 
        payment_method,
        COUNT(*) as count,
        COALESCE(SUM(amount), 0) as total_amount
      FROM donations
      WHERE status = 'Completed'
      GROUP BY payment_method
    `);

    // Student counts
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

    // Course popularity list
    const activeInstitutionsCount = await query.get('SELECT COUNT(*) as count FROM institutions WHERE is_active = 1');

    // Recent donations (last 8)
    const recentDonations = await query.all(
      'SELECT id, donor_name, amount, payment_method, status, date FROM donations ORDER BY date DESC LIMIT 8'
    );

    // Recent activity logs (last 10)
    const recentActivities = await query.all(
      'SELECT id, user_name, action, details, created_at FROM activity_logs ORDER BY id DESC LIMIT 10'
    );

    res.json({
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
    res.status(500).json({ error: 'Failed to calculate analytics.' });
  }
});

// ==================== 2. DONATION TRACKER ====================

// GET /api/admin/donations (Search, filter, paginate)
router.get('/donations', async (req, res) => {
  try {
    const { search, status, payment_method, startDate, endDate, limit = 50, page = 1 } = req.query;

    let sql = 'SELECT * FROM donations WHERE 1=1';
    let countSql = 'SELECT COUNT(*) as total FROM donations WHERE 1=1';
    const params = [];
    const countParams = [];

    if (search) {
      const s = `%${search.trim()}%`;
      sql += ' AND (donor_name LIKE ? OR upi_transaction_id LIKE ? OR donor_phone LIKE ?)';
      countSql += ' AND (donor_name LIKE ? OR upi_transaction_id LIKE ? OR donor_phone LIKE ?)';
      params.push(s, s, s);
      countParams.push(s, s, s);
    }

    if (status && status !== 'all') {
      sql += ' AND status = ?';
      countSql += ' AND status = ?';
      params.push(status);
      countParams.push(status);
    }

    if (payment_method && payment_method !== 'all') {
      sql += ' AND payment_method = ?';
      countSql += ' AND payment_method = ?';
      params.push(payment_method);
      countParams.push(payment_method);
    }

    if (startDate) {
      sql += ' AND date >= ?';
      countSql += ' AND date >= ?';
      params.push(startDate);
      countParams.push(startDate);
    }

    if (endDate) {
      sql += ' AND date <= ?';
      countSql += ' AND date <= ?';
      params.push(endDate + ' 23:59:59');
      countParams.push(endDate + ' 23:59:59');
    }

    sql += ' ORDER BY date DESC LIMIT ? OFFSET ?';
    const offset = (parseInt(page) - 1) * parseInt(limit);
    params.push(parseInt(limit), offset);

    const donations = await query.all(sql, params);
    const totalRow = await query.get(countSql, countParams);

    res.json({
      donations,
      total: totalRow.total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (err) {
    console.error('Fetch donations error:', err);
    res.status(500).json({ error: 'Failed to fetch donations.' });
  }
});

// GET /api/admin/donations/export/csv
router.get('/donations/export/csv', async (req, res) => {
  try {
    const donations = await query.all('SELECT * FROM donations ORDER BY date DESC');
    
    // Build CSV
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

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="koyyam_markaz_donations.csv"');
    res.send(csvContent);
  } catch (err) {
    res.status(500).json({ error: 'Failed to export CSV.' });
  }
});

// POST /api/admin/donations (Manual entry)
router.post('/donations', requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { donor_name, donor_phone, amount, payment_method, upi_transaction_id, prayer_request, status, date } = req.body;
    const dateStr = date || new Date().toISOString().replace('T', ' ').substring(0, 19);

    const result = await query.run(
      `INSERT INTO donations (donor_name, donor_phone, amount, payment_method, upi_transaction_id, prayer_request, status, date, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [donor_name || 'Anonymous', donor_phone, parseFloat(amount), payment_method || 'Cash', upi_transaction_id, prayer_request, status || 'Completed', dateStr, dateStr]
    );

    await logActivity(req.user.id, req.user.name, 'Added Donation Record', `Recorded ₹${amount} for ${donor_name}`, req.ip);

    res.status(201).json({ message: 'Donation recorded successfully.', id: result.lastID });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create donation record.' });
  }
});

// PUT /api/admin/donations/:id/status
router.put('/donations/:id/status', requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Completed', 'Pending', 'Failed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    await query.run('UPDATE donations SET status = ? WHERE id = ?', [status, id]);
    await logActivity(req.user.id, req.user.name, 'Updated Donation Status', `Set donation ID ${id} status to ${status}`, req.ip);

    res.json({ message: 'Donation status updated.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update donation status.' });
  }
});

// DELETE /api/admin/donations/:id
router.delete('/donations/:id', requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    await query.run('DELETE FROM donations WHERE id = ?', [id]);
    await logActivity(req.user.id, req.user.name, 'Deleted Donation', `Deleted donation ID ${id}`, req.ip);
    res.json({ message: 'Donation deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete donation.' });
  }
});

// ==================== 3. STUDENT / ENROLLMENT TRACKER ====================

// GET /api/admin/students
router.get('/students', async (req, res) => {
  try {
    const { search, institution_id, fee_status } = req.query;
    let sql = `
      SELECT s.*, i.name as institution_name
      FROM students s
      LEFT JOIN institutions i ON s.institution_id = i.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      const s = `%${search.trim()}%`;
      sql += ' AND (s.name LIKE ? OR s.email LIKE ? OR s.phone LIKE ?)';
      params.push(s, s, s);
    }
    if (institution_id && institution_id !== 'all') {
      sql += ' AND s.institution_id = ?';
      params.push(institution_id);
    }
    if (fee_status && fee_status !== 'all') {
      sql += ' AND s.fee_status = ?';
      params.push(fee_status);
    }

    sql += ' ORDER BY s.id DESC';
    const students = await query.all(sql, params);
    res.json({ students });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students.' });
  }
});

// POST /api/admin/students
router.post('/students', requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { name, email, phone, institution_id, enrollment_date, fee_status } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Student name is required.' });
    }

    const dateStr = enrollment_date || new Date().toISOString().split('T')[0];
    const result = await query.run(
      `INSERT INTO students (name, email, phone, institution_id, enrollment_date, fee_status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name.trim(), email?.trim() || null, phone?.trim() || null, institution_id || null, dateStr, fee_status || 'Paid']
    );

    // Increment institution enrollment_count
    if (institution_id) {
      await query.run('UPDATE institutions SET enrollment_count = enrollment_count + 1 WHERE id = ?', [institution_id]);
    }

    await logActivity(req.user.id, req.user.name, 'Enrolled Student', `Enrolled ${name} (ID: ${result.lastID})`, req.ip);

    res.status(201).json({ message: 'Student registered successfully.', id: result.lastID });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add student.' });
  }
});

// PUT /api/admin/students/:id
router.put('/students/:id', requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, institution_id, enrollment_date, fee_status } = req.body;

    await query.run(
      `UPDATE students SET name = ?, email = ?, phone = ?, institution_id = ?, enrollment_date = ?, fee_status = ?
       WHERE id = ?`,
      [name.trim(), email, phone, institution_id, enrollment_date, fee_status, id]
    );

    await logActivity(req.user.id, req.user.name, 'Updated Student', `Updated details for student ID ${id}`, req.ip);
    res.json({ message: 'Student updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update student.' });
  }
});

// DELETE /api/admin/students/:id
router.delete('/students/:id', requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const student = await query.get('SELECT * FROM students WHERE id = ?', [id]);
    if (student && student.institution_id) {
      await query.run('UPDATE institutions SET enrollment_count = MAX(0, enrollment_count - 1) WHERE id = ?', [student.institution_id]);
    }
    await query.run('DELETE FROM students WHERE id = ?', [id]);
    await logActivity(req.user.id, req.user.name, 'Deleted Student', `Removed student ID ${id}`, req.ip);
    res.json({ message: 'Student deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete student.' });
  }
});

// ==================== 4. HERO SLIDES CRUD ====================

// GET /api/admin/hero-slides
router.get('/hero-slides', async (req, res) => {
  try {
    const slides = await query.all('SELECT * FROM hero_slides ORDER BY order_num ASC, id ASC');
    res.json({ slides });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hero slides.' });
  }
});

// POST /api/admin/hero-slides
router.post('/hero-slides', requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { image_url, title, subtitle, button_text, button_link, order_num, is_active } = req.body;
    if (!image_url || !title) {
      return res.status(400).json({ error: 'Image URL and Title are required.' });
    }

    const result = await query.run(
      `INSERT INTO hero_slides (image_url, title, subtitle, button_text, button_link, order_num, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [image_url, title, subtitle || null, button_text || null, button_link || null, order_num || 0, is_active ? 1 : 0]
    );

    await logActivity(req.user.id, req.user.name, 'Created Hero Slide', `Added slide "${title}"`, req.ip);
    res.status(201).json({ message: 'Hero slide created.', id: result.lastID });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create hero slide.' });
  }
});

// PUT /api/admin/hero-slides/:id
router.put('/hero-slides/:id', requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { id } = req.params;
    const { image_url, title, subtitle, button_text, button_link, order_num, is_active } = req.body;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    await query.run(
      `UPDATE hero_slides SET image_url = ?, title = ?, subtitle = ?, button_text = ?, button_link = ?, order_num = ?, is_active = ?, updated_at = ?
       WHERE id = ?`,
      [image_url, title, subtitle, button_text, button_link, order_num, is_active ? 1 : 0, now, id]
    );

    await logActivity(req.user.id, req.user.name, 'Updated Hero Slide', `Updated slide ID ${id} (${title})`, req.ip);
    res.json({ message: 'Hero slide updated.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update hero slide.' });
  }
});

// DELETE /api/admin/hero-slides/:id
router.delete('/hero-slides/:id', requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    await query.run('DELETE FROM hero_slides WHERE id = ?', [id]);
    await logActivity(req.user.id, req.user.name, 'Deleted Hero Slide', `Deleted slide ID ${id}`, req.ip);
    res.json({ message: 'Hero slide deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete hero slide.' });
  }
});

// ==================== 5. ABOUT US CRUD ====================

// GET /api/admin/about
router.get('/about', async (req, res) => {
  try {
    const about = await query.get('SELECT * FROM about WHERE id = 1');
    if (about && about.stats_json) {
      try {
        about.stats = JSON.parse(about.stats_json);
      } catch (e) {
        about.stats = [];
      }
    }
    res.json({ about });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch about us.' });
  }
});

// PUT /api/admin/about
router.put('/about', requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { title, content, image_url, stats } = req.body;
    const stats_json = typeof stats === 'string' ? stats : JSON.stringify(stats || []);
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    await query.run(
      `UPDATE about SET title = ?, content = ?, image_url = ?, stats_json = ?, updated_at = ? WHERE id = 1`,
      [title, content, image_url, stats_json, now]
    );

    await logActivity(req.user.id, req.user.name, 'Updated About Section', 'Modified About Us text and metrics', req.ip);
    res.json({ message: 'About Us updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update about section.' });
  }
});

// ==================== 6. MISSION & VISION CRUD ====================

// GET /api/admin/mission-vision
router.get('/mission-vision', async (req, res) => {
  try {
    const items = await query.all('SELECT * FROM mission_vision ORDER BY id ASC');
    res.json({ items });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch mission and vision.' });
  }
});

// PUT /api/admin/mission-vision/:id
router.put('/mission-vision/:id', requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, icon } = req.body;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    await query.run(
      `UPDATE mission_vision SET title = ?, description = ?, icon = ?, updated_at = ? WHERE id = ?`,
      [title, description, icon, now, id]
    );

    await logActivity(req.user.id, req.user.name, 'Updated Mission/Vision', `Updated item ID ${id} (${title})`, req.ip);
    res.json({ message: 'Mission/Vision updated.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update mission/vision.' });
  }
});

// ==================== 7. INSTITUTIONS CRUD ====================

// GET /api/admin/institutions
router.get('/institutions', async (req, res) => {
  try {
    const institutions = await query.all('SELECT * FROM institutions ORDER BY order_num ASC, id ASC');
    res.json({ institutions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch institutions.' });
  }
});

// POST /api/admin/institutions
router.post('/institutions', requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { name, description, icon_url, category, order_num, is_active, enrollment_count } = req.body;
    if (!name || !category) {
      return res.status(400).json({ error: 'Name and Category are required.' });
    }

    const result = await query.run(
      `INSERT INTO institutions (name, description, icon_url, category, order_num, is_active, enrollment_count)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, description || '', icon_url || '', category, order_num || 0, is_active ? 1 : 0, enrollment_count || 0]
    );

    await logActivity(req.user.id, req.user.name, 'Added Institution', `Added new course/institution: ${name}`, req.ip);
    res.status(201).json({ message: 'Institution created.', id: result.lastID });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create institution.' });
  }
});

// PUT /api/admin/institutions/:id
router.put('/institutions/:id', requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon_url, category, order_num, is_active, enrollment_count } = req.body;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    await query.run(
      `UPDATE institutions SET name = ?, description = ?, icon_url = ?, category = ?, order_num = ?, is_active = ?, enrollment_count = ?, updated_at = ?
       WHERE id = ?`,
      [name, description, icon_url, category, order_num, is_active ? 1 : 0, enrollment_count, now, id]
    );

    await logActivity(req.user.id, req.user.name, 'Updated Institution', `Updated institution ID ${id} (${name})`, req.ip);
    res.json({ message: 'Institution updated.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update institution.' });
  }
});

// DELETE /api/admin/institutions/:id
router.delete('/institutions/:id', requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    await query.run('DELETE FROM institutions WHERE id = ?', [id]);
    await logActivity(req.user.id, req.user.name, 'Deleted Institution', `Deleted institution ID ${id}`, req.ip);
    res.json({ message: 'Institution deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete institution.' });
  }
});

// ==================== 8. DONATION SETTINGS CRUD ====================

// GET /api/admin/donation-settings
router.get('/donation-settings', async (req, res) => {
  try {
    const settings = await query.get('SELECT * FROM donation_settings WHERE id = 1');
    if (settings && settings.preset_amounts) {
      try {
        settings.presets = JSON.parse(settings.preset_amounts);
      } catch (e) {
        settings.presets = [500, 1000, 2500, 5000];
      }
    }
    res.json({ settings });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch donation settings.' });
  }
});

// PUT /api/admin/donation-settings
router.put('/donation-settings', requireRole(['admin']), async (req, res) => {
  try {
    const existing = await query.get('SELECT * FROM donation_settings WHERE id = 1');
    const { presets, custom_enabled, qr_code_url, upi_id, merchant_name } = req.body;
    const preset_amounts = presets !== undefined 
      ? (typeof presets === 'string' ? presets : JSON.stringify(presets || []))
      : existing?.preset_amounts || '[500,1000,2500,5000]';
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const finalQr = qr_code_url !== undefined ? qr_code_url : (existing?.qr_code_url || '/uploads/koyyam_upi_qr.svg');
    const finalUpi = upi_id !== undefined ? upi_id : existing?.upi_id || 'koyyammarkaz@upi';
    const finalMerchant = merchant_name !== undefined ? merchant_name : existing?.merchant_name || 'Koyyam Markaz';
    const finalCustom = custom_enabled !== undefined ? (custom_enabled ? 1 : 0) : (existing?.custom_enabled ?? 1);

    await query.run(
      `UPDATE donation_settings SET preset_amounts = ?, custom_enabled = ?, qr_code_url = ?, upi_id = ?, merchant_name = ?, updated_at = ?
       WHERE id = 1`,
      [preset_amounts, finalCustom, finalQr, finalUpi, finalMerchant, now]
    );

    await logActivity(req.user.id, req.user.name, 'Updated Donation Settings', 'Updated UPI QR and preset amounts', req.ip);
    res.json({ message: 'Donation settings updated.' });
  } catch (err) {
    console.error('Update donation settings error:', err);
    res.status(500).json({ error: err.message || 'Failed to update donation settings.' });
  }
});

// ==================== 9. FOOTER SETTINGS CRUD ====================

// GET /api/admin/footer-settings
router.get('/footer-settings', async (req, res) => {
  try {
    const footer = await query.get('SELECT * FROM footer_settings WHERE id = 1');
    res.json({ footer });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch footer settings.' });
  }
});

// PUT /api/admin/footer-settings
router.put('/footer-settings', requireRole(['admin']), async (req, res) => {
  try {
    const { address, phone, email, facebook, instagram, youtube, whatsapp } = req.body;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    await query.run(
      `UPDATE footer_settings SET address = ?, phone = ?, email = ?, facebook = ?, instagram = ?, youtube = ?, whatsapp = ?, updated_at = ?
       WHERE id = 1`,
      [address || null, phone || null, email || null, facebook || null, instagram || null, youtube || null, whatsapp || null, now]
    );

    await logActivity(req.user.id, req.user.name, 'Updated Footer', 'Updated contact and social details', req.ip);
    res.json({ message: 'Footer updated.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update footer.' });
  }
});

// ==================== 10. TEMPORARY COMMITTEE CRUD ====================

// GET /api/admin/committee
router.get('/committee', async (req, res) => {
  try {
    const committee = await query.all('SELECT * FROM temporary_committee ORDER BY order_num ASC, id ASC');
    res.json({ committee });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch committee members.' });
  }
});

// POST /api/admin/committee
router.post('/committee', requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { name, designation, role_type, photo_url, phone, email, term_period, bio, order_num, is_active } = req.body;
    if (!name || !designation) {
      return res.status(400).json({ error: 'Name and Designation are required.' });
    }

    const result = await query.run(
      `INSERT INTO temporary_committee (name, designation, role_type, photo_url, phone, email, term_period, bio, order_num, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name.trim(),
        designation.trim(),
        role_type || 'other',
        photo_url || null,
        phone?.trim() || null,
        email?.trim() || null,
        term_period?.trim() || 'Interim Term',
        bio?.trim() || null,
        parseInt(order_num) || 0,
        is_active ? 1 : 0
      ]
    );

    await logActivity(req.user.id, req.user.name, 'Added Committee Member', `Added ${name} (${designation})`, req.ip);
    res.status(201).json({ message: 'Committee member added successfully.', id: result.lastID });
  } catch (err) {
    console.error('Create committee error:', err);
    res.status(500).json({ error: 'Failed to add committee member.' });
  }
});

// PUT /api/admin/committee/:id
router.put('/committee/:id', requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation, role_type, photo_url, phone, email, term_period, bio, order_num, is_active } = req.body;
    if (!name || !designation) {
      return res.status(400).json({ error: 'Name and Designation are required.' });
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    await query.run(
      `UPDATE temporary_committee
       SET name = ?, designation = ?, role_type = ?, photo_url = ?, phone = ?, email = ?, term_period = ?, bio = ?, order_num = ?, is_active = ?, updated_at = ?
       WHERE id = ?`,
      [
        name.trim(),
        designation.trim(),
        role_type || 'other',
        photo_url || null,
        phone?.trim() || null,
        email?.trim() || null,
        term_period?.trim() || 'Interim Term',
        bio?.trim() || null,
        parseInt(order_num) || 0,
        is_active ? 1 : 0,
        now,
        id
      ]
    );

    await logActivity(req.user.id, req.user.name, 'Updated Committee Member', `Updated member ID ${id} (${name})`, req.ip);
    res.json({ message: 'Committee member updated successfully.' });
  } catch (err) {
    console.error('Update committee error:', err);
    res.status(500).json({ error: 'Failed to update committee member.' });
  }
});

// DELETE /api/admin/committee/:id
router.delete('/committee/:id', requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    await query.run('DELETE FROM temporary_committee WHERE id = ?', [id]);
    await logActivity(req.user.id, req.user.name, 'Deleted Committee Member', `Removed committee member ID ${id}`, req.ip);
    res.json({ message: 'Committee member deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete committee member.' });
  }
});

// ==================== 11. EVENTS & ANNOUNCEMENTS CRUD ====================

// GET /api/admin/announcements
router.get('/announcements', async (req, res) => {
  try {
    const announcements = await query.all('SELECT * FROM announcements ORDER BY order_num ASC, id DESC');
    res.json({ announcements });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch announcements.' });
  }
});

// POST /api/admin/announcements
router.post('/announcements', requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { title, category, event_date, event_time, location, content, image_url, link_url, is_featured, is_active, order_num } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and Content are required.' });
    }

    const result = await query.run(
      `INSERT INTO announcements (title, category, event_date, event_time, location, content, image_url, link_url, is_featured, is_active, order_num)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        category || 'Announcement',
        event_date || null,
        event_time || null,
        location?.trim() || null,
        content.trim(),
        image_url || null,
        link_url?.trim() || null,
        is_featured ? 1 : 0,
        is_active !== undefined ? (is_active ? 1 : 0) : 1,
        parseInt(order_num) || 0
      ]
    );

    await logActivity(req.user.id, req.user.name, 'Created Announcement/Event', `Added "${title}" (${category})`, req.ip);
    res.status(201).json({ message: 'Announcement created successfully.', id: result.lastID });
  } catch (err) {
    console.error('Create announcement error:', err);
    res.status(500).json({ error: 'Failed to create announcement.' });
  }
});

// PUT /api/admin/announcements/:id
router.put('/announcements/:id', requireRole(['admin', 'editor']), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, event_date, event_time, location, content, image_url, link_url, is_featured, is_active, order_num } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and Content are required.' });
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

    await query.run(
      `UPDATE announcements
       SET title = ?, category = ?, event_date = ?, event_time = ?, location = ?, content = ?, image_url = ?, link_url = ?, is_featured = ?, is_active = ?, order_num = ?, updated_at = ?
       WHERE id = ?`,
      [
        title.trim(),
        category || 'Announcement',
        event_date || null,
        event_time || null,
        location?.trim() || null,
        content.trim(),
        image_url || null,
        link_url?.trim() || null,
        is_featured ? 1 : 0,
        is_active ? 1 : 0,
        parseInt(order_num) || 0,
        now,
        id
      ]
    );

    await logActivity(req.user.id, req.user.name, 'Updated Announcement/Event', `Updated ID ${id} ("${title}")`, req.ip);
    res.json({ message: 'Announcement updated successfully.' });
  } catch (err) {
    console.error('Update announcement error:', err);
    res.status(500).json({ error: 'Failed to update announcement.' });
  }
});

// DELETE /api/admin/announcements/:id
router.delete('/announcements/:id', requireRole(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    await query.run('DELETE FROM announcements WHERE id = ?', [id]);
    await logActivity(req.user.id, req.user.name, 'Deleted Announcement/Event', `Removed announcement ID ${id}`, req.ip);
    res.json({ message: 'Announcement deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete announcement.' });
  }
});

// ==================== 12. ACTIVITY LOGS ====================

// GET /api/admin/activity-logs
router.get('/activity-logs', async (req, res) => {
  try {
    const logs = await query.all('SELECT * FROM activity_logs ORDER BY id DESC LIMIT 100');
    res.json({ logs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch activity logs.' });
  }
});

// ==================== 11. DANGER ZONE & PRODUCTION PREP ====================

// POST /api/admin/system/clear-donations (Super Admin only: remove all test donations)
router.post('/system/clear-donations', requireRole(['admin']), async (req, res) => {
  try {
    await query.run('DELETE FROM donations');
    await logActivity(req.user.id, req.user.name, 'Cleared Donations', 'Purged all test donation records for production go-live', req.ip);
    res.json({ message: 'All donation records cleared successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear donations.' });
  }
});

// POST /api/admin/system/reset-mock (Super Admin only: re-seed mock data)
router.post('/system/reset-mock', requireRole(['admin']), async (req, res) => {
  try {
    await seedDatabase(true);
    await logActivity(req.user.id, req.user.name, 'Reset Database', 'Restored sample mock data across all tables', req.ip);
    res.json({ message: 'Database reset to clean sample data successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset mock data.' });
  }
});

export default router;

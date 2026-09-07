import express from 'express';
import { query } from '../db.js';
import { logActivity } from './auth.js';

const router = express.Router();

// GET /api/public/content - Unified public website content endpoint
router.get('/content', async (req, res) => {
  try {
    const heroSlides = await query.all(
      'SELECT id, image_url, title, subtitle, button_text, button_link, order_num FROM hero_slides WHERE is_active = 1 ORDER BY order_num ASC, id ASC'
    );

    const about = await query.get('SELECT id, title, content, image_url, stats_json FROM about WHERE id = 1');
    if (about && about.stats_json) {
      try {
        about.stats = JSON.parse(about.stats_json);
      } catch (e) {
        about.stats = [];
      }
    }

    const missionVision = await query.all('SELECT id, type, title, description, icon FROM mission_vision ORDER BY id ASC');

    const institutions = await query.all(
      'SELECT id, name, description, icon_url, category, order_num, enrollment_count FROM institutions WHERE is_active = 1 ORDER BY order_num ASC, id ASC'
    );

    const donationSettings = await query.get(
      'SELECT id, preset_amounts, custom_enabled, qr_code_url, upi_id, merchant_name FROM donation_settings WHERE id = 1'
    );
    if (donationSettings && donationSettings.preset_amounts) {
      try {
        donationSettings.presets = JSON.parse(donationSettings.preset_amounts);
      } catch (e) {
        donationSettings.presets = [500, 1000, 2500, 5000];
      }
    }

    const footer = await query.get(
      'SELECT id, address, phone, email, facebook, instagram, youtube, whatsapp FROM footer_settings WHERE id = 1'
    );

    const committee = await query.all(
      'SELECT id, name, designation, role_type, photo_url, phone, email, term_period, bio, order_num FROM temporary_committee WHERE is_active = 1 ORDER BY order_num ASC, id ASC'
    );

    const announcements = await query.all(
      'SELECT id, title, category, event_date, event_time, location, content, image_url, link_url, is_featured, order_num FROM announcements WHERE is_active = 1 ORDER BY order_num ASC, id ASC'
    );

    res.json({
      hero_slides: heroSlides,
      about: about || {},
      mission_vision: missionVision,
      institutions: institutions,
      donation_settings: donationSettings || {},
      footer: footer || {},
      temporary_committee: committee || [],
      announcements: announcements || []
    });
  } catch (err) {
    console.error('Failed to get public content:', err);
    res.status(500).json({ error: 'Failed to load public website content.' });
  }
});

// GET /api/public/committee - Public committee endpoint
router.get('/committee', async (req, res) => {
  try {
    const committee = await query.all(
      'SELECT id, name, designation, role_type, photo_url, phone, email, term_period, bio, order_num FROM temporary_committee WHERE is_active = 1 ORDER BY order_num ASC, id ASC'
    );
    res.json({ committee });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load committee members.' });
  }
});

// GET /api/public/announcements - Public announcements endpoint
router.get('/announcements', async (req, res) => {
  try {
    const announcements = await query.all(
      'SELECT id, title, category, event_date, event_time, location, content, image_url, link_url, is_featured, order_num FROM announcements WHERE is_active = 1 ORDER BY order_num ASC, id ASC'
    );
    res.json({ announcements });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load announcements.' });
  }
});

// POST /api/public/donate - Public donation submission
router.post('/donate', async (req, res) => {
  try {
    const { donor_name, donor_phone, amount, payment_method, upi_transaction_id, prayer_request } = req.body;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ error: 'Please enter a valid donation amount.' });
    }

    const method = payment_method || 'UPI';
    const status = upi_transaction_id ? 'Completed' : 'Pending';
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

    // Audit log
    await logActivity(
      null,
      donor_name?.trim() || 'Anonymous Donor',
      'Donation Received',
      `Received ₹${numAmount.toLocaleString('en-IN')} via ${method} (${status})`,
      req.ip
    );

    res.status(201).json({
      message: 'Thank you for your noble contribution to Koyyam Markaz!',
      donation: {
        id: result.lastID,
        donor_name: donor_name || 'Anonymous Philanthropist',
        amount: numAmount,
        payment_method: method,
        status,
        date: now
      }
    });
  } catch (err) {
    console.error('Donation error:', err);
    res.status(500).json({ error: 'Failed to record donation.' });
  }
});

export default router;

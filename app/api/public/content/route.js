import { NextResponse } from 'next/server';
import { query, initDb } from '@/lib/db';

export async function GET() {
  try {
    await initDb();

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
      'SELECT id, preset_amounts, custom_enabled, qr_code_url, upi_id, merchant_name, bank_name, branch_name, account_number, ifsc_code, account_name, google_pay_number FROM donation_settings WHERE id = 1'
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

    return NextResponse.json({
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
    return NextResponse.json({ error: 'Failed to load public website content.' }, { status: 500 });
  }
}

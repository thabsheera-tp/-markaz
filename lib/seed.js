import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { query, initDb } from './db.js';

const rootDir = process.cwd();
const uploadsDir = path.resolve(process.cwd(), 'public/uploads');

// Copy existing workspace JPEG photos to public/uploads
function copyAssets() {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const assetFiles = [
    'assembly.jpeg',
    'dars.jpeg',
    'full.jpeg',
    'hifz.jpeg',
    'indpndce day.jpeg',
    'markaz.jpeg',
    'masjid.jpeg',
    'mekz.jpeg'
  ];

  for (const file of assetFiles) {
    const src = path.join(/*turbopackIgnore: true*/ rootDir, file);
    const dest = path.join(uploadsDir, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`Copied ${file} -> public/uploads/`);
    }
  }

  // Create a clean branded SVG QR Code for donations
  const qrSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
    <rect width="300" height="300" fill="#ffffff" rx="16"/>
    <!-- Top Left Finder Pattern -->
    <rect x="30" y="30" width="70" height="70" fill="#0a2e4a" rx="8"/>
    <rect x="42" y="42" width="46" height="46" fill="#ffffff" rx="4"/>
    <rect x="52" y="52" width="26" height="26" fill="#0a2e4a" rx="2"/>
    <!-- Top Right Finder Pattern -->
    <rect x="200" y="30" width="70" height="70" fill="#0a2e4a" rx="8"/>
    <rect x="212" y="42" width="46" height="46" fill="#ffffff" rx="4"/>
    <rect x="222" y="52" width="26" height="26" fill="#0a2e4a" rx="2"/>
    <!-- Bottom Left Finder Pattern -->
    <rect x="30" y="200" width="70" height="70" fill="#0a2e4a" rx="8"/>
    <rect x="42" y="212" width="46" height="46" fill="#ffffff" rx="4"/>
    <rect x="52" y="222" width="26" height="26" fill="#0a2e4a" rx="2"/>
    <!-- Data matrix elements -->
    <g fill="#0a2e4a">
      <rect x="115" y="35" width="16" height="16" rx="2"/>
      <rect x="145" y="35" width="16" height="16" rx="2"/>
      <rect x="170" y="45" width="16" height="16" rx="2"/>
      <rect x="115" y="65" width="16" height="16" rx="2"/>
      <rect x="135" y="80" width="20" height="20" rx="3"/>
      <rect x="165" y="75" width="16" height="16" rx="2"/>
      <rect x="35" y="115" width="20" height="20" rx="3"/>
      <rect x="65" y="125" width="16" height="16" rx="2"/>
      <rect x="90" y="110" width="20" height="20" rx="3"/>
      <rect x="120" y="120" width="18" height="18" rx="2"/>
      <rect x="150" y="110" width="22" height="22" rx="3"/>
      <rect x="185" y="125" width="18" height="18" rx="2"/>
      <rect x="215" y="115" width="20" height="20" rx="3"/>
      <rect x="245" y="125" width="18" height="18" rx="2"/>
      <rect x="35" y="150" width="16" height="16" rx="2"/>
      <rect x="65" y="165" width="20" height="20" rx="3"/>
      <rect x="100" y="155" width="22" height="22" rx="3"/>
      <rect x="130" y="150" width="16" height="16" rx="2"/>
      <rect x="160" y="160" width="20" height="20" rx="3"/>
      <rect x="195" y="150" width="16" height="16" rx="2"/>
      <rect x="230" y="160" width="20" height="20" rx="3"/>
      <rect x="115" y="205" width="20" height="20" rx="3"/>
      <rect x="145" y="215" width="16" height="16" rx="2"/>
      <rect x="175" y="205" width="22" height="22" rx="3"/>
      <rect x="215" y="205" width="18" height="18" rx="2"/>
      <rect x="245" y="220" width="16" height="16" rx="2"/>
      <rect x="120" y="245" width="24" height="24" rx="3"/>
      <rect x="160" y="250" width="20" height="20" rx="3"/>
      <rect x="190" y="240" width="20" height="20" rx="3"/>
      <rect x="225" y="250" width="22" height="22" rx="3"/>
    </g>
    <!-- Center Emblem / Logo Badge -->
    <rect x="115" y="115" width="70" height="70" fill="#2d8b46" rx="12"/>
    <text x="150" y="148" fill="#ffffff" font-size="20" font-weight="bold" font-family="Arial, sans-serif" text-anchor="middle">UPI</text>
    <text x="150" y="170" fill="#ffffff" font-size="11" font-weight="bold" font-family="Arial, sans-serif" text-anchor="middle">MARKAZ</text>
  </svg>`;

  fs.writeFileSync(path.join(uploadsDir, 'koyyam_upi_qr.svg'), qrSvg);
  console.log('Created branded UPI QR code -> backend/uploads/koyyam_upi_qr.svg');
}

export async function seedDatabase(forceClear = false) {
  await initDb();
  copyAssets();

  if (forceClear) {
    await query.exec(`
      DELETE FROM activity_logs;
      DELETE FROM temporary_committee;
      DELETE FROM announcements;
      DELETE FROM donations;
      DELETE FROM students;
      DELETE FROM institutions;
      DELETE FROM mission_vision;
      DELETE FROM about;
      DELETE FROM hero_slides;
      DELETE FROM donation_settings;
      DELETE FROM footer_settings;
      DELETE FROM users;
    `);
    console.log('Cleared all existing tables.');
  }

  // 1. Seed Users
  const userCount = await query.get('SELECT COUNT(*) as count FROM users');
  if (userCount.count === 0) {
    const adminPass = await bcrypt.hash('Admin@123', 10);
    const editorPass = await bcrypt.hash('Editor@123', 10);
    const viewerPass = await bcrypt.hash('Viewer@123', 10);

    await query.run(
      `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`,
      ['Sayyid Alavi Thangal', 'admin@koyyammarkaz.org', adminPass, 'admin']
    );
    await query.run(
      `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`,
      ['Usthad Abdul Kareem', 'editor@koyyammarkaz.org', editorPass, 'editor']
    );
    await query.run(
      `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`,
      ['Guest Auditor', 'viewer@koyyammarkaz.org', viewerPass, 'viewer']
    );
    // Quick Demo logins
    const testAdminPass = await bcrypt.hash('TestAdmin@123', 10);
    const testEditorPass = await bcrypt.hash('TestEditor@123', 10);
    const testViewerPass = await bcrypt.hash('TestViewer@123', 10);
    await query.run(
      `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?) ON CONFLICT (email) DO NOTHING`,
      ['Test Admin', 'testadmin@koyyammarkaz.org', testAdminPass, 'admin']
    );
    await query.run(
      `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?) ON CONFLICT (email) DO NOTHING`,
      ['Test Editor', 'testeditor@koyyammarkaz.org', testEditorPass, 'editor']
    );
    await query.run(
      `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?) ON CONFLICT (email) DO NOTHING`,
      ['Test Viewer', 'testviewer@koyyammarkaz.org', testViewerPass, 'viewer']
    );
    console.log('Seeded users including demo accounts');
  }

  // 2. Seed Hero Slides
  const slideCount = await query.get('SELECT COUNT(*) as count FROM hero_slides');
  if (slideCount.count === 0) {
    const slides = [
      {
        image_url: '/uploads/markaz.jpeg',
        title: 'Markazu Da-wathil Islamiyya, Koyyam',
        subtitle: 'Illuminating Hearts with Sacred Knowledge and Human Service Since 1992',
        button_text: 'Explore Institutions',
        button_link: '#institutions',
        order_num: 1
      },
      {
        image_url: '/uploads/masjid.jpeg',
        title: 'Masjidul Huda & Spiritual Sanctuary',
        subtitle: 'The divine core of Koyyam Markaz, uniting students and community in prayer and reflection',
        button_text: 'Masjid Fund & Support',
        button_link: '#donate',
        order_num: 2
      },
      {
        image_url: '/uploads/dars.jpeg',
        title: 'Classical Dars & Islamic Scholasticism',
        subtitle: 'Empowering future Islamic scholars through comprehensive studies of Fiqh, Hadith, and Tafsir',
        button_text: 'Academic Curriculum',
        button_link: '#institutions',
        order_num: 3
      },
      {
        image_url: '/uploads/hifz.jpeg',
        title: 'Tahfeezul Qur-an College',
        subtitle: 'Mentoring young scholars to commit the Holy Qur-an to heart with perfect Tajweed and tarbiyah',
        button_text: 'Sponsor a Qur-an Student',
        button_link: '#donate',
        order_num: 4
      },
      {
        image_url: '/uploads/assembly.jpeg',
        title: 'Character Building & Daily Assembly',
        subtitle: 'Fostering moral leadership, physical discipline, and civic brotherhood across all campuses',
        button_text: 'Read Our Story',
        button_link: '#about',
        order_num: 5
      },
      {
        image_url: '/uploads/indpndce day.jpeg',
        title: 'Patriotism, Harmony & Nation Building',
        subtitle: 'Proudly celebrating national unity, cultural harmony, and selfless service to humanity',
        button_text: 'Partner With Us',
        button_link: '#donate',
        order_num: 6
      }
    ];

    for (const slide of slides) {
      await query.run(
        `INSERT INTO hero_slides (image_url, title, subtitle, button_text, button_link, order_num, is_active)
         VALUES (?, ?, ?, ?, ?, ?, 1)`,
        [slide.image_url, slide.title, slide.subtitle, slide.button_text, slide.button_link, slide.order_num]
      );
    }
    console.log(`Seeded ${slides.length} hero slides.`);
  }

  // 3. Seed About Us
  const aboutCount = await query.get('SELECT COUNT(*) as count FROM about');
  if (aboutCount.count === 0) {
    const aboutContent = `Markazu Da-wathil Islamiyya, Koyyam, located in the peaceful terrain of Kannur district, Kerala, stands as a distinguished center for Islamic education, moral guidance, and community welfare. Established with the vision of bridging classical spiritual scholarship and contemporary academic excellence, Koyyam Markaz has transformed the educational landscape for thousands of rural and underprivileged youth.

Under the benevolent guidance of renowned religious scholars and community leaders, the institution nurtures over 1,200 residential and non-residential students. From our classical Dars and Hifzul Qur'an college to modern science streams, vocational training, and destitute care facilities, Koyyam Markaz is committed to holistic human development. Every student is provided with free boarding, nourishing meals, comprehensive healthcare, and compassionate mentorship.`;

    const stats = JSON.stringify([
      { label: 'Years of Dedication', value: '34+' },
      { label: 'Students Enrolled', value: '1,250+' },
      { label: 'Graduated Alumni', value: '5,400+' },
      { label: 'Active Institutions', value: '9' }
    ]);

    await query.run(
      `INSERT INTO about (id, title, content, image_url, stats_json) VALUES (1, ?, ?, ?, ?)`,
      ['About Koyyam Markaz', aboutContent, '/uploads/full.jpeg', stats]
    );
    console.log('Seeded About Us content.');
  }

  // 4. Seed Mission & Vision
  const mvCount = await query.get('SELECT COUNT(*) as count FROM mission_vision');
  if (mvCount.count === 0) {
    await query.run(
      `INSERT INTO mission_vision (type, title, description, icon) VALUES (?, ?, ?, ?)`,
      [
        'mission',
        'Our Sacred Mission',
        'To impart traditional Islamic and contemporary secular education that nurtures spiritual purity, intellectual vigor, moral uprightness, and dedicated leadership for society.',
        'Compass'
      ]
    );
    await query.run(
      `INSERT INTO mission_vision (type, title, description, icon) VALUES (?, ?, ?, ?)`,
      [
        'vision',
        'Our Vision for Tomorrow',
        'To establish a world-class center of spiritual enlightenment, academic research, and philanthropic excellence, shaping generations who foster peace, ethical progress, and social justice.',
        'Eye'
      ]
    );
    console.log('Seeded Mission & Vision cards.');
  }

  // 5. Seed 9 Institutions / Courses
  const instCount = await query.get('SELECT COUNT(*) as count FROM institutions');
  if (instCount.count === 0) {
    const institutions = [
      {
        name: "Kulliyya of Islamic Sharee'ath",
        description: 'Advanced 7-year scholarly program in Islamic jurisprudence (Fiqh), Usul, Hadith sciences, Tafsir, and classical Arabic rhetoric.',
        icon_url: '/uploads/dars.jpeg',
        category: 'Higher Islamic Studies',
        order_num: 1,
        enrollment_count: 185
      },
      {
        name: "Tahfeezul Qur'an College",
        description: 'Intensive memorization program of the Holy Qur-an with Tajweed rules, vocal modulation, spiritual etiquette, and Qira-at fundamentals.',
        icon_url: '/uploads/hifz.jpeg',
        category: "Qur'anic Studies",
        order_num: 2,
        enrollment_count: 140
      },
      {
        name: "Da'wa Secondary & Senior Academy",
        description: 'Integrated dual curriculum combining government-approved secondary schooling with foundational Islamic studies, moral theology, and languages.',
        icon_url: '/uploads/assembly.jpeg',
        category: 'Secondary Education',
        order_num: 3,
        enrollment_count: 275
      },
      {
        name: 'Markaz English School',
        description: 'Modern English-medium school providing holistic education blending academic excellence with moral foundations.',
        icon_url: '/uploads/assembly.jpeg',
        category: 'Contemporary Education',
        order_num: 4,
        enrollment_count: 195
      },
      {
        name: 'College of Arts, Science & Commerce',
        description: 'Undergraduate and plus-two streams in Science, Commerce, and Humanities empowering youth for professional leadership and higher education.',
        icon_url: '/uploads/full.jpeg',
        category: 'Contemporary Education',
        order_num: 5,
        enrollment_count: 215
      },
      {
        name: 'Technical & Vocational Skills Wing',
        description: 'Practical training courses in electrical, plumbing, modern tailoring, and graphic crafts to assure self-reliance and career employment.',
        icon_url: '/uploads/indpndce day.jpeg',
        category: 'Vocational Training',
        order_num: 6,
        enrollment_count: 85
      },
      {
        name: 'Markaz Computer & IT Center',
        description: 'Equipped with modern computer terminals offering software fundamentals, office automation, web technologies, and digital literacy.',
        icon_url: '/uploads/markaz.jpeg',
        category: 'Information Technology',
        order_num: 7,
        enrollment_count: 110
      },
      {
        name: "Women's Sharee'ath & Higher Academy",
        description: 'Dedicated residential and day-scholar wing for women providing dignified Islamic scholarship, domestic science, and higher graduation.',
        icon_url: '/uploads/masjid.jpeg',
        category: "Women's Education",
        order_num: 8,
        enrollment_count: 130
      },
      {
        name: 'Islamic Heritage Library & Research Wing',
        description: 'Vast repository containing thousands of classical Islamic manuscripts, rare reference books, journals, and a quiet scholarly research environment.',
        icon_url: '/uploads/full.jpeg',
        category: 'Research & Archive',
        order_num: 9,
        enrollment_count: 45
      }
    ];

    for (const inst of institutions) {
      await query.run(
        `INSERT INTO institutions (name, description, icon_url, category, order_num, is_active, enrollment_count)
         VALUES (?, ?, ?, ?, ?, 1, ?)`,
        [inst.name, inst.description, inst.icon_url, inst.category, inst.order_num, inst.enrollment_count]
      );
    }
    console.log(`Seeded ${institutions.length} institutions.`);
  }

  // 6. Seed Donation Settings
  const donSettings = await query.get('SELECT COUNT(*) as count FROM donation_settings');
  if (donSettings.count === 0) {
    await query.run(
      `INSERT INTO donation_settings (id, preset_amounts, custom_enabled, qr_code_url, upi_id, merchant_name)
       VALUES (1, ?, 1, ?, ?, ?)`,
      [
        JSON.stringify([500, 1000, 2500, 5000, 10000]),
        '/uploads/koyyam_upi_qr.svg',
        'koyyammarkaz@upi',
        'MARKAZU DA-WATHIL ISLAMIYYA KOYYAM'
      ]
    );
    console.log('Seeded Donation settings.');
  }

  // 7. Seed Footer Settings
  const footSettings = await query.get('SELECT COUNT(*) as count FROM footer_settings');
  if (footSettings.count === 0) {
    await query.run(
      `INSERT INTO footer_settings (id, address, phone, email, facebook, instagram, youtube, whatsapp)
       VALUES (1, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Markazu Da-wathil Islamiyya, Koyyam P.O., Kannur District, Kerala, India - Pin: 670142',
        '+91 9400304426',
        'contact@koyyammarkaz.org, donations@koyyammarkaz.org',
        'https://facebook.com/koyyammarkaz',
        'https://instagram.com/koyyammarkaz',
        'https://youtube.com/@koyyammarkaz',
        'https://wa.me/919400304426'
      ]
    );
    console.log('Seeded Footer settings.');
  }

  // 8. Seed 55+ Realistic Donations spread over the last 6 months
  const donationCount = await query.get('SELECT COUNT(*) as count FROM donations');
  if (donationCount.count === 0) {
    const donorNames = [
      'Haji Muhammad Kunhi', 'Sayyid Munavvar Ali', 'Abdul Rahman Dubai', 'Ibrahim Kutty Calicut',
      'Farooq K.', 'Aboobacker Siddique', 'Zainaba Ummar', 'Fatima Beevi', 'K.P. Shamsuddin',
      'Musthafa Kannur', 'Basheer Ahmed', 'Shameer Babu', 'Rashid Koyyam', 'Naufal Cheemeni',
      'Sulaiman Haji', 'Mujeeb Rahman', 'Ali Akbar', 'Jamaluddin Musliyar', 'Hamza Haji Doha',
      'Anonymous Philanthropist', 'Dr. Faisal Usman', 'Khaleelur Rahman', 'Shareef Bangalore',
      'T.K. Ashraf', 'Ashraf Mayyil', 'Moideen Kutty', 'Safwan V.P.', 'Umarul Farooq',
      'Aishabi Koyyam', 'Yousuf Ali Jeddah', 'Shamsudheen Sharjah', 'Anas Muhammad',
      'Riyaz Paramba', 'M.C. Abdulla', 'Noushad K.M.', 'Zuhail Ahmed', 'Hassan Koya'
    ];

    const methods = ['UPI', 'Bank Transfer', 'Cash'];
    const statuses = ['Completed', 'Completed', 'Completed', 'Completed', 'Pending', 'Failed'];
    const sampleAmounts = [500, 1000, 1500, 2000, 2500, 5000, 7500, 10000, 15000, 25000, 50000];

    const now = new Date();
    for (let i = 0; i < 60; i++) {
      const donor = donorNames[i % donorNames.length];
      const amount = sampleAmounts[Math.floor(Math.random() * sampleAmounts.length)];
      const method = methods[Math.floor(Math.random() * methods.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Distribute across last 180 days
      const daysAgo = Math.floor(Math.random() * 180);
      const donationDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      const dateStr = donationDate.toISOString().replace('T', ' ').substring(0, 19);

      const upiTxn = method === 'UPI' ? `UPI${Math.floor(100000000000 + Math.random() * 900000000000)}` : (method === 'Bank Transfer' ? `NEFT${Math.floor(10000000 + Math.random() * 90000000)}` : null);
      const phone = `+91 ${Math.floor(9000000000 + Math.random() * 999999999)}`;
      const prayers = [
        'For parents health and maghfirah',
        'For barakah in family and livelihood',
        'Marhum grandmother Dua',
        'Success in children education',
        'General Markaz welfare fund',
        ''
      ];
      const prayer = prayers[Math.floor(Math.random() * prayers.length)];

      await query.run(
        `INSERT INTO donations (donor_name, donor_phone, amount, payment_method, upi_transaction_id, prayer_request, status, date, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [donor, phone, amount, method, upiTxn, prayer, status, dateStr, dateStr]
      );
    }
    console.log('Seeded 60 donations with realistic distributions.');
  }

  // 9. Seed 35+ Students
  const studentCount = await query.get('SELECT COUNT(*) as count FROM students');
  if (studentCount.count === 0) {
    const studentNames = [
      'Muhammed Bilal K.', 'Ahmad Thasleem', 'Salman Faris', 'Muhammed Sinan', 'Abdurahman M.',
      'Muhammed Rizwan', 'Ameen Ahsan', 'Fawaz Koyyam', 'Adil Muhammed', 'Sufyan Ali',
      'Hafiz Rayan', 'Muhammed Nihal', 'Shamil Ibrahim', 'Zubair K.P.', 'Muhammed Fayis',
      'Irshad V.K.', 'Musthafa K.', 'Ashmil C.H.', 'Farisul Haque', 'Sayyid Rabeeh',
      'Muhammed Danish', 'Luqman Hakim', 'Arshad Ali', 'Jubair Ahmed', 'Muhammed Haneef',
      'Fathima Zahra', 'Aysha Ridha', 'Nusaiba K.', 'Huda Mariyam', 'Safiyya Beevi',
      'Hafiz Shahid', 'Muhammed Razi', 'Zayan Ahmed', 'Nashid M.', 'Talha K.M.'
    ];

    const feeStatuses = ['Paid', 'Paid', 'Partial', 'Scholarship', 'Due'];
    const instRows = await query.all('SELECT id FROM institutions');

    for (let i = 0; i < studentNames.length; i++) {
      const name = studentNames[i];
      const instId = instRows.length > 0 ? instRows[i % instRows.length].id : 1;
      const feeStatus = feeStatuses[i % feeStatuses.length];
      const phone = `+91 ${Math.floor(7000000000 + Math.random() * 2999999999)}`;
      const email = `${name.toLowerCase().replace(/[^a-z]/g, '')}@student.koyyammarkaz.org`;
      
      const enrollDays = Math.floor(Math.random() * 500);
      const enrollDate = new Date(Date.now() - enrollDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      await query.run(
        `INSERT INTO students (name, email, phone, institution_id, enrollment_date, fee_status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, email, phone, instId, enrollDate, feeStatus]
      );
    }
    console.log(`Seeded ${studentNames.length} students across institutions.`);
  }

  // 10. Seed Activity Logs
  const logCount = await query.get('SELECT COUNT(*) as count FROM activity_logs');
  if (logCount.count === 0) {
    const sampleLogs = [
      { user_name: 'Sayyid Alavi Thangal (Admin)', action: 'System Initialized', details: 'Database seeded with core institutional parameters.' },
      { user_name: 'Usthad Abdul Kareem (Editor)', action: 'Updated Hero Slider', details: 'Added 6th slide celebrating patriotism and national harmony.' },
      { user_name: 'Sayyid Alavi Thangal (Admin)', action: 'Configured Donation Gateway', details: 'Verified UPI ID koyyammarkaz@upi and uploaded high-res QR code.' },
      { user_name: 'System', action: 'New Donation Received', details: 'Received ₹10,000 from Haji Muhammad Kunhi via UPI.' },
      { user_name: 'Usthad Abdul Kareem (Editor)', action: 'Enrolled Student', details: 'Admitted Muhammed Bilal K. to Kulliyya of Islamic Shareeath.' }
    ];

    for (const log of sampleLogs) {
      await query.run(
        `INSERT INTO activity_logs (user_name, action, details, ip_address) VALUES (?, ?, ?, '127.0.0.1')`,
        [log.user_name, log.action, log.details]
      );
    }
    console.log('Seeded Activity audit logs.');
  }

  // 11. Seed Temporary Leadership Committee
  const committeeCount = await query.get('SELECT COUNT(*) as count FROM temporary_committee');
  if (committeeCount.count === 0) {
    const committeeMembers = [
      {
        name: 'Sayyid Alavi Thangal',
        designation: 'Temporary President (താൽക്കാലിക പ്രസിഡന്റ്)',
        role_type: 'president',
        photo_url: '/uploads/full.jpeg',
        phone: '+91 9447123456',
        email: 'president@koyyammarkaz.org',
        term_period: 'Interim Committee 2024–Present',
        bio: 'Leading the spiritual, institutional, and humanitarian vision of Markazu Da-wathil Islamiyya during the transitional governance period.',
        order_num: 1,
        is_active: 1
      },
      {
        name: 'Usthad Abdul Kareem Faizy',
        designation: 'Temporary General Secretary (താൽക്കാലിക ജനറൽ സെക്രട്ടറി)',
        role_type: 'secretary',
        photo_url: '/uploads/dars.jpeg',
        phone: '+91 9400304426',
        email: 'secretary@koyyammarkaz.org',
        term_period: 'Interim Committee 2024–Present',
        bio: 'Directing the academic administration, staff coordination, and daily operational affairs across all 9 institutional wings.',
        order_num: 2,
        is_active: 1
      },
      {
        name: 'Haji K. P. Mohammed',
        designation: 'Temporary Finance Secretary (താൽക്കാലിക ഫിനാൻസ് സെക്രട്ടറി)',
        role_type: 'finance_secretary',
        photo_url: '/uploads/markaz.jpeg',
        phone: '+91 9847654321',
        email: 'finance@koyyammarkaz.org',
        term_period: 'Interim Committee 2024–Present',
        bio: 'Overseeing transparent financial governance, donor accountability, construction funding, and student welfare endowments.',
        order_num: 3,
        is_active: 1
      }
    ];

    for (const member of committeeMembers) {
      await query.run(
        `INSERT INTO temporary_committee (name, designation, role_type, photo_url, phone, email, term_period, bio, order_num, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          member.name,
          member.designation,
          member.role_type,
          member.photo_url,
          member.phone,
          member.email,
          member.term_period,
          member.bio,
          member.order_num,
          member.is_active
        ]
      );
    }
    console.log('Seeded Temporary Leadership Committee (President, Secretary, Finance Secretary).');
  }

  // 12. Seed Announcements & Events
  const announcementCount = await query.get('SELECT COUNT(*) as count FROM announcements');
  if (announcementCount.count === 0) {
    const sampleAnnouncements = [
      {
        title: '32nd Annual Sanad Dhaana & Khatmul Qur-an Sanmelanam',
        category: 'Event',
        event_date: '2025-05-18',
        event_time: '04:30 PM - 10:30 PM',
        location: 'Markaz Grand Auditorium, Koyyam Campus',
        content: 'Grand convocation ceremony conferring sanad upon graduating Islamic scholars and Huffaz of Tahfeezul Qur-an College, blessed by honorable Sadaths and Ulama.',
        image_url: '/uploads/assembly.jpeg',
        link_url: '#donate',
        is_featured: 1,
        is_active: 1,
        order_num: 1
      },
      {
        title: 'Admissions Open: Academic Year 2025-2026 for Dars & Hifz',
        category: 'Announcement',
        event_date: '2025-04-10',
        event_time: '10:00 AM onwards',
        location: 'Administrative Office, Koyyam Markaz',
        content: 'Applications are formally invited for Kulliyya of Islamic Shareeath and Hifzul Qur-an residential colleges. Free boarding, meals, and education provided for eligible students.',
        image_url: '/uploads/hifz.jpeg',
        link_url: '#contact',
        is_featured: 1,
        is_active: 1,
        order_num: 2
      },
      {
        title: 'Ramadan Special Spiritual Majlis & Community Iftar Drive',
        category: 'Notice',
        event_date: '2025-03-25',
        event_time: '05:30 PM',
        location: 'Masjidul Huda & Campus Grounds',
        content: 'Daily congregational Iftar and special Tarawih prayers hosted for students, travelers, and underprivileged community families. Sponsorships welcomed.',
        image_url: '/uploads/masjid.jpeg',
        link_url: '#donate',
        is_featured: 0,
        is_active: 1,
        order_num: 3
      }
    ];

    for (const ann of sampleAnnouncements) {
      await query.run(
        `INSERT INTO announcements (title, category, event_date, event_time, location, content, image_url, link_url, is_featured, is_active, order_num)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          ann.title,
          ann.category,
          ann.event_date,
          ann.event_time,
          ann.location,
          ann.content,
          ann.image_url,
          ann.link_url,
          ann.is_featured,
          ann.is_active,
          ann.order_num
        ]
      );
    }
    console.log('Seeded Events & Announcements.');
  }

  console.log('Database seeding finished successfully!');
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const force = process.argv.includes('--force');
  seedDatabase(force)
    .then(() => {
      console.log('Seed completed.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seed error:', err);
      process.exit(1);
    });
}

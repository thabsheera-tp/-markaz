import { query } from './backend/src/db.js';

async function check() {
  const users = await query.all('SELECT id, name, email, role FROM users');
  console.log('--- USERS ---');
  console.log(users);

  const announcements = await query.all("SELECT id, title, category FROM announcements WHERE title LIKE '%TEST%'");
  console.log('--- TEST ANNOUNCEMENTS ---');
  console.log(announcements);

  const inst = await query.all("SELECT id, name, category FROM institutions WHERE name LIKE '%TEST%'");
  console.log('--- TEST INSTITUTIONS ---');
  console.log(inst);

  const slides = await query.all("SELECT id, title FROM hero_slides WHERE title LIKE '%TEST%'");
  console.log('--- TEST SLIDES ---');
  console.log(slides);

  const totalAnn = await query.get('SELECT COUNT(*) as c FROM announcements');
  const totalInst = await query.get('SELECT COUNT(*) as c FROM institutions');
  console.log('Totals intact:', { announcements: totalAnn.c, institutions: totalInst.c });
  process.exit(0);
}

check().catch(console.error);

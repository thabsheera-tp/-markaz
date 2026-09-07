const BASE_URL = 'http://localhost:5000';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, options);
  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = await res.text();
  }
  return { status: res.status, ok: res.ok, data };
}

async function login(email, password) {
  const res = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    throw new Error(`Login failed for ${email}: ${JSON.stringify(res.data)}`);
  }
  return res.data.token;
}

async function runSecurityTests() {
  console.log('=== STARTING SECURITY & ROLE PERMISSION SUITE ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Unauthenticated tests
  console.log('--- TEST GROUP 1: UNAUTHENTICATED VISITOR ACCESS ---');
  const unauthOverview = await request('/api/admin/analytics/overview');
  assert(unauthOverview.status === 401, 'Unauthenticated visitor cannot access admin analytics (401)');

  const unauthUsers = await request('/api/auth/users');
  assert(unauthUsers.status === 401, 'Unauthenticated visitor cannot access user management (401)');

  const unauthUpload = await request('/api/upload', { method: 'POST' });
  assert(unauthUpload.status === 401, 'Unauthenticated visitor cannot upload files (401)');

  const fakeTokenRes = await request('/api/admin/analytics/overview', {
    headers: { Authorization: 'Bearer fake_tampered_token_xyz' }
  });
  assert(fakeTokenRes.status === 403, 'Tampered/invalid JWT token blocked with 403');

  // 2. TEST VIEWER
  console.log('\n--- TEST GROUP 2: TEST VIEWER PERMISSIONS ---');
  const viewerToken = await login('testviewer@koyyammarkaz.org', 'TestViewer@123');
  const viewerHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${viewerToken}`
  };

  const viewerReadOverview = await request('/api/admin/analytics/overview', { headers: viewerHeaders });
  assert(viewerReadOverview.status === 200, 'TEST VIEWER can read dashboard analytics (200)');

  const viewerReadAnnouncements = await request('/api/admin/announcements', { headers: viewerHeaders });
  assert(viewerReadAnnouncements.status === 200, 'TEST VIEWER can read announcements list (200)');

  const viewerReadDonations = await request('/api/admin/donations', { headers: viewerHeaders });
  assert(viewerReadDonations.status === 200, 'TEST VIEWER can read donations tracker (200)');

  // Viewer write attempts must be blocked with 403
  const viewerWriteNotice = await request('/api/admin/announcements', {
    method: 'POST',
    headers: viewerHeaders,
    body: JSON.stringify({ title: 'Illegal Notice', category: 'Notice', content: 'test' })
  });
  assert(viewerWriteNotice.status === 403, 'TEST VIEWER write blocked on announcements (403 Forbidden)');

  const viewerWriteStudent = await request('/api/admin/students', {
    method: 'POST',
    headers: viewerHeaders,
    body: JSON.stringify({ name: 'Illegal Student' })
  });
  assert(viewerWriteStudent.status === 403, 'TEST VIEWER write blocked on students (403 Forbidden)');

  const viewerAccessUsers = await request('/api/auth/users', { headers: viewerHeaders });
  assert(viewerAccessUsers.status === 403, 'TEST VIEWER blocked from User Management (403 Forbidden)');

  const viewerAccessDonationSettings = await request('/api/admin/donation-settings', {
    method: 'PUT',
    headers: viewerHeaders,
    body: JSON.stringify({ presets: [500] })
  });
  assert(viewerAccessDonationSettings.status === 403, 'TEST VIEWER blocked from Donation Settings (403 Forbidden)');

  // 3. TEST EDITOR
  console.log('\n--- TEST GROUP 3: TEST EDITOR PERMISSIONS ---');
  const editorToken = await login('testeditor@koyyammarkaz.org', 'TestEditor@123');
  const editorHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${editorToken}`
  };

  // Editor permitted to create announcement
  const editorCreateNotice = await request('/api/admin/announcements', {
    method: 'POST',
    headers: editorHeaders,
    body: JSON.stringify({
      title: 'TEST ANNOUNCEMENT: Temporary Editor Validation',
      category: 'Notice',
      content: 'This announcement verifies editor write access.'
    })
  });
  assert(editorCreateNotice.status === 201, 'TEST EDITOR can create announcements (201)');
  const createdNoticeId = editorCreateNotice.data?.id;

  // Editor permitted to update announcement
  if (createdNoticeId) {
    const editorUpdateNotice = await request(`/api/admin/announcements/${createdNoticeId}`, {
      method: 'PUT',
      headers: editorHeaders,
      body: JSON.stringify({
        title: 'TEST ANNOUNCEMENT: Updated by Editor',
        category: 'Notice',
        content: 'Updated content successfully.'
      })
    });
    assert(editorUpdateNotice.status === 200, 'TEST EDITOR can edit announcements (200)');
  }

  // Editor blocked from Admin-only functions
  const editorDeleteNotice = await request(`/api/admin/announcements/${createdNoticeId}`, {
    method: 'DELETE',
    headers: editorHeaders
  });
  assert(editorDeleteNotice.status === 403, 'TEST EDITOR blocked from deleting announcements (403 Forbidden)');

  const editorAccessUsers = await request('/api/auth/users', { headers: editorHeaders });
  assert(editorAccessUsers.status === 403, 'TEST EDITOR blocked from User Management (403 Forbidden)');

  const editorAccessDonationSettings = await request('/api/admin/donation-settings', {
    method: 'PUT',
    headers: editorHeaders,
    body: JSON.stringify({ presets: [500] })
  });
  assert(editorAccessDonationSettings.status === 403, 'TEST EDITOR blocked from Donation Settings (403 Forbidden)');

  const editorDangerZone = await request('/api/admin/system/clear-donations', {
    method: 'POST',
    headers: editorHeaders
  });
  assert(editorDangerZone.status === 403, 'TEST EDITOR blocked from Danger Zone / Reset (403 Forbidden)');

  // 4. TEST ADMIN
  console.log('\n--- TEST GROUP 4: TEST ADMIN FULL PERMISSIONS ---');
  const adminToken = await login('testadmin@koyyammarkaz.org', 'TestAdmin@123');
  const adminHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${adminToken}`
  };

  const adminUsersList = await request('/api/auth/users', { headers: adminHeaders });
  assert(adminUsersList.status === 200, 'TEST ADMIN can view User Management (200)');

  const adminDonationSettings = await request('/api/admin/donation-settings', {
    method: 'PUT',
    headers: adminHeaders,
    body: JSON.stringify({
      presets: [500, 1000, 2500, 5000],
      custom_enabled: 1,
      upi_id: 'koyyammarkaz@sbi',
      merchant_name: 'Koyyam Markaz Islamic Complex'
    })
  });
  assert(adminDonationSettings.status === 200, 'TEST ADMIN can update Donation Settings (200)');

  if (createdNoticeId) {
    const adminDeleteNotice = await request(`/api/admin/announcements/${createdNoticeId}`, {
      method: 'DELETE',
      headers: adminHeaders
    });
    assert(adminDeleteNotice.status === 200, 'TEST ADMIN can delete announcements (200)');
  }

  console.log(`\n=== SUITE COMPLETE: ${passed} PASSED, ${failed} FAILED ===`);
  if (failed > 0) process.exit(1);
  process.exit(0);
}

runSecurityTests().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});

const API_BASE = import.meta.env.VITE_API_URL !== undefined ? import.meta.env.VITE_API_URL : '';

function getAuthHeaders() {
  const token = localStorage.getItem('markaz_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function handleResponse(res) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
  }
  return res.json();
}

export const api = {
  baseUrl: API_BASE,

  // Helper to format image URLs
  getImageUrl(url) {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
  },

  // Public
  async getPublicContent() {
    const res = await fetch(`${API_BASE}/api/public/content`);
    return handleResponse(res);
  },

  async submitDonation(donationData) {
    const res = await fetch(`${API_BASE}/api/public/donate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donationData)
    });
    return handleResponse(res);
  },

  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async getUsers() {
    const res = await fetch(`${API_BASE}/api/auth/users`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async createUser(userData) {
    const res = await fetch(`${API_BASE}/api/auth/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(res);
  },

  async updateUser(id, userData) {
    const res = await fetch(`${API_BASE}/api/auth/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return handleResponse(res);
  },

  async resetPassword(id, newPassword) {
    const res = await fetch(`${API_BASE}/api/auth/users/${id}/password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ newPassword })
    });
    return handleResponse(res);
  },

  async deleteUser(id) {
    const res = await fetch(`${API_BASE}/api/auth/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Analytics & Overview
  async getAnalyticsOverview() {
    const res = await fetch(`${API_BASE}/api/admin/analytics/overview`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Donations Tracker
  async getDonations(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/api/admin/donations?${query}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async addDonation(data) {
    const res = await fetch(`${API_BASE}/api/admin/donations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async updateDonationStatus(id, status) {
    const res = await fetch(`${API_BASE}/api/admin/donations/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(res);
  },

  async deleteDonation(id) {
    const res = await fetch(`${API_BASE}/api/admin/donations/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  getDonationsCsvUrl() {
    const token = localStorage.getItem('markaz_token');
    return `${API_BASE}/api/admin/donations/export/csv?token=${token}`;
  },

  async exportDonationsCsv() {
    const res = await fetch(`${API_BASE}/api/admin/donations/export/csv`, {
      headers: getAuthHeaders()
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `koyyam_markaz_donations_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  },

  // Students Tracker
  async getStudents(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/api/admin/students?${query}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async addStudent(data) {
    const res = await fetch(`${API_BASE}/api/admin/students`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async updateStudent(id, data) {
    const res = await fetch(`${API_BASE}/api/admin/students/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async deleteStudent(id) {
    const res = await fetch(`${API_BASE}/api/admin/students/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Content Management: Hero Slides
  async getHeroSlides() {
    const res = await fetch(`${API_BASE}/api/admin/hero-slides`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async createHeroSlide(data) {
    const res = await fetch(`${API_BASE}/api/admin/hero-slides`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async updateHeroSlide(id, data) {
    const res = await fetch(`${API_BASE}/api/admin/hero-slides/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async deleteHeroSlide(id) {
    const res = await fetch(`${API_BASE}/api/admin/hero-slides/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Content Management: About Us
  async getAbout() {
    const res = await fetch(`${API_BASE}/api/admin/about`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async updateAbout(data) {
    const res = await fetch(`${API_BASE}/api/admin/about`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Content Management: Mission & Vision
  async getMissionVision() {
    const res = await fetch(`${API_BASE}/api/admin/mission-vision`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async updateMissionVision(id, data) {
    const res = await fetch(`${API_BASE}/api/admin/mission-vision/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Content Management: Institutions
  async getInstitutions() {
    const res = await fetch(`${API_BASE}/api/admin/institutions`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async createInstitution(data) {
    const res = await fetch(`${API_BASE}/api/admin/institutions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async updateInstitution(id, data) {
    const res = await fetch(`${API_BASE}/api/admin/institutions/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async deleteInstitution(id) {
    const res = await fetch(`${API_BASE}/api/admin/institutions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Content Management: Donation Settings
  async getDonationSettings() {
    const res = await fetch(`${API_BASE}/api/admin/donation-settings`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async updateDonationSettings(data) {
    const res = await fetch(`${API_BASE}/api/admin/donation-settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Content Management: Footer Settings
  async getFooterSettings() {
    const res = await fetch(`${API_BASE}/api/admin/footer-settings`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async updateFooterSettings(data) {
    const res = await fetch(`${API_BASE}/api/admin/footer-settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  // Content Management: Temporary Committee
  async getCommittee() {
    const res = await fetch(`${API_BASE}/api/admin/committee`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async createCommitteeMember(data) {
    const res = await fetch(`${API_BASE}/api/admin/committee`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async updateCommitteeMember(id, data) {
    const res = await fetch(`${API_BASE}/api/admin/committee/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async deleteCommitteeMember(id) {
    const res = await fetch(`${API_BASE}/api/admin/committee/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Content Management: Announcements & Events
  async getAnnouncements() {
    const res = await fetch(`${API_BASE}/api/admin/announcements`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async createAnnouncement(data) {
    const res = await fetch(`${API_BASE}/api/admin/announcements`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async updateAnnouncement(id, data) {
    const res = await fetch(`${API_BASE}/api/admin/announcements/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async deleteAnnouncement(id) {
    const res = await fetch(`${API_BASE}/api/admin/announcements/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Activity Logs
  async getActivityLogs() {
    const res = await fetch(`${API_BASE}/api/admin/activity-logs`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Danger Zone
  async clearAllDonations() {
    const res = await fetch(`${API_BASE}/api/admin/system/clear-donations`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async resetMockData() {
    const res = await fetch(`${API_BASE}/api/admin/system/reset-mock`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // File Upload
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('image', file);
    const token = localStorage.getItem('markaz_token');

    const res = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    });
    return handleResponse(res);
  }
};

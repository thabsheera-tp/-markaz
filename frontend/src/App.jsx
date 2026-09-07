import React, { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import { api } from './services/api';

// Public Components
import Navbar from './components/public/Navbar';
import HeroSlider from './components/public/HeroSlider';
import LiveCampusReel from './components/public/LiveCampusReel';
import AboutSection from './components/public/AboutSection';
import TemporaryCommitteeSection from './components/public/TemporaryCommitteeSection';
import EventsSection from './components/public/EventsSection';
import MissionVisionSection from './components/public/MissionVisionSection';
import InstitutionsSection from './components/public/InstitutionsSection';
import DonationSection from './components/public/DonationSection';
import CampusLocationSection from './components/public/CampusLocationSection';
import Footer from './components/public/Footer';

// Admin Components
import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import OverviewView from './components/admin/OverviewView';
import DonationTrackerView from './components/admin/DonationTrackerView';
import StudentTrackerView from './components/admin/StudentTrackerView';
import CommitteeManager from './components/admin/CommitteeManager';
import EventsManager from './components/admin/EventsManager';
import HeroSliderManager from './components/admin/HeroSliderManager';
import AboutEditor from './components/admin/AboutEditor';
import MissionVisionEditor from './components/admin/MissionVisionEditor';
import InstitutionsManager from './components/admin/InstitutionsManager';
import DonationSettingsEditor from './components/admin/DonationSettingsEditor';
import FooterSettingsEditor from './components/admin/FooterSettingsEditor';
import UserManagementView from './components/admin/UserManagementView';
import ActivityLogsView from './components/admin/ActivityLogsView';
import DangerZoneView from './components/admin/DangerZoneView';

// Restricted views accessible ONLY to Super Admin
const ADMIN_ONLY_TABS = ['users', 'danger-zone', 'donation-settings', 'footer-settings'];

function AccessDeniedView({ user, onBackToOverview }) {
  return (
    <div className="bg-white rounded-3xl p-10 text-center border border-red-200 shadow-sm max-w-xl mx-auto my-12">
      <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100 shadow-inner">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-black text-slate-900">403 — Access Restricted</h2>
      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
        Your current session role (<strong className="uppercase text-slate-900 font-bold">{user?.role}</strong>) does not have sufficient clearance to access this management console.
        Direct URL access to user administration and system settings is restricted to <strong>Super Admin</strong>.
      </p>
      <div className="mt-6 flex justify-center">
        <button
          onClick={onBackToOverview}
          className="bg-markaz-blue hover:bg-markaz-blue-light text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
        >
          Return to Permitted Overview
        </button>
      </div>
    </div>
  );
}

export default function App() {
  // Navigation mode: 'public' or 'admin'
  const [viewMode, setViewMode] = useState(() => {
    return window.location.hash.startsWith('#admin') ? 'admin' : 'public';
  });

  // Admin state
  const [adminTab, setAdminTab] = useState(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#admin/')) {
      return hash.replace('#admin/', '').trim() || 'overview';
    }
    return 'overview';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('markaz_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  // Public website dynamic data
  const [publicData, setPublicData] = useState(null);
  const [loadingPublic, setLoadingPublic] = useState(true);
  const [preselectedCause, setPreselectedCause] = useState(null);

  // Validate existing stored token on mount against backend
  useEffect(() => {
    const token = localStorage.getItem('markaz_token');
    if (token) {
      api.getMe()
        .then((res) => {
          if (res?.user) {
            setCurrentUser(res.user);
            localStorage.setItem('markaz_user', JSON.stringify(res.user));
          } else {
            handleLogout();
          }
        })
        .catch(() => {
          // Token expired, forged, or invalid
          handleLogout();
        });
    }
  }, []);

  // Sync hash with view mode and subtab
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#admin')) {
        setViewMode('admin');
        const parts = hash.split('/');
        if (parts[1]) {
          setAdminTab(parts[1]);
        }
      } else {
        setViewMode('public');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Load public content on mount and when returning to public view
  useEffect(() => {
    if (viewMode === 'public') {
      loadPublicContent();
    }
  }, [viewMode]);

  const loadPublicContent = async () => {
    try {
      setLoadingPublic(true);
      const data = await api.getPublicContent();
      setPublicData(data);
    } catch (err) {
      console.error('Failed to load public content:', err);
    } finally {
      setLoadingPublic(false);
    }
  };

  const handleOpenDonate = () => {
    const donateSection = document.getElementById('donate');
    if (donateSection) {
      donateSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectInstitutionForDonate = (institution) => {
    setPreselectedCause(institution);
    handleOpenDonate();
  };

  const handleNavigateToAdmin = () => {
    window.location.hash = '#admin';
    setViewMode('admin');
  };

  const handleBackToPublic = () => {
    window.location.hash = '#';
    setViewMode('public');
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setAdminTab('overview');
    window.location.hash = '#admin';
  };

  const handleLogout = () => {
    localStorage.removeItem('markaz_token');
    localStorage.removeItem('markaz_user');
    setCurrentUser(null);
    setAdminTab('overview');
    window.location.hash = '#';
    setViewMode('public');
  };

  const handleSelectTab = (tab) => {
    setAdminTab(tab);
    window.location.hash = `#admin/${tab}`;
  };

  // ==================== ADMIN VIEW ROUTING ====================
  if (viewMode === 'admin') {
    // Unauthenticated visitors are strictly locked out of the Admin Dashboard
    if (!currentUser) {
      return (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onBackToPublic={handleBackToPublic}
        />
      );
    }

    // Role-based protection: non-admins cannot access admin-only tabs
    const isTabForbidden = ADMIN_ONLY_TABS.includes(adminTab) && currentUser.role !== 'admin';

    return (
      <AdminLayout
        user={currentUser}
        currentTab={adminTab}
        setCurrentTab={handleSelectTab}
        onLogout={handleLogout}
        onVisitPublic={handleBackToPublic}
      >
        {isTabForbidden ? (
          <AccessDeniedView
            user={currentUser}
            onBackToOverview={() => handleSelectTab('overview')}
          />
        ) : (
          <>
            {adminTab === 'overview' && (
              <OverviewView
                user={currentUser}
                onNavigate={(tab) => handleSelectTab(tab)}
              />
            )}
            {adminTab === 'donations' && <DonationTrackerView user={currentUser} />}
            {adminTab === 'students' && <StudentTrackerView user={currentUser} />}
            {adminTab === 'committee' && <CommitteeManager user={currentUser} />}
            {adminTab === 'events' && <EventsManager user={currentUser} />}
            {adminTab === 'hero' && <HeroSliderManager user={currentUser} />}
            {adminTab === 'about' && <AboutEditor user={currentUser} />}
            {adminTab === 'mission' && <MissionVisionEditor user={currentUser} />}
            {adminTab === 'institutions' && <InstitutionsManager user={currentUser} />}
            {adminTab === 'donation-settings' && <DonationSettingsEditor user={currentUser} />}
            {adminTab === 'footer-settings' && <FooterSettingsEditor user={currentUser} />}
            {adminTab === 'users' && <UserManagementView currentUser={currentUser} />}
            {adminTab === 'logs' && <ActivityLogsView user={currentUser} />}
            {adminTab === 'danger-zone' && <DangerZoneView user={currentUser} />}
          </>
        )}
      </AdminLayout>
    );
  }

  // ==================== PUBLIC WEBSITE VIEW ====================
  if (loadingPublic && !publicData) {
    return (
      <div className="min-h-screen bg-markaz-blue flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 rounded-2xl bg-white p-2 flex items-center justify-center shadow-xl animate-pulse mb-4 border border-white/20">
          <img
            src="/markaz-logo.png"
            alt="Koyyam Markaz Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Koyyam Markaz</h2>
        <p className="text-xs text-slate-300 mt-1">Connecting to live institutional database...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col selection:bg-markaz-green selection:text-white">
      {/* Sticky Header */}
      <Navbar
        onOpenDonate={handleOpenDonate}
        onNavigateToAdmin={handleNavigateToAdmin}
        footerData={publicData?.footer}
      />

      {/* Main Sections */}
      <main className="flex-1">
        {/* Hero Slider with continuous Ken Burns motion */}
        <HeroSlider
          slides={publicData?.hero_slides}
          onOpenDonate={handleOpenDonate}
        />

        {/* Live Continuous Auto-Moving Campus Gallery Reel */}
        <LiveCampusReel />

        {/* Events & Official Circulars */}
        <EventsSection announcements={publicData?.announcements} />

        {/* About Us */}
        <AboutSection aboutData={publicData?.about} />

        {/* Interim Leadership Committee (Temporary President, Secretary, Finance Secretary) */}
        <TemporaryCommitteeSection committee={publicData?.temporary_committee} />

        {/* Mission & Vision */}
        <MissionVisionSection items={publicData?.mission_vision} />

        {/* 9 Institutions & Wings Grid */}
        <InstitutionsSection
          institutions={publicData?.institutions}
          onSelectInstitutionForDonate={handleSelectInstitutionForDonate}
        />

        {/* Dynamic Donation Section with UPI Modal */}
        <DonationSection
          donationSettings={publicData?.donation_settings}
          preselectedCause={preselectedCause}
        />

        {/* Campus Location & Navigation Section */}
        <CampusLocationSection footerData={publicData?.footer} />
      </main>

      {/* Dynamic Footer */}
      <Footer
        footerData={publicData?.footer}
        onNavigateToAdmin={handleNavigateToAdmin}
      />
    </div>
  );
}

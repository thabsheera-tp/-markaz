'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';
import { api } from '@/services/api';

// Admin Components
import AdminLogin from '@/components/admin/AdminLogin';
import AdminLayout from '@/components/admin/AdminLayout';
import OverviewView from '@/components/admin/OverviewView';
import DonationTrackerView from '@/components/admin/DonationTrackerView';
import StudentTrackerView from '@/components/admin/StudentTrackerView';
import CommitteeManager from '@/components/admin/CommitteeManager';
import EventsManager from '@/components/admin/EventsManager';
import HeroSliderManager from '@/components/admin/HeroSliderManager';
import AboutEditor from '@/components/admin/AboutEditor';
import MissionVisionEditor from '@/components/admin/MissionVisionEditor';
import InstitutionsManager from '@/components/admin/InstitutionsManager';
import DonationSettingsEditor from '@/components/admin/DonationSettingsEditor';
import FooterSettingsEditor from '@/components/admin/FooterSettingsEditor';
import UserManagementView from '@/components/admin/UserManagementView';
import ActivityLogsView from '@/components/admin/ActivityLogsView';
import DangerZoneView from '@/components/admin/DangerZoneView';

// Restricted views accessible ONLY to Super Admin
const ADMIN_ONLY_TABS = ['users', 'danger-zone', 'donation-settings', 'footer-settings'];

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full border border-red-200 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black text-slate-900">Something went wrong</h2>
            <p className="text-xs text-slate-600">
              An unexpected error occurred while rendering this section:
            </p>
            <div className="p-3 bg-slate-100 rounded-xl text-left text-xs font-mono text-red-600 break-words overflow-x-auto max-h-36">
              {this.state.error?.message || 'Unknown error'}
            </div>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  if (typeof window !== 'undefined') window.location.hash = '#admin/overview';
                }}
                className="bg-markaz-blue text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-markaz-blue-light transition-colors"
              >
                Go to Overview
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-slate-200 text-slate-700 text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-slate-300 transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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

export default function AdminPage() {
  const router = useRouter();

  const [adminTab, setAdminTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash.startsWith('#admin/')) {
        return hash.replace('#admin/', '').trim() || 'overview';
      }
    }
    return 'overview';
  });

  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('markaz_user');
        return stored ? JSON.parse(stored) : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [checkingAuth, setCheckingAuth] = useState(true);

  // Validate existing stored token on mount against backend
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('markaz_token') : null;
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
          handleLogout();
        })
        .finally(() => {
          setCheckingAuth(false);
        });
    } else {
      setCheckingAuth(false);
    }
  }, []);

  // Sync hash with subtab
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#admin/')) {
        const parts = hash.split('/');
        if (parts[1]) {
          setAdminTab(parts[1]);
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleBackToPublic = () => {
    router.push('/');
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setAdminTab('overview');
    if (typeof window !== 'undefined') {
      window.location.hash = '#admin/overview';
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('markaz_token');
      localStorage.removeItem('markaz_user');
      window.location.hash = '';
    }
    setCurrentUser(null);
    setAdminTab('overview');
    router.push('/');
  };

  const handleSelectTab = (tab) => {
    setAdminTab(tab);
    if (typeof window !== 'undefined') {
      window.location.hash = `#admin/${tab}`;
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-2xl bg-markaz-blue border border-white/20 flex items-center justify-center animate-pulse mb-3">
          <img src="/markaz-logo.png" alt="Logo" className="w-8 h-8 object-contain" />
        </div>
        <p className="text-xs text-slate-400 font-medium">Verifying administrator credentials...</p>
      </div>
    );
  }

  // If unauthenticated, show Admin Login view
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
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

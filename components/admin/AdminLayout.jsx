'use client';
import React, { useState } from 'react';
import {
  LayoutDashboard,
  HeartHandshake,
  GraduationCap,
  Image as ImageIcon,
  FileText,
  Compass,
  Building2,
  Sliders,
  Settings,
  Users,
  History,
  AlertTriangle,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  UserCheck,
  Megaphone
} from 'lucide-react';

export default function AdminLayout({ user, currentTab, setCurrentTab, onLogout, onVisitPublic, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, section: 'Core' },
    { id: 'donations', label: 'Donation Tracker', icon: HeartHandshake, section: 'Core' },
    { id: 'students', label: 'Student Tracker', icon: GraduationCap, section: 'Core' },
    
    { id: 'committee', label: 'Leadership', icon: UserCheck, section: 'Content' },
    { id: 'events', label: 'Events & Notices', icon: Megaphone, section: 'Content' },
    { id: 'hero', label: 'Hero Slides', icon: ImageIcon, section: 'Content' },
    { id: 'about', label: 'About Us', icon: FileText, section: 'Content' },
    { id: 'mission', label: 'Mission & Vision', icon: Compass, section: 'Content' },
    { id: 'institutions', label: 'Institutions (9)', icon: Building2, section: 'Content' },
    
    ...(user?.role === 'admin' ? [
      { id: 'donation-settings', label: 'Donation Settings', icon: Sliders, section: 'Settings' },
      { id: 'footer-settings', label: 'Footer Settings', icon: Settings, section: 'Settings' },
    ] : []),

    ...(user?.role === 'admin' ? [{ id: 'users', label: 'User Management', icon: Users, section: 'System' }] : []),
    { id: 'logs', label: 'Activity Logs', icon: History, section: 'System' },
    ...(user?.role === 'admin' ? [{ id: 'danger-zone', label: 'Danger Zone', icon: AlertTriangle, section: 'System' }] : []),
  ];

  const roleColors = {
    admin: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    editor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    viewer: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  };

  const handleNav = (tabId) => {
    setCurrentTab(tabId);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col lg:flex-row font-sans">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-slate-950 text-white border-r border-white/10 shrink-0">
        
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center gap-3">
          <img
            src="/markaz-logo.png"
            alt="Koyyam Markaz Logo"
            className="w-10 h-10 rounded-xl object-contain bg-white shadow-sm p-1 border border-white/10"
          />
          <div>
            <span className="font-black text-sm uppercase tracking-tight block leading-tight">
              Koyyam Markaz
            </span>
            <span className="text-[10px] font-semibold text-emerald-400 tracking-wider uppercase block mt-0.5">
              Admin & Tracker Portal
            </span>
          </div>
        </div>

        {/* User Card */}
        <div className="p-3.5 mx-3 my-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
          <div className="min-w-0 flex-1 mr-2">
            <div className="text-xs font-bold text-white truncate">{user?.name}</div>
            <div className="text-[10px] text-slate-400 truncate font-light">{user?.email}</div>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${roleColors[user?.role] || 'bg-slate-800 text-slate-200'}`}>
            {user?.role}
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            const showSection = idx === 0 || navItems[idx - 1].section !== item.section;

            return (
              <React.Fragment key={item.id}>
                {showSection && (
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 pt-3 pb-1">
                    {item.section}
                  </div>
                )}
                <button
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? 'bg-gradient-to-r from-markaz-green to-emerald-600 text-white font-bold shadow-glow-emerald'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={onVisitPublic}
            className="w-full flex items-center justify-center gap-2 bg-white/[0.06] hover:bg-white/10 text-white text-xs font-medium py-2.5 rounded-xl border border-white/10 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Visit Public Site</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 text-xs font-medium py-2.5 rounded-xl border border-rose-900/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="lg:hidden bg-slate-950 text-white px-4 py-3 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded-lg bg-white/10 text-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <img
            src="/markaz-logo.png"
            alt="Logo"
            className="w-7 h-7 rounded-lg object-contain bg-white p-0.5"
          />
          <span className="text-sm font-extrabold uppercase">Koyyam Markaz</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${roleColors[user?.role]}`}>
            {user?.role}
          </span>
          <button onClick={onLogout} className="p-1 text-slate-400 hover:text-rose-400">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-slate-950 text-white px-4 py-3 space-y-1 border-b border-white/10 animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium ${
                  active ? 'bg-markaz-green text-white font-bold' : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-white/10 flex gap-2">
            <button
              onClick={onVisitPublic}
              className="flex-1 bg-white/10 text-white text-xs py-2 rounded-lg"
            >
              Public Site
            </button>
            <button
              onClick={onLogout}
              className="flex-1 bg-rose-900/40 text-rose-200 text-xs py-2 rounded-lg"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Breadcrumb Bar */}
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 py-4 flex items-center justify-between shadow-subtle">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span>Admin Portal</span>
            <span>/</span>
            <span className="capitalize font-bold text-slate-900">{currentTab.replace('-', ' ')}</span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onVisitPublic}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-markaz-blue px-3.5 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors shadow-subtle"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Live Website</span>
            </button>
          </div>
        </div>

        {/* Role Notice Banner for Viewer */}
        {user?.role === 'viewer' && (
          <div className="bg-amber-50 text-amber-900 px-6 py-2.5 text-xs font-semibold flex items-center justify-between border-b border-amber-200/60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>TEST VIEWER (Read-Only Mode):</strong> You have inspection access. All publishing, editing, deleting, and system settings are strictly locked.
              </span>
            </div>
            <span className="hidden sm:inline-block bg-amber-200/80 text-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Enforced Read-Only
            </span>
          </div>
        )}

        {/* Child Views */}
        <div className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </div>

      </main>

    </div>
  );
}

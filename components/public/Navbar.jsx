'use client';
import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Heart, 
  Phone, 
  MessageCircle, 
  MapPin, 
  ChevronDown, 
  BookOpen, 
  Users, 
  Video, 
  Compass, 
  ArrowRight,
  ShieldCheck,
  Search,
  ExternalLink
} from 'lucide-react';

export default function Navbar({ onOpenDonate, footerData, onNavigateToAdmin }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [wingsDropdownOpen, setWingsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAboutDropdownOpen(false);
        setWingsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayPhone = footerData?.phone || '+91 96567 90577';
  const rawDigits = displayPhone.replace(/[^0-9]/g, '');
  const cleanPhone = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits;
  const telLink = `tel:+${cleanPhone}`;
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent('Assalamu Alaikum, I would like to inquire about Koyyam Markaz.')}`;

  const aboutSublinks = [
    {
      name: 'History & Heritage',
      href: '#about',
      description: 'Over 34 years of educational service since 1992',
      icon: BookOpen,
    },
    {
      name: 'Governing Leadership',
      href: '#leadership',
      description: 'Eminent scholars and advisory board',
      icon: Users,
    },
    {
      name: 'Campus Documentary',
      href: '#documentary',
      description: 'Official documentary & visual tour',
      icon: Video,
      badge: 'Video',
    },
    {
      name: 'Mission & Core Values',
      href: '#mission',
      description: 'Spiritual grounding & academic rigor',
      icon: Compass,
    },
  ];

  const wingsQuickList = [
    { name: "Kulliyya of Sharee'ath", desc: 'Higher Islamic jurisprudence & theology' },
    { name: 'Tahfeezul Qur-an College', desc: 'Complete Qur-anic memorization' },
    { name: "Hadiya Women's Academy", desc: 'Empowering women with Islamic & secular studies' },
    { name: "Da'wa Senior Academy", desc: 'Secondary & higher secondary dars' },
    { name: 'Destitute & Orphan Care', desc: 'Full residential care and welfare support' },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-md w-full max-w-full overflow-x-clip">
      {/* 1. Ivy League Top Utility Bar */}
      <div className="bg-[#061726] text-slate-300 text-[11px] py-1 px-3 sm:px-6 lg:px-8 border-b border-white/10 w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2 w-full max-w-full">
          {/* Left: Arabic Invocation & Institution Accreditation */}
          <div className="flex items-center gap-2 font-arabic text-xs sm:text-[13px] text-slate-300 truncate min-w-0">
            <span className="font-arabic tracking-wide truncate">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
            <span className="hidden sm:inline font-sans text-xs text-slate-600">|</span>
            <span className="hidden md:inline font-sans text-[11px] text-slate-300 font-light tracking-wide uppercase">
              Registered Islamic Educational & Charitable Complex
            </span>
          </div>

          {/* Right: Quick Contacts & Directions */}
          <div className="flex items-center gap-1.5 sm:gap-4 text-[11px] shrink-0 max-w-full">
            <a
              href={telLink}
              className="inline-flex items-center gap-1 text-slate-300 hover:text-emerald-400 transition-colors py-0.5 px-2 rounded bg-white/5 sm:bg-transparent min-h-[30px] sm:min-h-0 max-w-full"
              title="Click to call directly"
            >
              <Phone className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline font-medium">{displayPhone}</span>
              <span className="sm:hidden text-[10px] font-medium">Call Us</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-emerald-400 hover:text-white transition-colors py-0.5 px-1.5 rounded max-w-full"
              title="Direct WhatsApp Message"
            >
              <MessageCircle className="w-3 h-3 shrink-0" />
              <span>WhatsApp</span>
            </a>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Markazu Da-wathil Islamiyya Koyyam Kannur Kerala 670142"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-1 text-slate-300 hover:text-amber-300 transition-colors py-0.5 px-1.5 rounded max-w-full"
              title="Google Maps Location"
            >
              <MapPin className="w-3 h-3 text-amber-300 shrink-0" />
              <span>Directions</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main University Brand Header */}
      <div className="bg-[#0a2e4a] text-white border-b border-[#144c77] w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-3.5 w-full max-w-full">
          <div className="flex justify-between items-center gap-2 sm:gap-4 w-full max-w-full min-w-0">
            
            {/* University Crest & Formal Academic Title */}
            <a href="#hero" className="flex items-center gap-2 sm:gap-3.5 group min-w-0 flex-1 max-w-full">
              <div className="relative shrink-0">
                <img
                  src="/markaz-logo.png"
                  alt="Koyyam Markaz Crest"
                  className="w-9 h-9 sm:w-14 sm:h-14 rounded-xl object-contain bg-white/95 shadow-md p-0.5 sm:p-1 border border-white/20 group-hover:scale-102 transition-transform duration-300 shrink-0 max-w-full"
                />
              </div>
              <div className="flex flex-col min-w-0 overflow-hidden max-w-full">
                <span className="text-sm sm:text-2xl font-serif tracking-wide sm:tracking-wider text-white font-bold leading-tight font-academic uppercase truncate max-w-full">
                  <span className="sm:hidden">Koyyam Markaz</span>
                  <span className="hidden sm:inline">Markazu Da-wathil Islamiyya</span>
                </span>
                <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1 max-w-full">
                  <span className="text-[10px] sm:text-xs font-semibold text-emerald-300 tracking-wider uppercase font-sans truncate max-w-full">
                    <span className="sm:hidden">Markazu Da-wathil Islamiyya</span>
                    <span className="hidden sm:inline">Koyyam, Kannur, Kerala • Est. 1992</span>
                  </span>
                </div>
              </div>
            </a>

            {/* Right Side: Action Buttons & Hamburger (Specifically Donate Area) */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 max-w-full">
              <button
                onClick={onOpenDonate}
                className="hidden sm:inline-flex items-center gap-2 bg-[#d97706] hover:bg-[#b45309] text-white px-5 py-2.5 rounded font-bold text-xs tracking-wider uppercase shadow-md active:scale-95 transition-all duration-200 min-h-[44px] max-w-full"
                title="Support Koyyam Markaz with your Sadaqah and Donations"
              >
                <Heart className="w-4 h-4 fill-white shrink-0" />
                <span className="truncate">Support & Donate</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-80 shrink-0" />
              </button>

              {/* Mobile-only touch-optimized Donate Button */}
              <button
                onClick={onOpenDonate}
                className="sm:hidden inline-flex items-center justify-center gap-1 bg-[#d97706] hover:bg-[#b45309] active:scale-95 text-white px-2.5 py-1.5 rounded-lg font-bold text-[11px] uppercase shadow-sm shrink-0 min-h-[36px] max-w-full touch-manipulation whitespace-nowrap"
              >
                <Heart className="w-3 h-3 fill-white shrink-0" />
                <span className="truncate">Donate</span>
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-slate-200 hover:text-white hover:bg-white/10 border border-white/15 transition-all focus:outline-none active:scale-95 shrink-0 touch-manipulation max-w-full"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* 3. Primary University Navigation Ribbon */}
      <nav className="hidden lg:block bg-[#072135] text-slate-100 border-b border-[#0a2e4a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11">
            <div className="flex items-center space-x-1 xl:space-x-2 text-xs font-semibold tracking-wider uppercase">
              
              <a
                href="#hero"
                className="px-3.5 py-2 text-slate-200 hover:text-white hover:bg-[#0a2e4a] transition-colors rounded-xs border-b-2 border-transparent hover:border-emerald-400"
              >
                Home
              </a>

              {/* About Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setAboutDropdownOpen(true)}
                onMouseLeave={() => setAboutDropdownOpen(false)}
              >
                <a
                  href="#about"
                  className={`px-3.5 py-2 text-slate-200 hover:text-white hover:bg-[#0a2e4a] transition-colors rounded-xs border-b-2 flex items-center gap-1 ${
                    aboutDropdownOpen ? 'bg-[#0a2e4a] text-white border-emerald-400' : 'border-transparent'
                  }`}
                >
                  <span>About Markaz</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </a>

                {aboutDropdownOpen && (
                  <div className="absolute top-full left-0 w-72 max-w-[calc(100vw-2rem)] pt-1 z-50 animate-in fade-in duration-100">
                    <div className="bg-[#0a2e4a] text-white rounded-b shadow-xl border border-[#144c77] p-2 space-y-1">
                      {aboutSublinks.map((sub) => {
                        const Icon = sub.icon;
                        return (
                          <a
                            key={sub.name}
                            href={sub.href}
                            onClick={() => setAboutDropdownOpen(false)}
                            className="flex items-start gap-2.5 p-2 rounded hover:bg-[#144c77] transition-colors group/item"
                          >
                            <div className="w-7 h-7 rounded bg-[#061726] text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <span className="text-xs font-bold block group-hover/item:text-emerald-300 transition-colors">
                                {sub.name}
                              </span>
                              <p className="text-[11px] text-slate-300 line-clamp-1 font-light">
                                {sub.description}
                              </p>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Institutions & Wings */}
              <div
                className="relative"
                onMouseEnter={() => setWingsDropdownOpen(true)}
                onMouseLeave={() => setWingsDropdownOpen(false)}
              >
                <a
                  href="#institutions"
                  className={`px-3.5 py-2 text-slate-200 hover:text-white hover:bg-[#0a2e4a] transition-colors rounded-xs border-b-2 flex items-center gap-1 ${
                    wingsDropdownOpen ? 'bg-[#0a2e4a] text-white border-emerald-400' : 'border-transparent'
                  }`}
                >
                  <span>9 Academic Wings</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </a>

                {wingsDropdownOpen && (
                  <div className="absolute top-full left-0 w-80 max-w-[calc(100vw-2rem)] pt-1 z-50 animate-in fade-in duration-100">
                    <div className="bg-[#0a2e4a] text-white rounded-b shadow-xl border border-[#144c77] p-2 space-y-1">
                      {wingsQuickList.map((wing) => (
                        <a
                          key={wing.name}
                          href="#institutions"
                          onClick={() => setWingsDropdownOpen(false)}
                          className="block p-2 rounded hover:bg-[#144c77] transition-colors group"
                        >
                          <span className="text-xs font-bold block text-white group-hover:text-emerald-300">
                            {wing.name}
                          </span>
                          <span className="text-[11px] text-slate-300 block font-light">
                            {wing.desc}
                          </span>
                        </a>
                      ))}
                      <div className="pt-1 mt-1 border-t border-[#144c77]">
                        <a
                          href="#institutions"
                          onClick={() => setWingsDropdownOpen(false)}
                          className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold block px-2 py-1"
                        >
                          View All 9 Institutions & Wings &rarr;
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <a
                href="#events"
                className="px-3.5 py-2 text-slate-200 hover:text-white hover:bg-[#0a2e4a] transition-colors rounded-xs border-b-2 border-transparent hover:border-emerald-400"
              >
                Circulars & Notices
              </a>

              <a
                href="#reel"
                className="px-3.5 py-2 text-slate-200 hover:text-white hover:bg-[#0a2e4a] transition-colors rounded-xs border-b-2 border-transparent hover:border-emerald-400"
              >
                Campus Reel
              </a>

              <a
                href="#leadership"
                className="px-3.5 py-2 text-slate-200 hover:text-white hover:bg-[#0a2e4a] transition-colors rounded-xs border-b-2 border-transparent hover:border-emerald-400"
              >
                Leadership
              </a>

              <a
                href="#location"
                className="px-3.5 py-2 text-slate-200 hover:text-white hover:bg-[#0a2e4a] transition-colors rounded-xs border-b-2 border-transparent hover:border-emerald-400"
              >
                Campus Location
              </a>

              <a
                href="#contact"
                className="px-3.5 py-2 text-slate-200 hover:text-white hover:bg-[#0a2e4a] transition-colors rounded-xs border-b-2 border-transparent hover:border-emerald-400"
              >
                Contact
              </a>

            </div>

            {/* Quick Giving Shortcut */}
            <div className="flex items-center">
              <button
                onClick={onOpenDonate}
                className="text-xs font-semibold text-emerald-400 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                <span>Online Giving & Endowment</span>
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* 4. Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#061726] text-white border-b border-[#144c77] px-4 pt-2 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-top duration-200 max-h-[calc(100vh-68px)] overflow-y-auto overflow-x-hidden overscroll-contain touch-pan-y w-full max-w-full">
          <div className="space-y-1 divide-y divide-white/10">
            <a
              href="#hero"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3.5 py-3 rounded-lg text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors min-h-[44px]"
            >
              Home Campus
            </a>

            <div className="pt-2 pb-1">
              <span className="px-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                About The Institution
              </span>
              {aboutSublinks.map((sub) => (
                <a
                  key={sub.name}
                  href={sub.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors min-h-[44px]"
                >
                  <div className="flex items-center gap-2">
                    <span>{sub.name}</span>
                  </div>
                  {sub.badge && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {sub.badge}
                    </span>
                  )}
                </a>
              ))}
            </div>

            <a
              href="#institutions"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-3 rounded-lg text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors min-h-[44px]"
            >
              <span>9 Institutions & Wings</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                9 Wings
              </span>
            </a>

            <a
              href="#events"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3.5 py-3 rounded-lg text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors min-h-[44px]"
            >
              Events & Official Circulars
            </a>

            <a
              href="#reel"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3.5 py-3 rounded-lg text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors min-h-[44px]"
            >
              Campus Moments Reel
            </a>

            <a
              href="#leadership"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3.5 py-3 rounded-lg text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors min-h-[44px]"
            >
              Leadership Committee
            </a>

            <a
              href="#location"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3.5 py-3 rounded-lg text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors min-h-[44px]"
            >
              Campus Map & Directions
            </a>

            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3.5 py-3 rounded-lg text-sm font-semibold text-slate-200 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors min-h-[44px]"
            >
              Contact Directory
            </a>
          </div>

          {/* Quick Action Drawer Buttons */}
          <div className="pt-3 border-t border-white/10 space-y-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDonate();
              }}
              className="w-full bg-[#d97706] hover:bg-[#b45309] active:scale-98 text-white py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md min-h-[44px] transition-all"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Support & Donate (UPI)</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={telLink}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold min-h-[40px]"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call Campus</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateToAdmin();
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-amber-300 text-xs font-semibold min-h-[40px]"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Portal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

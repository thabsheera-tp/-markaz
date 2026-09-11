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
  Building2, 
  Calendar, 
  Mail 
} from 'lucide-react';

export default function Navbar({ onOpenDonate, footerData }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setAboutDropdownOpen(false);
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
      name: 'About Markaz & Heritage',
      href: '#about',
      description: 'Our 30+ year history and academic legacy',
      icon: BookOpen,
    },
    {
      name: 'Leadership & Committee',
      href: '#leadership',
      description: 'Eminent scholars and governing leaders',
      icon: Users,
    },
    {
      name: 'Campus Documentary',
      href: '#documentary',
      description: 'Official video tour & campus life',
      icon: Video,
      badge: 'Video',
    },
    {
      name: 'Mission & Vision',
      href: '#mission',
      description: 'Sacred principles & educational goals',
      icon: Compass,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      {/* Top Banner - Clean, informative & uncrowded */}
      <div className="bg-markaz-blue text-white text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Left: Arabic Invocation & Official Institution Name */}
          <div className="flex items-center gap-2.5 font-arabic text-xs sm:text-sm opacity-95">
            <span className="font-arabic tracking-wide font-normal">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
            <span className="hidden sm:inline font-sans text-xs text-slate-400">|</span>
            <span className="hidden md:inline font-sans text-xs text-slate-200">
              Markazu Da-wathil Islamiyya, Koyyam, Kannur, Kerala
            </span>
          </div>

          {/* Right: Quick Direct Contact Links (No admin button shown publicly) */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs">
            <a
              href={telLink}
              className="flex items-center gap-1.5 font-semibold text-white hover:text-emerald-300 transition-colors whitespace-nowrap"
              title="Click to call directly"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{displayPhone}</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-emerald-300 hover:text-white transition-colors whitespace-nowrap"
              title="Direct WhatsApp Message"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Markazu+Da-wathil+Islamiyya+Koyyam+Kannur+Kerala+670142"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 text-slate-300 hover:text-amber-300 transition-colors whitespace-nowrap"
              title="Google Maps Location"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Map Directions</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-4">
          
          {/* Logo Branding */}
          <a href="#hero" className="flex items-center gap-3 shrink-0 group py-1">
            <img
              src="/markaz-logo.png"
              alt="Koyyam Markaz Logo"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-contain bg-white shadow-sm border border-slate-100 group-hover:scale-105 transition-transform p-0.5"
            />
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black tracking-tight text-markaz-blue uppercase font-sans leading-none">
                Koyyam Markaz
              </span>
              <span className="text-[10px] font-semibold text-markaz-green tracking-wider uppercase mt-1">
                Markazu Da-wathil Islamiyya
              </span>
              <span className="text-[9px] text-slate-400 font-medium">Est. 1992 • Kannur, Kerala</span>
            </div>
          </a>

          {/* Desktop Nav Items - De-congested, organized and spacious */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            <a
              href="#hero"
              className="text-sm font-medium text-slate-700 hover:text-markaz-green transition-colors relative py-1 hover:after:w-full after:w-0 after:h-0.5 after:bg-markaz-green after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300 whitespace-nowrap"
            >
              Home
            </a>

            {/* About Dropdown */}
            <div
              ref={dropdownRef}
              className="relative py-2"
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <a
                href="#about"
                className="text-sm font-medium text-slate-700 hover:text-markaz-green transition-colors flex items-center gap-1.5 whitespace-nowrap group"
              >
                <span>About Markaz</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 group-hover:text-markaz-green transition-transform duration-200 ${
                    aboutDropdownOpen ? 'rotate-180 text-markaz-green' : ''
                  }`}
                />
              </a>

              {/* Dropdown Card */}
              {aboutDropdownOpen && (
                <div className="absolute top-full left-0 w-72 pt-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-2 space-y-1">
                    {aboutSublinks.map((sub) => {
                      const Icon = sub.icon;
                      return (
                        <a
                          key={sub.name}
                          href={sub.href}
                          onClick={() => setAboutDropdownOpen(false)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group/item"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover/item:bg-markaz-green/10 text-slate-600 group-hover/item:text-markaz-green flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-slate-800 group-hover/item:text-markaz-green transition-colors">
                                {sub.name}
                              </span>
                              {sub.badge && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                                  {sub.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
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

            <a
              href="#institutions"
              className="text-sm font-medium text-slate-700 hover:text-markaz-green transition-colors relative py-1 hover:after:w-full after:w-0 after:h-0.5 after:bg-markaz-green after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300 whitespace-nowrap"
            >
              Institutions
            </a>

            <a
              href="#events"
              className="text-sm font-medium text-slate-700 hover:text-markaz-green transition-colors relative py-1 flex items-center gap-1.5 hover:after:w-full after:w-0 after:h-0.5 after:bg-markaz-green after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300 whitespace-nowrap"
            >
              <span>Events & Notices</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                New
              </span>
            </a>

            <a
              href="#location"
              className="text-sm font-medium text-slate-700 hover:text-markaz-green transition-colors relative py-1 hover:after:w-full after:w-0 after:h-0.5 after:bg-markaz-green after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300 whitespace-nowrap"
            >
              Campus Visit
            </a>

            <a
              href="#contact"
              className="text-sm font-medium text-slate-700 hover:text-markaz-green transition-colors relative py-1 hover:after:w-full after:w-0 after:h-0.5 after:bg-markaz-green after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300 whitespace-nowrap"
            >
              Contact
            </a>
          </nav>

          {/* Right Area: Donate CTA & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Desktop & Tablet Donate Button - Sleek, perfectly aligned, never wraps */}
            <button
              onClick={onOpenDonate}
              className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-markaz-green to-emerald-600 hover:from-emerald-700 hover:to-markaz-green text-white px-5 py-2.5 rounded-full font-semibold text-sm shadow-md shadow-emerald-700/20 hover:shadow-lg hover:shadow-emerald-700/30 active:scale-95 transition-all duration-200 whitespace-nowrap shrink-0 group"
              title="Support Koyyam Markaz with your Sadaqah and Donations"
            >
              <Heart className="w-4 h-4 text-emerald-100 fill-red-400 group-hover:scale-110 transition-transform" />
              <span>Donate Now</span>
            </button>

            {/* Mobile-only compact Donate Button */}
            <button
              onClick={onOpenDonate}
              className="sm:hidden inline-flex items-center gap-1.5 bg-gradient-to-r from-markaz-green to-emerald-600 text-white px-3.5 py-2 rounded-full font-semibold text-xs shadow-sm active:scale-95 transition-all whitespace-nowrap"
            >
              <Heart className="w-3.5 h-3.5 fill-red-400 text-emerald-100" />
              <span>Donate</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-markaz-blue hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="space-y-1 pt-2 divide-y divide-slate-100">
            <a
              href="#hero"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-markaz-green hover:bg-slate-50"
            >
              Home Campus
            </a>

            <div className="pt-2 pb-1">
              <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                About The Institution
              </span>
              {aboutSublinks.map((sub) => (
                <a
                  key={sub.name}
                  href={sub.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-markaz-green hover:bg-slate-50"
                >
                  <span>{sub.name}</span>
                  {sub.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider bg-amber-100 text-amber-800">
                      {sub.badge}
                    </span>
                  )}
                </a>
              ))}
            </div>

            <div className="pt-2 space-y-1">
              <a
                href="#institutions"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-markaz-green hover:bg-slate-50"
              >
                9 Institutions & Wings
              </a>

              <a
                href="#events"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-markaz-green hover:bg-slate-50"
              >
                <span>Events & Circulars</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                  New
                </span>
              </a>

              <a
                href="#location"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-markaz-green hover:bg-slate-50"
              >
                Campus Location & Directions
              </a>

              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:text-markaz-green hover:bg-slate-50"
              >
                Contact & Inquiries
              </a>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDonate();
              }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-markaz-green to-emerald-600 text-white py-3 rounded-xl font-semibold shadow-md text-sm"
            >
              <Heart className="w-4 h-4 text-white fill-red-400" />
              <span>Make a Donation (Sadaqah)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

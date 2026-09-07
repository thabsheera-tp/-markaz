import React, { useState } from 'react';
import { Menu, X, Heart, Phone, Shield, ArrowRight } from 'lucide-react';

export default function Navbar({ onOpenDonate, onNavigateToAdmin, footerData }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'About Us', href: '#about' },
    { name: 'Leadership', href: '#leadership' },
    { name: 'Events & Notices', href: '#events', badge: 'New' },
    { name: 'Institutions', href: '#institutions' },
    { name: 'Donate', href: '#donate' },
    { name: 'Location', href: '#location' },
    { name: 'Contact', href: '#contact' },
  ];

  const displayPhone = footerData?.phone || '+91 96567 90577';
  const rawDigits = displayPhone.replace(/[^0-9]/g, '');
  const cleanPhone = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits;
  const telLink = `tel:+${cleanPhone}`;
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent('Assalamu Alaikum, I would like to inquire about Koyyam Markaz.')}`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      {/* Top Banner */}
      <div className="bg-markaz-blue text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3 font-arabic text-sm opacity-90">
            <span>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
            <span className="hidden md:inline font-sans text-xs text-slate-300">|</span>
            <span className="hidden md:inline font-sans text-xs text-slate-200">
              Markazu Da-wathil Islamiyya, Koyyam, Kannur, Kerala
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <a
              href={telLink}
              className="flex items-center gap-1.5 font-bold hover:text-emerald-300 transition-colors"
              title="Click to call directly"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{displayPhone}</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-emerald-300 hover:text-white transition-colors"
              title="Direct WhatsApp Message"
            >
              <span>WhatsApp Message</span>
            </a>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Markazu+Da-wathil+Islamiyya+Koyyam+Kannur+Kerala+670142"
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-1 text-slate-300 hover:text-amber-300 transition-colors"
            >
              <span>Map Directions</span>
            </a>
            <button
              onClick={onNavigateToAdmin}
              className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors bg-white/10 px-2 py-0.5 rounded text-[11px]"
              title="Institution Management"
            >
              <Shield className="w-3 h-3 text-amber-400" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Branding */}
          <a href="#hero" className="flex items-center gap-3 group">
            <img
              src="/markaz-logo.png"
              alt="Koyyam Markaz Logo"
              className="w-12 h-12 rounded-xl object-contain bg-white shadow-sm border border-slate-100 group-hover:scale-105 transition-transform p-0.5"
            />
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-markaz-blue uppercase font-sans leading-none">
                Koyyam Markaz
              </span>
              <span className="text-[10px] font-semibold text-markaz-green tracking-wider uppercase mt-1">
                Markazu Da-wathil Islamiyya
              </span>
              <span className="text-[9px] text-slate-400 font-medium">Est. 1992 • Kannur, Kerala</span>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors relative py-1 flex items-center gap-1.5 hover:after:w-full after:w-0 after:h-0.5 after:bg-markaz-green after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300 ${
                  link.special
                    ? 'text-emerald-700 font-semibold'
                    : 'text-slate-700 hover:text-markaz-green'
                }`}
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                      link.special
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </a>
            ))}
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenDonate}
              className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-markaz-green to-emerald-600 hover:from-markaz-green-dark hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-markaz-green/20 hover:shadow-lg hover:shadow-markaz-green/30 active:scale-95 transition-all"
            >
              <Heart className="w-4 h-4 text-red-200 fill-current animate-pulse" />
              <span>Donate Now</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-markaz-blue hover:bg-slate-100 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="space-y-1 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  link.special
                    ? 'text-emerald-800 bg-emerald-50/70 font-semibold'
                    : 'text-slate-700 hover:text-markaz-green hover:bg-slate-50'
                }`}
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      link.special
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </a>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDonate();
              }}
              className="w-full flex items-center justify-center gap-2 bg-markaz-green text-white py-3 rounded-xl font-semibold shadow-md"
            >
              <Heart className="w-4 h-4 text-red-200 fill-current" />
              <span>Make a Donation</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToAdmin();
              }}
              className="w-full flex items-center justify-center gap-2 text-slate-700 bg-slate-100 hover:bg-slate-200 py-2.5 rounded-xl font-medium text-sm transition-colors"
            >
              <Shield className="w-4 h-4 text-slate-500" />
              <span>Admin Management Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

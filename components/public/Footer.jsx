'use client';
import React from 'react';
import { MapPin, Phone, Mail, MessageCircle, ArrowUp, Compass } from 'lucide-react';

function FacebookIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function YoutubeIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export default function Footer({ footerData, onNavigateToAdmin }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const displayPhone = footerData?.phone || '+91 96567 90577';
  const rawDigits = displayPhone.replace(/[^0-9]/g, '');
  const cleanPhone = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits;
  const telLink = `tel:+${cleanPhone}`;
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent('Assalamu Alaikum, I would like to inquire about Koyyam Markaz.')}`;

  return (
    <footer id="contact" className="w-full max-w-full overflow-hidden bg-[#002B49] text-white relative border-t-4 border-[#004B87]">
      
      {/* Social Media Follow Ribbon */}
      <div className="bg-[#061726] border-b border-white/10 py-4 sm:py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <span className="text-xs font-serif font-academic font-bold uppercase tracking-widest text-slate-300 text-center sm:text-left">
            Connect With Markazu Da-wathil Islamiyya
          </span>
          <div className="flex items-center gap-2.5 sm:gap-3">
            {footerData?.facebook && (
              <a
                href={footerData.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 sm:w-9 sm:h-9 rounded-lg bg-white/10 hover:bg-[#004B87] active:scale-95 flex items-center justify-center transition-all text-white touch-manipulation"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
            )}
            {footerData?.instagram && (
              <a
                href={footerData.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 sm:w-9 sm:h-9 rounded-lg bg-white/10 hover:bg-[#004B87] active:scale-95 flex items-center justify-center transition-all text-white touch-manipulation"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            )}
            {footerData?.youtube && (
              <a
                href={footerData.youtube}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 sm:w-9 sm:h-9 rounded-lg bg-white/10 hover:bg-[#004B87] active:scale-95 flex items-center justify-center transition-all text-white touch-manipulation"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
            )}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 sm:w-9 sm:h-9 rounded-lg bg-[#059669] hover:bg-[#047857] active:scale-95 flex items-center justify-center transition-all text-white touch-manipulation"
              aria-label="WhatsApp"
              title="Direct WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Sitemap */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          
          {/* Col 1: Crest & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/markaz-logo.png"
                alt="Koyyam Markaz Crest"
                className="w-12 h-12 rounded object-contain bg-white p-1 shadow-sm shrink-0"
              />
              <div>
                <span className="text-base font-serif font-academic font-bold uppercase tracking-wider block leading-tight">
                  Koyyam Markaz
                </span>
                <span className="text-[10px] text-emerald-300 font-semibold tracking-wider uppercase block">
                  MARKAZU DA-WATHIL ISLAMIYYA
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-light">
              Nurturing generations with authentic Islamic scholarship, academic competence, and philanthropic care in Kannur, Kerala since 1992.
            </p>
            <div className="pt-2">
              <span className="text-[11px] text-blue-200 font-arabic block">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </span>
            </div>
          </div>

          {/* Col 2: Academic Wings */}
          <div>
            <h4 className="text-xs font-serif font-academic font-bold uppercase tracking-widest text-amber-300 mb-4 pb-2 border-b border-white/10">
              Academic Wings & Colleges
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-light">
              <li><a href="#institutions" className="inline-block py-1 hover:text-white transition-colors">Kulliyya of Sharee'ath</a></li>
              <li><a href="#institutions" className="inline-block py-1 hover:text-white transition-colors">Tahfeezul Qur-an College</a></li>
              <li><a href="#institutions" className="inline-block py-1 hover:text-white transition-colors">Hadiya Women's Academy</a></li>
              <li><a href="#institutions" className="inline-block py-1 hover:text-white transition-colors">Da'wa Senior Academy</a></li>
              <li><a href="#institutions" className="inline-block py-1 hover:text-white transition-colors">College of Arts & Commerce</a></li>
              <li><a href="#institutions" className="inline-block py-1 hover:text-white transition-colors">Orphan & Destitute Welfare</a></li>
            </ul>
          </div>

          {/* Col 3: Institutional Links */}
          <div>
            <h4 className="text-xs font-serif font-academic font-bold uppercase tracking-widest text-amber-300 mb-4 pb-2 border-b border-white/10">
              Campus & Governance
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-light">
              <li><a href="#about" className="inline-block py-1 hover:text-white transition-colors">History & Heritage</a></li>
              <li><a href="#mission" className="inline-block py-1 hover:text-white transition-colors">Mission & Guiding Pillars</a></li>
              <li><a href="#leadership" className="inline-block py-1 hover:text-white transition-colors">Governing Committee</a></li>
              <li><a href="#events" className="inline-block py-1 hover:text-white transition-colors">Circulars & Announcements</a></li>
              <li><a href="#documentary" className="inline-block py-1 hover:text-white transition-colors">Campus Documentary</a></li>
              <li><a href="#location" className="inline-block py-1 hover:text-white transition-colors">Visit & Transit Directions</a></li>
              {onNavigateToAdmin && (
                <li className="pt-1">
                  <button 
                    onClick={onNavigateToAdmin}
                    className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 py-1 font-medium transition-colors"
                  >
                    <span>Staff & Admin Portal</span>
                    <span>&rarr;</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 4: Official Contact */}
          <div>
            <h4 className="text-xs font-serif font-academic font-bold uppercase tracking-widest text-amber-300 mb-4 pb-2 border-b border-white/10">
              Campus Headquarters
            </h4>
            <ul className="space-y-3 text-xs text-slate-300 font-light">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-300 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{footerData?.address || 'Markazu Da-wathil Islamiyya, Koyyam P.O., Kannur District, Kerala - 670142'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-300 shrink-0" />
                <a href={telLink} className="py-1 hover:text-white transition-colors font-medium">
                  {displayPhone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-300 shrink-0" />
                <a href={`mailto:${footerData?.email?.split(',')[0] || 'info@koyyammarkaz.com'}`} className="py-1 hover:text-white transition-colors truncate">
                  {footerData?.email?.split(',')[0] || 'info@koyyammarkaz.com'}
                </a>
              </li>
              <li className="pt-2">
                <a
                  href="#donate"
                  className="inline-flex items-center justify-center min-h-[44px] bg-[#d97706] hover:bg-[#b45309] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all rounded shadow-sm w-full sm:w-auto text-center"
                >
                  Online Endowment & Sadaqah
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Wordmark Sub-Footer */}
        <div className="mt-12 sm:mt-14 pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-light text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="font-serif font-academic uppercase text-white font-bold tracking-wider">
              Markazu Da-wathil Islamiyya
            </span>
            <span className="hidden sm:inline">•</span>
            <span>Koyyam, Kannur</span>
          </div>

          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} All rights reserved.</span>
            <button
              onClick={scrollToTop}
              className="w-10 h-10 sm:w-8 sm:h-8 rounded bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all flex items-center justify-center touch-manipulation"
              title="Back to top"
              aria-label="Scroll back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}

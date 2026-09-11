'use client';
import React from 'react';
import { MapPin, Phone, Mail, MessageCircle, ArrowUp } from 'lucide-react';

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

export default function Footer({ footerData }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const displayPhone = footerData?.phone || '+91 96567 90577';
  const rawDigits = displayPhone.replace(/[^0-9]/g, '');
  const cleanPhone = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits;
  const telLink = `tel:+${cleanPhone}`;
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent('Assalamu Alaikum, I would like to inquire about Koyyam Markaz.')}`;

  return (
    <footer id="contact" className="bg-slate-950 text-white relative border-t border-white/10">
      {/* Top Banner Accent Line */}
      <div className="h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500 opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Col 1: About Markaz */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/markaz-logo.png"
                alt="Koyyam Markaz Logo"
                className="w-11 h-11 rounded-xl object-contain bg-white shadow-sm p-1 border border-white/15"
              />
              <div>
                <span className="text-lg font-black uppercase tracking-tight block leading-tight">Koyyam Markaz</span>
                <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase block">MARKAZU DA-WATHIL ISLAMIYYA</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Nurturing generations with sacred Qur-anic knowledge, academic rigor, and compassionate community empowerment since 1992 in Kannur, Kerala.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              {footerData?.facebook && (
                <a
                  href={footerData.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-emerald-600 flex items-center justify-center transition-all text-slate-300 hover:text-white border border-white/10 hover:border-emerald-500"
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
                  className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-emerald-600 flex items-center justify-center transition-all text-slate-300 hover:text-white border border-white/10 hover:border-emerald-500"
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
                  className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-emerald-600 flex items-center justify-center transition-all text-slate-300 hover:text-white border border-white/10 hover:border-emerald-500"
                  aria-label="YouTube"
                >
                  <YoutubeIcon className="w-4 h-4" />
                </a>
              )}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-500/20 hover:bg-emerald-600 flex items-center justify-center transition-all text-emerald-300 hover:text-white border border-emerald-500/30"
                aria-label="Direct WhatsApp Message"
                title="Direct WhatsApp Message"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 mb-5">
              Explore Campus
            </h4>
            <ul className="space-y-3 text-xs text-slate-400 font-light">
              <li><a href="#hero" className="hover:text-white transition-colors">Home Campus</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">Our Heritage & Story</a></li>
              <li><a href="#mission" className="hover:text-white transition-colors">Mission & Objectives</a></li>
              <li><a href="#institutions" className="hover:text-white transition-colors">9 Institutions & Wings</a></li>
              <li><a href="#donate" className="hover:text-white transition-colors">Sadaqah & Donations</a></li>
            </ul>
          </div>

          {/* Col 3: Key Institutions */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 mb-5">
              Featured Programs
            </h4>
            <ul className="space-y-3 text-xs text-slate-400 font-light">
              <li>Kulliyya of Islamic Sharee'ath</li>
              <li>Tahfeezul Qur-an College</li>
              <li>Da'wa Secondary & Senior Academy</li>
              <li>Hadiya Women's Academy</li>
              <li>College of Arts, Science & Commerce</li>
              <li>Technical & Vocational Skills Wing</li>
            </ul>
          </div>

          {/* Col 4: Contact Information */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 mb-5">
              Reach Our Campus
            </h4>
            <ul className="space-y-3.5 text-xs text-slate-400 font-light">
              <li className="flex items-start gap-2.5 group">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=Koyyam+Markaz+Kannur+Kerala+670142"
                    target="_blank"
                    rel="noreferrer"
                    className="leading-relaxed hover:text-white transition-colors block"
                    title="Get directions on Google Maps"
                  >
                    {footerData?.address || 'Markazu Da-wathil Islamiyya, Koyyam P.O., Kannur District, Kerala - 670142'}
                  </a>
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=Koyyam+Markaz+Kannur+Kerala+670142"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1 mt-0.5"
                  >
                    <span>Get Google Maps Directions &rarr;</span>
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={telLink}
                  className="font-semibold text-white hover:text-emerald-300 transition-colors inline-flex items-center gap-1.5"
                  title="Direct phone call"
                >
                  <span>{displayPhone}</span>
                  <span className="text-[10px] bg-white/10 text-emerald-300 px-1.5 py-0.5 rounded font-normal">Call</span>
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-1.5"
                  title="Direct WhatsApp Message"
                >
                  <span>WhatsApp Message</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-normal">Direct</span>
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`mailto:${footerData?.email?.split(',')[0] || 'info@koyyammarkaz.org'}`}
                  className="truncate hover:text-white transition-colors"
                >
                  {footerData?.email?.split(',')[0] || 'info@koyyammarkaz.org'}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-light">
          <div>
            © {new Date().getFullYear()} Markazu Da-wathil Islamiyya, Koyyam. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-arabic text-slate-400">جَزَاكُمُ اللَّهُ خَيْرًا</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-white/[0.06] hover:bg-white/15 text-slate-300 hover:text-white transition-colors border border-white/10"
              title="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}

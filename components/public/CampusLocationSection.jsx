'use client';
import React from 'react';
import { MapPin, Phone, MessageCircle, Navigation, ExternalLink, Compass, Clock, Building } from 'lucide-react';

export default function CampusLocationSection({ footerData }) {
  const address = footerData?.address || 'Markazu Da-wathil Islamiyya, Koyyam P.O., Kannur District, Kerala, India - Pin: 670142';
  const displayPhone = footerData?.phone || '+91 96567 90577';
  const rawDigits = displayPhone.replace(/[^0-9]/g, '');
  const cleanPhone = rawDigits.length === 10 ? `91${rawDigits}` : rawDigits;
  const telLink = `tel:+${cleanPhone}`;
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent('Assalamu Alaikum, I would like to inquire about Koyyam Markaz.')}`;

  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Markazu Da-wathil Islamiyya, Koyyam, Kannur, Kerala 670142')}`;
  const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('Koyyam Markaz, Kannur, Kerala 670142')}`;

  return (
    <section id="location" className="py-24 sm:py-28 bg-white relative border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-markaz-green border border-emerald-200/70 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>Campus Visit & Navigation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-markaz-blue tracking-tight leading-tight">
            Find Us at Koyyam, Kannur
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 font-light leading-relaxed">
            Located in the serene landscapes of North Malabar, welcoming students, guardians, and guests worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Campus Details & Direct Action Cards (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            
            {/* Address Card */}
            <div className="bg-slate-50/70 p-6 rounded-3xl border border-slate-200/70 shadow-subtle space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-markaz-blue text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Building className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Headquarters Address</h3>
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed mt-1">
                    {address}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/80 text-xs font-light">
                <div className="flex items-center gap-2 text-slate-600">
                  <Compass className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kannur District, Kerala</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Open: Sat - Thu (8am-5pm)</span>
                </div>
              </div>
            </div>

            {/* Travel Distances */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/70 shadow-subtle space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Transit Accessibility
              </h4>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <span className="block text-xs font-black text-markaz-blue">32 KM</span>
                  <span className="text-[10px] text-slate-400 font-medium">Kannur Airport (CNN)</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <span className="block text-xs font-black text-markaz-blue">14 KM</span>
                  <span className="text-[10px] text-slate-400 font-medium">Payyanur Railway</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <span className="block text-xs font-black text-markaz-blue">24 KM</span>
                  <span className="text-[10px] text-slate-400 font-medium">Kannur Main (CAN)</span>
                </div>
              </div>
            </div>

            {/* Direct Connect Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Direct Call Helpline */}
              <a
                href={telLink}
                className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200/70 hover:border-markaz-green shadow-subtle hover:shadow-card transition-all group"
                title="Click to call directly"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-markaz-green flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Direct Contact • Call</span>
                  <span className="text-sm font-extrabold text-slate-900 group-hover:text-markaz-green transition-colors">{displayPhone}</span>
                </div>
              </a>

              {/* Direct WhatsApp Message */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200/70 hover:border-emerald-500 shadow-subtle hover:shadow-card transition-all group"
                title="Click to chat directly on WhatsApp"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Direct WhatsApp Message</span>
                  <span className="text-sm font-extrabold text-emerald-700">Chat on WhatsApp &rarr;</span>
                </div>
              </a>
            </div>

            {/* Google Maps Actions */}
            <div className="flex gap-3 pt-2">
              <a
                href={mapsDirectionsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-markaz-blue hover:bg-markaz-blue-light text-white font-bold py-3.5 rounded-full text-xs shadow-card transition-all hover:-translate-y-0.5"
              >
                <Navigation className="w-4 h-4 text-emerald-300" />
                <span>Get Driving Directions</span>
              </a>
              <a
                href={mapsSearchUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center p-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Open in Google Maps"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>

          {/* Right Column: Embedded Interactive Map Frame (7 cols) */}
          <div className="lg:col-span-7 h-[360px] lg:h-auto rounded-3xl overflow-hidden shadow-card border border-slate-200/80 relative bg-slate-100">
            <iframe
              title="Koyyam Markaz Location Map"
              src="https://maps.google.com/maps?q=Markazu%20Da-wathil%20Islamiyya%20Koyyam%20Kannur%20Kerala&t=&z=14&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '340px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
            {/* Float badge over map */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-subtle border border-slate-200/80 flex items-center gap-2 pointer-events-none">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-markaz-blue">Koyyam Markaz Campus</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

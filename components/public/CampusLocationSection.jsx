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
    <section id="location" className="py-20 sm:py-24 bg-white relative border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#004B87] block mb-2 font-sans">
            Campus Visit & Transit
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-academic font-bold text-[#061726] tracking-tight">
            Visiting Our Campus at Koyyam, Kannur
          </h2>
          <div className="w-16 h-1 bg-[#004B87] mx-auto mt-4 mb-4" />
          <p className="text-slate-600 text-sm sm:text-base font-light leading-relaxed">
            Situated amidst the peaceful landscapes of North Malabar, welcoming students, scholarly guests, and visitors from across the globe.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Campus Details (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            
            {/* Address Card */}
            <div className="bg-[#f8fafc] p-6 border border-slate-200 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 bg-[#002B49] text-white flex items-center justify-center shrink-0">
                  <Building className="w-5 h-5 text-blue-200" />
                </div>
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Campus Headquarters</h3>
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed mt-1">
                    {address}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 text-xs font-light">
                <div className="flex items-center gap-2 text-slate-600">
                  <Compass className="w-4 h-4 text-[#004B87] shrink-0" />
                  <span>Kannur District, Kerala</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-4 h-4 text-[#004B87] shrink-0" />
                  <span>Administrative Office: 8am - 5pm</span>
                </div>
              </div>
            </div>

            {/* Transit Distances */}
            <div className="bg-white p-6 border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Transit Accessibility
              </h4>
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-3 bg-[#f8fafc] border border-slate-200">
                  <span className="block text-xs font-bold text-[#002B49]">32 KM</span>
                  <span className="text-[10px] text-slate-500 font-light">Kannur Airport (CNN)</span>
                </div>
                <div className="p-3 bg-[#f8fafc] border border-slate-200">
                  <span className="block text-xs font-bold text-[#002B49]">14 KM</span>
                  <span className="text-[10px] text-slate-500 font-light">Payyanur Station</span>
                </div>
                <div className="p-3 bg-[#f8fafc] border border-slate-200">
                  <span className="block text-xs font-bold text-[#002B49]">24 KM</span>
                  <span className="text-[10px] text-slate-500 font-light">Kannur City</span>
                </div>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={mapsDirectionsUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-[#002B49] hover:bg-[#004B87] text-white p-3 text-xs font-bold uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-[#059669] hover:bg-[#047857] text-white p-3 text-xs font-bold uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Campus Helpdesk</span>
              </a>
            </div>

          </div>

          {/* Right Column: Google Maps Interactive Frame (7 cols) */}
          <div className="lg:col-span-7 bg-[#f8fafc] border border-slate-200 overflow-hidden min-h-[380px] relative">
            <iframe
              title="Koyyam Markaz Google Maps Location"
              src="https://maps.google.com/maps?q=Markazu%20Da-wathil%20Islamiyya%20Koyyam%20Kannur%20Kerala&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full min-h-[380px] border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>

        </div>

      </div>
    </section>
  );
}

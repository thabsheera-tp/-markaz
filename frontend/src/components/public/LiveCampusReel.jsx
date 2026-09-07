import React from 'react';
import { api } from '../../services/api';
import { Sparkles, Eye } from 'lucide-react';

export default function LiveCampusReel() {
  const photos = [
    {
      src: '/uploads/markaz.jpeg',
      title: 'Main Campus & Grand Entrance',
      malayalam: 'പ്രധാന കവാടവും ക്യാമ്പസും',
      category: 'Headquarters'
    },
    {
      src: '/uploads/masjid.jpeg',
      title: 'Masjid',
      malayalam: 'മസ്ജിദ്',
      category: 'Spiritual'
    },
    {
      src: '/uploads/dars.jpeg',
      title: 'Sharee-ath Dars & Scholars',
      malayalam: 'ദർസ് ശരീഅത്ത് പഠനം',
      category: 'Academic'
    },
    {
      src: '/uploads/hifz.jpeg',
      title: 'Tahfeezul Qur-an Class',
      malayalam: 'ഹിഫ്ളുൽ ഖുർആൻ കോളേജ്',
      category: 'Qur-an'
    },
    {
      src: '/uploads/assembly.jpeg',
      title: 'Morning Moral Assembly',
      malayalam: 'പ്രഭാത അസംബ്ലി',
      category: 'Student Life'
    },
    {
      src: '/uploads/indpndce day.jpeg',
      title: 'National Harmony & Celebrations',
      malayalam: 'സ്വാതന്ത്ര്യദിനാഘോഷം',
      category: 'Brotherhood'
    },
    {
      src: '/uploads/full.jpeg',
      title: 'Aerial View of Koyyam Campus',
      malayalam: 'ക്യാമ്പസ് വിദൂര ദൃശ്യം',
      category: 'Panorama'
    }
  ];

  // Duplicate for seamless infinite continuous scroll loop
  const marqueeItems = [...photos, ...photos];

  return (
    <div className="bg-markaz-blue-dark py-8 overflow-hidden relative border-y-2 border-emerald-500/30">
      
      {/* Top Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div>
            <h3 className="text-white font-extrabold text-sm sm:text-base uppercase tracking-wider flex items-center gap-2">
              <span>Live Campus Gallery</span>
              <span className="text-emerald-400 font-normal normal-case text-xs sm:text-sm">
                • ജീവൻതുടിക്കുന്ന ക്യാമ്പസ് കാഴ്ചകൾ
              </span>
            </h3>
          </div>
        </div>

        <div className="text-slate-400 text-xs flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Continuous Live Reel</span>
        </div>
      </div>

      {/* Infinite Seamless Moving Reel */}
      <div className="relative w-full overflow-hidden">
        {/* Left & Right Gradient Shadows for seamless fade */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-markaz-blue-dark to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-markaz-blue-dark to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex gap-5 py-2">
          {marqueeItems.map((item, idx) => (
            <div
              key={idx}
              className="relative w-64 sm:w-72 h-44 rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-lg group hover:scale-[1.03] transition-transform duration-300 select-none cursor-pointer"
            >
              <img
                src={api.getImageUrl(item.src)}
                alt={item.title}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = item.src;
                }}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              
              {/* Category Pill */}
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase">
                  {item.category}
                </span>
              </div>

              {/* Title & Malayalam Caption */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5">
                <p className="text-white text-xs font-bold leading-tight truncate">
                  {item.title}
                </p>
                <p className="text-emerald-300 text-[11px] font-medium mt-0.5 truncate">
                  {item.malayalam}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

'use client';
import React, { useRef } from 'react';
import { api } from '../../services/api';
import { Sparkles, ChevronLeft, ChevronRight, Camera } from 'lucide-react';

export default function LiveCampusReel() {
  const scrollRef = useRef(null);

  const photos = [
    {
      src: '/uploads/markaz.jpeg',
      title: 'Main Campus & Grand Entrance',
      malayalam: 'പ്രധാന കവാടവും ക്യാമ്പസും',
      category: 'Headquarters'
    },
    {
      src: '/uploads/masjid.jpeg',
      title: 'Masjidul Huda & Prayer Hall',
      malayalam: 'മസ്ജിദ്',
      category: 'Spiritual Life'
    },
    {
      src: '/uploads/dars.jpeg',
      title: 'Sharee-ath Dars & Scholarly Circles',
      malayalam: 'ദർസ് ശരീഅത്ത് പഠനം',
      category: 'Academic Study'
    },
    {
      src: '/uploads/hifz.jpeg',
      title: 'Tahfeezul Qur-an Classrooms',
      malayalam: 'ഹിഫ്ളുൽ ഖുർആൻ കോളേജ്',
      category: 'Qur-an College'
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
      category: 'Community'
    },
    {
      src: '/uploads/full.jpeg',
      title: 'Aerial View of Koyyam Campus',
      malayalam: 'ക്യാമ്പസ് വിദൂര ദൃശ്യം',
      category: 'Campus Grounds'
    }
  ];

  // Duplicate for seamless continuous scroll loop
  const marqueeItems = [...photos, ...photos];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="reel" className="bg-[#072135] py-14 overflow-hidden relative border-y border-[#144c77]">
      {/* Top Section Header (Academic Mosaic Style) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex flex-wrap items-end justify-between gap-4 relative z-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-300 block mb-1 font-sans">
            Life At Koyyam Markaz
          </span>
          <h3 className="text-2xl sm:text-3xl font-serif font-academic font-bold text-white tracking-tight flex items-center gap-3">
            <span>Campus Moments & Visual Story</span>
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm font-light mt-1">
            Glimpses into student life, scholarly gatherings, prayer circles, and campus traditions.
          </p>
        </div>

        {/* Continuous Reel Badge & Manual Nav */}
        <div className="flex items-center gap-3">
          <div className="text-slate-300 text-xs flex items-center gap-1.5 font-medium px-3 py-1 rounded bg-white/10 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] tracking-wide text-slate-200 uppercase font-semibold">Live Carousel</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded bg-[#0a2e4a] hover:bg-[#144c77] border border-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded bg-[#0a2e4a] hover:bg-[#144c77] border border-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Infinite Moving Marquee with manual scroll capability */}
      <div 
        ref={scrollRef}
        className="relative w-full overflow-x-auto no-scrollbar mask-gradient-x select-none"
      >
        <div className="animate-marquee flex gap-4 py-2 px-4">
          {marqueeItems.map((item, idx) => (
            <div
              key={idx}
              className="relative w-72 sm:w-80 h-48 sm:h-52 overflow-hidden shrink-0 border border-white/20 shadow-md group select-none cursor-pointer bg-[#061726]"
            >
              <img
                src={api.getImageUrl(item.src)}
                alt={item.title}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = item.src;
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061726] via-black/20 to-transparent" />
              
              {/* Category Tag */}
              <div className="absolute top-2.5 left-2.5">
                <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-[#002B49]/90 text-white border border-white/20">
                  {item.category}
                </span>
              </div>

              {/* Title and Info Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-3.5 bg-gradient-to-t from-[#061726]/95 to-transparent">
                <h4 className="text-white font-serif font-bold text-xs sm:text-sm font-academic leading-tight">
                  {item.title}
                </h4>
                <p className="text-[11px] text-amber-300 font-light mt-0.5 font-sans">
                  {item.malayalam}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

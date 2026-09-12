'use client';
import React, { useState } from 'react';
import { Play, Heart, Film, ExternalLink, GraduationCap, X } from 'lucide-react';

function YoutubeIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export default function DocumentarySection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const youtubeUrl = 'https://youtu.be/SuaBhNM9FHg?si=oW2mTVbSKv8FG5G0';
  const embedUrl = 'https://www.youtube-nocookie.com/embed/SuaBhNM9FHg?autoplay=1&rel=0';

  const scrollToDonate = () => {
    const el = document.getElementById('donate');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="documentary" className="py-20 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#004B87] block mb-2 font-sans">
            Special Highlights
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-academic font-bold text-[#061726] tracking-tight">
            Campus Tour & Philanthropic Initiatives
          </h2>
          <div className="w-16 h-1 bg-[#004B87] mx-auto mt-4 mb-4" />
          <p className="text-slate-600 text-sm sm:text-base font-light leading-relaxed">
            Experience our 34-year legacy firsthand through our official documentary, or extend a helping hand to support student education and orphan welfare.
          </p>
        </div>

        {/* Dual Promo Cards (Matching Columbia Reference Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Promo Card 1: Official Campus Documentary */}
          <div className="bg-[#f8fafc] border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group">
            <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-900">
              <img
                src="https://img.youtube.com/vi/SuaBhNM9FHg/maxresdefault.jpg"
                alt="Koyyam Markaz Documentary"
                onError={(e) => {
                  e.currentTarget.src = 'https://img.youtube.com/vi/SuaBhNM9FHg/hqdefault.jpg';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              {/* Play Overlay Button */}
              <button
                onClick={() => setIsVideoOpen(true)}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#002B49]/90 hover:bg-[#004B87] text-white flex items-center justify-center border-2 border-white transition-transform hover:scale-110 shadow-lg"
                aria-label="Play documentary video"
              >
                <Play className="w-6 h-6 fill-white ml-0.5" />
              </button>

              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white flex items-center gap-1">
                  <YoutubeIcon className="w-3 h-3" />
                  <span>Official Video</span>
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-serif font-academic font-bold text-[#061726] mb-2 leading-tight">
                  Journey of Faith & Service: The Official Documentary
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed">
                  A comprehensive visual presentation depicting life at Koyyam Markaz, student assemblies, classical Dars circles, and community empowerment.
                </p>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setIsVideoOpen(true)}
                  className="w-full bg-[#002B49] hover:bg-[#004B87] text-white py-3 text-xs font-bold uppercase tracking-wider text-center transition-colors shadow-xs"
                >
                  Watch Campus Tour
                </button>
              </div>
            </div>
          </div>

          {/* Promo Card 2: Student Welfare & Orphan Care */}
          <div className="bg-[#f8fafc] border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group">
            <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-900">
              <img
                src="/uploads/hifz.jpeg"
                alt="Student Welfare & Tahfeezul Qur-an"
                onError={(e) => {
                  e.currentTarget.src = '/uploads/markaz.jpeg';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#d97706] text-white">
                  Philanthropy & Endowment
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-serif font-academic font-bold text-[#061726] mb-2 leading-tight">
                  Sponsor a Student: Invest in Sacred Knowledge
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed">
                  Support the full boarding, meals, textbooks, and health care of an orphan or destitute scholar through perpetual Sadaqah Jariyah.
                </p>
              </div>

              <div className="mt-6">
                <button
                  onClick={scrollToDonate}
                  className="w-full bg-[#d97706] hover:bg-[#b45309] text-white py-3 text-xs font-bold uppercase tracking-wider text-center transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Support a Student Today</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Video Lightbox Modal */}
        {isVideoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl bg-black border border-white/20 shadow-2xl overflow-hidden aspect-video">
              <button
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-3 right-3 z-10 p-2 bg-black/70 text-white rounded-full hover:bg-red-600 transition-colors"
                aria-label="Close video"
              >
                <X className="w-5 h-5" />
              </button>
              <iframe
                src={embedUrl}
                title="Markazu Da-wathil Islamiyya Koyyam Official Documentary"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

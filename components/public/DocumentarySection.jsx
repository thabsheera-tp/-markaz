'use client';
import React, { useState } from 'react';
import { Play, Video, Sparkles, ExternalLink, Heart, CheckCircle2, Film } from 'lucide-react';

function YoutubeIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export default function DocumentarySection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const youtubeUrl = 'https://youtu.be/SuaBhNM9FHg?si=oW2mTVbSKv8FG5G0';
  const embedUrl = 'https://www.youtube-nocookie.com/embed/SuaBhNM9FHg?autoplay=1&rel=0';

  return (
    <section id="documentary" className="py-20 sm:py-24 bg-gradient-to-b from-slate-900 via-markaz-blue/95 to-slate-950 text-white relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-markaz-green/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Islamic geometric pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 40px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-amber-300 text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-sm shadow-xs">
            <Film className="w-3.5 h-3.5" />
            <span>Official Documentary • സമഗ്ര ഡോക്യുമെന്ററി</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Journey of Faith, Knowledge &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-amber-400">
              Humanitarian Service
            </span>
          </h2>

          <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-light">
            Step inside Koyyam Markaz through our official documentary. Explore three decades of spiritual education, destitute care, and academic excellence nurtured under dedicated leadership.
          </p>
        </div>

        {/* Video Frame */}
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/80 border border-white/20 bg-slate-950 aspect-video group">
            
            {isPlaying ? (
              <iframe
                src={embedUrl}
                title="Markazu Da-wathil Islamiyya Koyyam Official Documentary"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            ) : (
              <div className="relative w-full h-full">
                {/* High-res YouTube thumbnail with fallback */}
                <img
                  src="https://img.youtube.com/vi/SuaBhNM9FHg/maxresdefault.jpg"
                  alt="Koyyam Markaz Documentary Preview"
                  onError={(e) => {
                    e.currentTarget.src = 'https://img.youtube.com/vi/SuaBhNM9FHg/hqdefault.jpg';
                  }}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />

                {/* Dark overlay for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-black/30 group-hover:via-slate-950/30 transition-all duration-300" />

                {/* Central Play Button */}
                <button
                  onClick={() => setIsPlaying(true)}
                  aria-label="Play Koyyam Markaz Documentary"
                  className="absolute inset-0 m-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-markaz-green to-emerald-400 text-white flex items-center justify-center shadow-2xl shadow-markaz-green/50 hover:scale-110 active:scale-95 transition-all duration-300 border-4 border-white/80 group-hover:border-white focus:outline-none"
                >
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
                </button>

                {/* Bottom Video Badge Info */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pointer-events-none">
                  <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                    <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">Official Video Presentation</p>
                    <p className="text-sm font-extrabold text-white">Markazu Da-wathil Islamiyya, Koyyam</p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                    <YoutubeIcon className="w-3.5 h-3.5" />
                    <span>Watch Full Video</span>
                  </span>
                </div>
              </div>
            )}

          </div>

          {/* Action Row & External Link */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30 shrink-0">
                <YoutubeIcon className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Prefer watching directly on YouTube?</p>
                <p className="text-[11px] text-slate-400">Share with family, friends, and community members.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all hover:scale-105"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in YouTube</span>
              </a>

              <a
                href="#donate"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all hover:scale-105"
              >
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-current" />
                <span>Support Our Mission</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

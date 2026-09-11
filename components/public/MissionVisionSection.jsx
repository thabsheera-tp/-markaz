'use client';
import React from 'react';
import { Compass, Eye, Target, Sparkles, BookOpen, Globe, Heart, Star } from 'lucide-react';

export default function MissionVisionSection({ items = [] }) {
  const fallbackItems = [
    {
      id: 1,
      type: 'mission',
      title: 'Our Sacred Mission',
      description: 'To impart traditional Islamic and contemporary secular education that nurtures spiritual purity, intellectual vigor, moral uprightness, and dedicated leadership for society.',
      icon: 'Compass'
    },
    {
      id: 2,
      type: 'vision',
      title: 'Our Vision for Tomorrow',
      description: 'To establish a world-class center of spiritual enlightenment, academic research, and philanthropic excellence, shaping generations who foster peace, ethical progress, and social justice.',
      icon: 'Eye'
    }
  ];

  const displayItems = items && items.length > 0 ? items : fallbackItems;
  const mission = displayItems.find((i) => i.type === 'mission') || displayItems[0];
  const vision = displayItems.find((i) => i.type === 'vision') || displayItems[1];

  const missionHighlights = [
    { icon: BookOpen, text: 'Authentic Islamic scholarship blended with modern academics' },
    { icon: Heart, text: 'Nurturing moral character and spiritual discipline' },
    { icon: Star, text: 'Empowering community leaders rooted in Islamic values' },
  ];

  const visionHighlights = [
    { icon: Globe, text: 'A globally recognized center of Islamic learning' },
    { icon: Sparkles, text: 'Shaping scholars who champion peace and justice' },
    { icon: Star, text: 'A beacon of philanthropy and humanitarian service' },
  ];

  return (
    <section id="mission" className="py-28 relative overflow-hidden bg-slate-950 text-white">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-markaz-blue-deep to-slate-950" />
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #059669 0%, transparent 50%),
                            radial-gradient(circle at 80% 20%, #d97706 0%, transparent 40%),
                            radial-gradient(circle at 60% 80%, #144c77 0%, transparent 50%)`
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-amber-300 text-xs font-bold uppercase tracking-widest mb-4 backdrop-blur-md shadow-xs">
            <Target className="w-3.5 h-3.5" />
            <span>Guiding Principles • ലക്ഷ്യബോധം</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Our Sacred{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400">
              Mission & Vision
            </span>
          </h2>
          <p className="mt-5 text-slate-300 text-base sm:text-lg leading-relaxed font-light max-w-2xl mx-auto">
            For over three decades, Koyyam Markaz has been guided by a timeless spiritual compass — cultivating scholars, servants of society, and custodians of faith.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">

          {/* Mission Card */}
          {mission && (
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-markaz-green to-emerald-400 rounded-3xl blur opacity-15 group-hover:opacity-30 transition-opacity duration-500" />
              <div className="relative bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 h-full flex flex-col hover:bg-white/[0.06] transition-all duration-300">

                {/* Icon header */}
                <div className="flex items-start gap-5 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-markaz-green to-emerald-600 flex items-center justify-center shadow-glow-emerald shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <Compass className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-1">
                      Foundational Purpose • ദൗത്യം
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                      {mission.title}
                    </h3>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-emerald-500/40 via-transparent to-transparent mb-8" />

                {/* Description */}
                <p className="text-slate-200 leading-relaxed text-base sm:text-lg font-light flex-1 mb-8">
                  {mission.description}
                </p>

                {/* Highlights */}
                <div className="space-y-3">
                  {missionHighlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-slate-300 font-light">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
                        <h.icon className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <span>{h.text}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom tag */}
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-amber-300">Est. 1992 — Over 30 years of educational excellence</span>
                </div>
              </div>
            </div>
          )}

          {/* Vision Card */}
          {vision && (
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-amber-400 to-markaz-blue rounded-3xl blur opacity-15 group-hover:opacity-30 transition-opacity duration-500" />
              <div className="relative bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 h-full flex flex-col hover:bg-white/[0.06] transition-all duration-300">

                {/* Icon header */}
                <div className="flex items-start gap-5 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-xl shadow-amber-500/20 shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <Eye className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">
                      The Future We Envision • ദർശനം
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                      {vision.title}
                    </h3>
                  </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-amber-400/40 via-transparent to-transparent mb-8" />

                {/* Description */}
                <p className="text-slate-200 leading-relaxed text-base sm:text-lg font-light flex-1 mb-8">
                  {vision.description}
                </p>

                {/* Highlights */}
                <div className="space-y-3">
                  {visionHighlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-slate-300 font-light">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-400/25 flex items-center justify-center shrink-0">
                        <h.icon className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <span>{h.text}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom tag */}
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-amber-300">Serving Kannur, Kerala & the global Muslim community</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Quranic Quote Banner */}
        <div className="mt-16 relative">
          <div className="relative bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 text-center">
            <p className="text-2xl sm:text-3xl font-arabic text-amber-200 leading-loose mb-3" dir="rtl">
              ﴿ اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ ﴾
            </p>
            <p className="text-slate-200 text-sm sm:text-base font-light italic">
              "Read in the name of your Lord who created" — Surah Al-Alaq 96:1
            </p>
            <p className="text-slate-400 text-xs mt-2 font-light">
              The first divine commandment — the foundation of every educational institution built in the name of Allah
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

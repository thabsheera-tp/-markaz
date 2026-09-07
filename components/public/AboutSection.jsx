'use client';
import React from 'react';
import { Award, BookOpen, Users, Building, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export default function AboutSection({ aboutData }) {
  if (!aboutData) return null;

  const stats = aboutData.stats && aboutData.stats.length > 0 ? aboutData.stats : [
    { label: 'Years of Dedication', value: '30+' },
    { label: 'Students Enrolled', value: '1,250+' },
    { label: 'Graduated Alumni', value: '5,400+' },
    { label: 'Active Institutions', value: '9' }
  ];

  const statIcons = [Award, Users, BookOpen, Building];

  return (
    <section id="about" className="py-20 bg-slate-50 relative overflow-hidden">
      {/* Background Decorative Pattern */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-markaz-green/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-markaz-blue/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual Campus Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-slate-200 border-4 border-white bg-slate-900 group">
              <img
                src={api.getImageUrl(aboutData.image_url || '/uploads/full.jpeg')}
                alt="Koyyam Markaz Campus"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.src = '/uploads/markaz.jpeg';
                }}
                className="w-full aspect-[4/3] sm:aspect-[16/10] lg:h-[450px] object-cover object-bottom sm:object-center transform group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Subtle bottom vignette only on large screens for desktop glass card */}
              <div className="hidden lg:block absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Floating Badge in Image (Desktop only so mobile photo remains 100% visible & clear) */}
              <div className="hidden lg:block absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-lg text-slate-800">
                <p className="text-xs font-semibold text-markaz-green uppercase tracking-wider">Campus Atmosphere</p>
                <p className="text-sm font-bold text-markaz-blue mt-0.5">Spiritual Tranquility & Academic Focus</p>
                <p className="text-xs text-slate-600 mt-1">Providing free boarding, meals, and education to deserving youth.</p>
              </div>
            </div>

            {/* Mobile View: Dedicated clean caption below the photo so image is never covered or dimmed */}
            <div className="lg:hidden mt-3 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs text-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-markaz-green animate-pulse"></span>
                <p className="text-[11px] font-bold text-markaz-green uppercase tracking-wider">Campus Atmosphere</p>
              </div>
              <p className="text-sm font-extrabold text-markaz-blue mt-1">Spiritual Tranquility & Academic Focus</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Providing free boarding, meals, and comprehensive education to deserving youth.</p>
            </div>

            {/* Accent Floating Badge */}
            <div className="hidden sm:flex absolute -top-5 -left-5 bg-markaz-green text-white p-4 rounded-2xl shadow-xl items-center gap-3 border-2 border-white">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg">
                34+
              </div>
              <div>
                <p className="text-xs uppercase font-bold tracking-wider text-emerald-100">Legacy</p>
                <p className="text-sm font-extrabold">Service Since 1992</p>
              </div>
            </div>
          </div>

          {/* Right Column: About Content */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-markaz-green/10 text-markaz-green text-xs font-bold uppercase tracking-wider mb-3">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Our Heritage & Foundations</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-markaz-blue tracking-tight">
                {aboutData.title || 'Markazu Da-wathil Islamiyya, Koyyam'}
              </h2>
            </div>

            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4 text-base sm:text-lg font-light whitespace-pre-line">
              {aboutData.content}
            </div>

            {/* Dynamic Stats Grid */}
            <div className="pt-6 border-t border-slate-200">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map((stat, idx) => {
                  const Icon = statIcons[idx % statIcons.length];
                  return (
                    <div
                      key={idx}
                      className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-markaz-blue-50 text-markaz-blue group-hover:bg-markaz-green group-hover:text-white transition-colors flex items-center justify-center mb-2">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-2xl font-black text-markaz-blue group-hover:text-markaz-green transition-colors">
                        {stat.value}
                      </div>
                      <div className="text-xs font-medium text-slate-500 mt-1">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

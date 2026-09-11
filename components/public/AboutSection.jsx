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
    <section id="about" className="py-24 sm:py-28 bg-slate-50/60 relative overflow-hidden border-b border-slate-100">
      {/* Background Decorative Gradient Blobs */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-[450px] h-[450px] rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-[450px] h-[450px] rounded-full bg-markaz-blue/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual Campus Frame */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Unobstructed Image Frame */}
            <div className="relative rounded-3xl overflow-hidden shadow-card border border-slate-200/80 bg-white group">
              <img
                src={api.getImageUrl(aboutData.image_url || '/uploads/full.jpeg')}
                alt="Koyyam Markaz Campus"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.src = '/uploads/markaz.jpeg';
                }}
                className="w-full h-auto max-h-[460px] object-cover object-center transform group-hover:scale-102 transition-transform duration-700"
              />
            </div>

            {/* Information Card Placed Cleanly Below Photo */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-subtle flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-markaz-green"></span>
                  <span className="text-[11px] font-bold text-markaz-green uppercase tracking-wider">Campus Atmosphere</span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-markaz-blue">Spiritual Tranquility & Academic Focus</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-light">
                  Providing free boarding, meals, and holistic education to deserving students across Kerala.
                </p>
              </div>

              {/* Legacy Badge */}
              <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200/80 px-3.5 py-2 rounded-xl shrink-0">
                <div className="w-8 h-8 rounded-lg bg-markaz-green text-white flex items-center justify-center font-black text-xs shadow-xs">
                  34+
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Legacy</p>
                  <p className="text-xs font-black text-slate-800 whitespace-nowrap">Since 1992</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: About Content */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-markaz-green border border-emerald-200/70 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Our Heritage & Foundations</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-markaz-blue tracking-tight leading-tight">
                {aboutData.title || 'Markazu Da-wathil Islamiyya, Koyyam'}
              </h2>
            </div>

            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4 text-base sm:text-lg font-light whitespace-pre-line">
              {aboutData.content}
            </div>

            {/* Dynamic Stats Grid */}
            <div className="pt-8 border-t border-slate-200/80">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map((stat, idx) => {
                  const Icon = statIcons[idx % statIcons.length];
                  return (
                    <div
                      key={idx}
                      className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/70 shadow-subtle hover:shadow-card hover:-translate-y-0.5 transition-all group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-markaz-blue-50 text-markaz-blue group-hover:bg-markaz-green group-hover:text-white transition-colors flex items-center justify-center mb-3">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="text-2xl font-black text-slate-900 group-hover:text-markaz-green transition-colors tracking-tight">
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

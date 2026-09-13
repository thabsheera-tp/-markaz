'use client';
import React from 'react';
import { BookOpen, GraduationCap, HeartHandshake, ShieldCheck, Target, Eye } from 'lucide-react';

export default function MissionVisionSection({ items = [] }) {
  const fallbackItems = [
    {
      id: 1,
      type: 'mission',
      title: 'Our Sacred Mission',
      description: 'To impart traditional Islamic and contemporary secular education that nurtures spiritual purity, intellectual vigor, moral uprightness, and dedicated leadership for society.',
    },
    {
      id: 2,
      type: 'vision',
      title: 'Our Vision for Tomorrow',
      description: 'To establish a premier center of spiritual enlightenment, academic research, and philanthropic excellence, shaping generations who foster ethical progress and social justice.',
    }
  ];

  const displayItems = items && items.length > 0 ? items : fallbackItems;
  const mission = displayItems.find((i) => i.type === 'mission') || displayItems[0];
  const vision = displayItems.find((i) => i.type === 'vision') || displayItems[1];

  const pillars = [
    {
      icon: BookOpen,
      title: 'Sacred Knowledge',
      desc: 'Preserving authentic Qur-anic memorization, Prophetic Hadith, and Islamic jurisprudence with rigorous classical sanad.'
    },
    {
      icon: GraduationCap,
      title: 'Academic Excellence',
      desc: 'Integrating secondary, higher secondary, and arts/commerce streams to empower youth for contemporary professional horizons.'
    },
    {
      icon: HeartHandshake,
      title: 'Destitute Welfare',
      desc: 'Ensuring 100% free lodging, boarding, healthcare, and education for orphan wards and underprivileged students.'
    },
    {
      icon: ShieldCheck,
      title: 'Moral Leadership',
      desc: 'Instilling ethical responsibility, communal harmony, humility, and steadfast community service.'
    }
  ];

  return (
    <section id="mission" className="w-full max-w-full overflow-hidden py-12 sm:py-20 lg:py-24 bg-[#f8fafc] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (Academic Model) */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#004B87] block mb-1.5 font-sans">
            Guiding Philosophy & Purpose
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-academic font-bold text-[#061726] tracking-tight">
            Institutional Mission & Foundational Pillars
          </h2>
          <div className="w-16 h-1 bg-[#004B87] mx-auto mt-3 sm:mt-4 mb-3 sm:mb-4" />
          <p className="text-slate-600 text-xs sm:text-base font-light leading-relaxed">
            Rooted in timeless spiritual traditions while equipping our students with the skills required to serve society with honor.
          </p>
        </div>

        {/* 4 Clean Academic Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-10 sm:mb-16">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-white p-5 sm:p-7 border border-slate-200 hover:border-[#004B87] shadow-xs hover:shadow-md transition-all duration-300 text-center flex flex-col items-center group rounded-xl sm:rounded-none"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#f1f5f9] text-[#002B49] group-hover:bg-[#002B49] group-hover:text-white transition-colors flex items-center justify-center mb-3 sm:mb-5 border border-slate-200">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#061726] group-hover:text-[#004B87] transition-colors font-academic mb-1.5 sm:mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Dynamic Mission & Vision Statements from Database */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
          {mission && (
            <div className="bg-white p-5 sm:p-8 border-l-4 border-[#004B87] border-y border-r border-slate-200 shadow-xs rounded-xl sm:rounded-none">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <Target className="w-4 h-4 text-[#004B87]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#004B87]">
                  Our Sacred Mission
                </span>
              </div>
              <h4 className="text-lg sm:text-xl font-serif font-bold text-[#061726] font-academic mb-2">
                {mission.title || 'Our Sacred Mission'}
              </h4>
              <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed">
                {mission.description}
              </p>
            </div>
          )}

          {vision && (
            <div className="bg-white p-5 sm:p-8 border-l-4 border-[#d97706] border-y border-r border-slate-200 shadow-xs rounded-xl sm:rounded-none">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <Eye className="w-4 h-4 text-[#d97706]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#d97706]">
                  Our Vision for Tomorrow
                </span>
              </div>
              <h4 className="text-lg sm:text-xl font-serif font-bold text-[#061726] font-academic mb-2">
                {vision.title || 'Our Vision for Tomorrow'}
              </h4>
              <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed">
                {vision.description}
              </p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

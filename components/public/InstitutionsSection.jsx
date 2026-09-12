'use client';
import React, { useState } from 'react';
import { Users, ArrowUpRight, GraduationCap, Heart, Sparkles, BookOpen } from 'lucide-react';
import { api } from '../../services/api';

export default function InstitutionsSection({ institutions = [], onSelectInstitutionForDonate }) {
  const [activeCategory, setActiveCategory] = useState('All');

  // Extract unique categories
  const categories = ['All', ...new Set(institutions.map((i) => i.category).filter(Boolean))];

  const filtered = activeCategory === 'All'
    ? institutions
    : institutions.filter((i) => i.category === activeCategory);

  return (
    <section id="institutions" className="py-20 sm:py-24 bg-[#f8fafc] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Institutional Section Header (Columbia Model) */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#004B87] block mb-2 font-sans">
            Academic & Welfare Divisions
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-academic font-bold text-[#061726] tracking-tight">
            Our 9 Institutions & Educational Wings
          </h2>
          <div className="w-16 h-1 bg-[#004B87] mx-auto mt-4 mb-4" />
          <p className="text-slate-600 text-sm sm:text-base font-light leading-relaxed">
            Spanning classical higher Islamic jurisprudence, Qur-anic memorization, secondary education, women's advanced academies, and full residential welfare care.
          </p>
        </div>

        {/* Category Filter Tabs */}
        {categories.length > 1 && (
          <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all rounded-xs ${
                  activeCategory === cat
                    ? 'bg-[#002B49] text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* The Iconic Columbia 3-Column Photo-Card Gateway Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((inst) => (
            <div
              key={inst.id}
              className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group overflow-hidden"
            >
              {/* Card Photo Frame */}
              <div className="relative h-56 sm:h-60 overflow-hidden bg-slate-100">
                <img
                  src={api.getImageUrl(inst.icon_url || '/uploads/full.jpeg')}
                  alt={inst.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/uploads/full.jpeg';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Category Tag Overlay */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#061726]/80 backdrop-blur-sm text-white border border-white/20">
                    {inst.category || 'Academy'}
                  </span>
                </div>

                {/* Enrollment Badge */}
                {inst.enrollment_count > 0 && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 text-[11px] text-white bg-black/60 backdrop-blur-sm px-2.5 py-0.5 rounded-xs border border-white/10 font-medium">
                    <Users className="w-3 h-3 text-emerald-400" />
                    <span>{inst.enrollment_count} Students</span>
                  </div>
                )}

                {/* Iconic Anchored Bottom Solid-Blue Title Bar (Matching Reference) */}
                <div className="absolute bottom-0 inset-x-0 bg-[#002B49] text-white py-2.5 px-4 flex items-center justify-between group-hover:bg-[#004B87] transition-colors">
                  <span className="text-xs sm:text-sm font-serif font-bold uppercase tracking-wider font-academic truncate">
                    {inst.name}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-blue-200 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>

              {/* Card Body Information */}
              <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed line-clamp-3">
                  {inst.description}
                </p>

                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                    Koyyam Markaz Campus
                  </span>
                  <button
                    onClick={() => onSelectInstitutionForDonate(inst)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#004B87] hover:text-[#d97706] transition-colors"
                    title="Sponsor or donate to this specific institution"
                  >
                    <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                    <span>Sponsor Wing</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footnote on Educational Reach */}
        <div className="mt-12 text-center">
          <p className="text-xs text-slate-500 font-light">
            All institutions operate under the singular spiritual and administrative oversight of Markazu Da-wathil Islamiyya, Koyyam.
          </p>
        </div>

      </div>
    </section>
  );
}

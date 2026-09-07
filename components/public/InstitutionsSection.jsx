'use client';
import React, { useState } from 'react';
import { Building2, Users, ArrowUpRight, GraduationCap, HeartHandshake } from 'lucide-react';
import { api } from '../../services/api';

export default function InstitutionsSection({ institutions = [], onSelectInstitutionForDonate }) {
  const [activeCategory, setActiveCategory] = useState('All');

  // Extract unique categories
  const categories = ['All', ...new Set(institutions.map((i) => i.category).filter(Boolean))];

  const filtered = activeCategory === 'All'
    ? institutions
    : institutions.filter((i) => i.category === activeCategory);

  return (
    <section id="institutions" className="py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-markaz-green/10 text-markaz-green text-xs font-bold uppercase tracking-wider mb-3">
            <GraduationCap className="w-4 h-4" />
            <span>Academic Wings & Welfare Centers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-markaz-blue tracking-tight">
            Our 9 Institutions & Educational Wings
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            From classical theological colleges and Qur-an memorization to modern degree programs, destitute care, and vocational training.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-markaz-blue text-white shadow-md shadow-markaz-blue/20 scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 3x3 Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((inst) => (
            <div
              key={inst.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
            >
              {/* Institution Thumbnail Image */}
              <div className="relative h-52 overflow-hidden bg-slate-100">
                <img
                  src={api.getImageUrl(inst.icon_url || '/uploads/full.jpeg')}
                  alt={inst.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/uploads/full.jpeg';
                  }}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/90 text-markaz-blue backdrop-blur-md shadow-sm">
                    {inst.category}
                  </span>
                </div>

                {/* Enrollment Count Badge */}
                <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs text-white font-medium bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{inst.enrollment_count || 0} Students Enrolled</span>
                </div>
              </div>

              {/* Institution Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-markaz-blue group-hover:text-markaz-green transition-colors leading-snug">
                    {inst.name}
                  </h3>
                  <p className="mt-3 text-slate-600 text-sm leading-relaxed font-light line-clamp-3">
                    {inst.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onSelectInstitutionForDonate(inst)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-markaz-green hover:text-markaz-green-dark transition-colors group-hover:translate-x-1 duration-200"
                  >
                    <HeartHandshake className="w-4 h-4" />
                    <span>Support This Wing</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-medium text-slate-400">
                    Dept #{inst.order_num || inst.id}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

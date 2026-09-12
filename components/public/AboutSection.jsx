'use client';
import React, { useState } from 'react';
import { Award, BookOpen, Users, Building, CheckCircle2, ChevronRight, Compass } from 'lucide-react';
import { api } from '../../services/api';

export default function AboutSection({ aboutData }) {
  const [expanded, setExpanded] = useState(false);

  if (!aboutData) return null;

  const stats = aboutData.stats && aboutData.stats.length > 0 ? aboutData.stats : [
    { label: 'Years of Dedication', value: '34+' },
    { label: 'Students Enrolled', value: '1,250+' },
    { label: 'Graduated Alumni', value: '5,400+' },
    { label: 'Active Institutions', value: '9' }
  ];

  const statIcons = [Award, Users, BookOpen, Building];

  return (
    <section id="about" className="py-20 sm:py-24 bg-white relative border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Columbia Discovery Style Centered Narrative Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#004B87] block mb-2 font-sans">
            Institutional Legacy & Mission
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-academic font-bold text-[#061726] tracking-tight leading-tight">
            {aboutData.title || 'Markazu Da-wathil Islamiyya'}
          </h2>
          <div className="w-20 h-1 bg-[#004B87] mx-auto mt-5 mb-8" />
        </div>

        {/* Narrative Editorial Text */}
        <div className="text-center max-w-3xl mx-auto">
          <div className={`prose prose-slate max-w-none text-slate-700 leading-relaxed text-base sm:text-lg font-light space-y-4 ${
            !expanded ? 'line-clamp-6' : ''
          }`}>
            <p className="whitespace-pre-line">
              {aboutData.content || `Established in 1992 under the auspices of visionary scholars and philanthropists, Markazu Da-wathil Islamiyya in Koyyam, Kannur, has grown from a humble community dars into a renowned educational, spiritual, and charitable nerve-center.

Our guiding mission is to harmonize classical theological scholarship with contemporary academic competence, offering holistic, tuition-free education to hundreds of deserving students, orphan wards, and young community scholars.`}
            </p>
          </div>

          {/* Read More Toggle Button */}
          <div className="mt-8">
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-2 bg-[#002B49] hover:bg-[#004B87] text-white px-8 py-3 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
            >
              <span>{expanded ? 'Show Less' : 'Read Institutional History'}</span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>

        {/* Academic Key Statistics Ribbon (Matching Reference Layout) */}
        <div className="mt-16 pt-12 border-t border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, idx) => {
              const Icon = statIcons[idx % statIcons.length];
              return (
                <div
                  key={idx}
                  className="p-6 bg-[#f8fafc] border border-slate-200 hover:border-[#004B87] transition-all group"
                >
                  <div className="w-10 h-10 rounded bg-[#002B49] text-white flex items-center justify-center mx-auto mb-3 group-hover:bg-[#004B87] transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-serif font-academic font-bold text-[#061726] tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

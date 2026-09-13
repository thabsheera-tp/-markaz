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
    <section id="about" className="w-full max-w-full overflow-hidden py-12 sm:py-20 lg:py-24 bg-white relative border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Columbia Discovery Style Centered Narrative Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#004B87] block mb-1.5 font-sans">
            Institutional Legacy & Mission
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-academic font-bold text-[#061726] tracking-tight leading-tight">
            {aboutData.title || 'Markazu Da-wathil Islamiyya'}
          </h2>
          <div className="w-16 h-1 bg-[#004B87] mx-auto mt-4 mb-6" />
        </div>

        {/* Narrative Editorial Text */}
        <div className="text-center max-w-3xl mx-auto">
          <div className={`prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base lg:text-lg font-light space-y-4 ${
            !expanded ? 'line-clamp-6' : ''
          }`}>
            <p className="whitespace-pre-line">
              {aboutData.content || `Established in 1992 under the auspices of visionary scholars and philanthropists, Markazu Da-wathil Islamiyya in Koyyam, Kannur, has grown from a humble community dars into a renowned educational, spiritual, and charitable nerve-center.

Our guiding mission is to harmonize classical theological scholarship with contemporary academic competence, offering holistic, tuition-free education to hundreds of deserving students, orphan wards, and young community scholars.`}
            </p>
          </div>

          {/* Read More Toggle Button (Touch Friendly) */}
          <div className="mt-6 sm:mt-8 flex justify-center">
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center justify-center gap-2 bg-[#002B49] hover:bg-[#004B87] active:scale-98 text-white px-6 sm:px-8 py-3 text-xs font-bold uppercase tracking-wider transition-all shadow-sm rounded-xl sm:rounded-none min-h-[44px] w-full sm:w-auto"
            >
              <span>{expanded ? 'Show Less' : 'Read Institutional History'}</span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>

        {/* Academic Key Statistics Ribbon */}
        <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-slate-200">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 text-center">
            {stats.map((stat, idx) => {
              const Icon = statIcons[idx % statIcons.length];
              return (
                <div
                  key={idx}
                  className="p-4 sm:p-6 bg-[#f8fafc] border border-slate-200 hover:border-[#004B87] transition-all group rounded-xl sm:rounded-none"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded bg-[#002B49] text-white flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:bg-[#004B87] transition-colors">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="text-xl sm:text-3xl font-serif font-academic font-bold text-[#061726] tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-medium uppercase tracking-wider mt-1 line-clamp-1">
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

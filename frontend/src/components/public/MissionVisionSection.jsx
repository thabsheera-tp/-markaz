import React from 'react';
import { Compass, Eye, Target, Sparkles } from 'lucide-react';

export default function MissionVisionSection({ items = [] }) {
  if (!items || items.length === 0) return null;

  const mission = items.find((i) => i.type === 'mission') || items[0];
  const vision = items.find((i) => i.type === 'vision') || items[1];

  return (
    <section id="mission" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-markaz-blue-50 text-markaz-blue text-xs font-bold uppercase tracking-wider mb-3">
            <Target className="w-3.5 h-3.5 text-markaz-green" />
            <span>Guiding Principles</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-markaz-blue tracking-tight">
            Our Sacred Mission & Vision
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            Guiding thousands toward academic distinction, spiritual fulfillment, and compassionate service to humanity.
          </p>
        </div>

        {/* Two Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Mission Card */}
          {mission && (
            <div className="relative group rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-white to-markaz-green-50/50 border border-markaz-green/20 shadow-xl shadow-slate-100 hover:shadow-2xl hover:shadow-markaz-green/10 hover:-translate-y-1.5 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-markaz-green/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
              
              <div className="w-14 h-14 rounded-2xl bg-markaz-green text-white flex items-center justify-center shadow-lg shadow-markaz-green/30 mb-6">
                <Compass className="w-7 h-7" />
              </div>

              <div className="text-xs font-bold uppercase tracking-widest text-markaz-green mb-1">
                Foundational Purpose
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-markaz-blue mb-4">
                {mission.title}
              </h3>
              <p className="text-slate-600 leading-relaxed text-base sm:text-lg font-light">
                {mission.description}
              </p>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-medium text-markaz-green">
                <Sparkles className="w-4 h-4" />
                <span>Empowering moral, intellectual & spiritual uprightness</span>
              </div>
            </div>
          )}

          {/* Vision Card */}
          {vision && (
            <div className="relative group rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-white to-markaz-blue-50/50 border border-markaz-blue/20 shadow-xl shadow-slate-100 hover:shadow-2xl hover:shadow-markaz-blue/10 hover:-translate-y-1.5 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-markaz-blue/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
              
              <div className="w-14 h-14 rounded-2xl bg-markaz-blue text-white flex items-center justify-center shadow-lg shadow-markaz-blue/30 mb-6">
                <Eye className="w-7 h-7" />
              </div>

              <div className="text-xs font-bold uppercase tracking-widest text-markaz-blue mb-1">
                The Future We Envision
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-markaz-blue mb-4">
                {vision.title}
              </h3>
              <p className="text-slate-600 leading-relaxed text-base sm:text-lg font-light">
                {vision.description}
              </p>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-medium text-markaz-blue">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Building an enlightened, self-reliant global ummah</span>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}

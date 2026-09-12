'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Heart, Sparkles, Compass } from 'lucide-react';
import { api } from '../../services/api';

export default function HeroSlider({ slides = [], onOpenDonate }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!slides || slides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides, isPaused]);

  if (!slides || slides.length === 0) {
    return (
      <section id="hero" className="relative h-[560px] bg-[#072135] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-[#061726]/80" />
        <div className="relative z-10 text-center p-6 max-w-xl">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif tracking-tight font-academic">Markazu Da-wathil Islamiyya</h1>
          <p className="text-slate-300 mt-2 font-light text-sm">Koyyam, Kannur, Kerala • Loading presentation...</p>
        </div>
      </section>
    );
  }

  const slide = slides[current];

  const handleAction = (link) => {
    if (link === '#donate') {
      onOpenDonate();
    } else if (link && link.startsWith('#')) {
      const el = document.querySelector(link);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (link) {
      window.open(link, '_blank');
    }
  };

  return (
    <section
      id="hero"
      className="relative h-[580px] sm:h-[640px] lg:h-[700px] overflow-hidden select-none bg-[#061726]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Slides */}
      {slides.map((s, idx) => (
        <div
          key={s.id || idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Slide Background Image with subtle Ken Burns motion */}
          <img
            src={api.getImageUrl(s.image_url)}
            alt={s.title}
            loading={idx === 0 ? 'eager' : 'lazy'}
            onError={(e) => {
              e.currentTarget.src = '/uploads/markaz.jpeg';
            }}
            className={`w-full h-full object-cover object-center ${
              idx === current ? 'animate-kenburns' : ''
            }`}
          />
          {/* University Style Tint & Scrim */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#061726]/95 via-[#0a2e4a]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061726] via-transparent to-black/30" />
        </div>
      ))}

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl text-white py-12">
          
          {/* Classical Academic Sub-headline */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded bg-[#0a2e4a]/85 border border-white/20 text-xs font-semibold tracking-widest uppercase text-amber-300 mb-5">
            <Compass className="w-3.5 h-3.5 text-amber-300" />
            <span>Center of Islamic Excellence • Est. 1992</span>
          </div>

          {/* Academic Serif Display Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-academic font-bold tracking-tight leading-[1.15] text-white drop-shadow-md">
            {slide?.title}
          </h1>

          {/* Subtitle */}
          <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-slate-200 font-light leading-relaxed max-w-xl">
            {slide?.subtitle}
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            {slide?.button_text && (
              <button
                onClick={() => handleAction(slide.button_link)}
                className="inline-flex items-center gap-2 bg-[#004B87] hover:bg-[#003865] text-white px-6 py-3 rounded font-bold text-xs uppercase tracking-wider shadow-lg transition-all duration-200 hover:-translate-y-0.5 border border-blue-400/30"
              >
                <span>{slide.button_text}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onOpenDonate}
              className="inline-flex items-center gap-2 bg-[#d97706] hover:bg-[#b45309] text-white px-6 py-3 rounded font-bold text-xs uppercase tracking-wider shadow-lg transition-all duration-200 hover:-translate-y-0.5 border border-amber-300/30"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Sadaqah & Giving</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white flex items-center justify-center transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white flex items-center justify-center transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`transition-all duration-300 rounded-full h-1.5 ${
              idx === current ? 'w-8 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

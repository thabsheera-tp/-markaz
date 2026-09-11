'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Heart, Sparkles } from 'lucide-react';
import { api } from '../../services/api';

export default function HeroSlider({ slides = [], onOpenDonate }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!slides || slides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides, isPaused]);

  if (!slides || slides.length === 0) {
    return (
      <section id="hero" className="relative h-[550px] bg-markaz-blue-deep flex items-center justify-center text-white">
        <div className="text-center p-6">
          <h1 className="text-4xl font-black tracking-tight">Koyyam Markaz</h1>
          <p className="text-slate-300 mt-2 font-light">Loading campus presentation...</p>
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
      className="relative h-[640px] md:h-[700px] lg:h-[740px] overflow-hidden select-none bg-slate-950"
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
          {/* Slide Background Image with continuous subtle Ken Burns motion */}
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
          {/* Cinematic Multi-Stop Gradient Scrim */}
          <div className="absolute inset-0 bg-gradient-to-r from-markaz-blue-deep/95 via-markaz-blue/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-black/20" />
        </div>
      ))}

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl text-white py-12">
          {/* Minimal Glass Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold tracking-wider uppercase text-amber-300 mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Markazu Da-wathil Islamiyya</span>
          </div>

          {/* Display Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white drop-shadow-sm">
            {slide?.title}
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg lg:text-xl text-slate-200 font-light leading-relaxed max-w-xl">
            {slide?.subtitle}
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {slide?.button_text && (
              <button
                onClick={() => handleAction(slide.button_link)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-markaz-green to-emerald-600 hover:from-emerald-700 hover:to-markaz-green text-white px-7 py-3.5 rounded-full font-bold text-sm sm:text-base shadow-glow-emerald hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{slide.button_text}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onOpenDonate}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md px-7 py-3.5 rounded-full font-semibold text-sm sm:text-base transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <Heart className="w-4 h-4 text-rose-300 fill-current" />
              <span>Support Koyyam Markaz</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modern Minimal Navigation Arrows */}
      <button
        onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/20 hover:bg-black/50 border border-white/15 backdrop-blur-md text-white/90 hover:text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/20 hover:bg-black/50 border border-white/15 backdrop-blur-md text-white/90 hover:text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicators - Sleek Pill Lines */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`transition-all duration-300 rounded-full h-1.5 ${
              idx === current ? 'w-8 bg-emerald-400' : 'w-2 bg-white/30 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

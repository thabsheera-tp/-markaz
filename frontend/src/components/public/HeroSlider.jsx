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
    }, 4500);

    return () => clearInterval(timer);
  }, [slides, isPaused]);

  if (!slides || slides.length === 0) {
    return (
      <section id="hero" className="relative h-[550px] bg-markaz-blue flex items-center justify-center text-white">
        <div className="text-center p-6">
          <h1 className="text-4xl font-bold">Koyyam Markaz</h1>
          <p className="text-slate-300 mt-2">Loading campus presentation...</p>
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
      className="relative h-[620px] md:h-[680px] lg:h-[720px] overflow-hidden select-none bg-slate-900"
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
          {/* Slide Background Image with subtle continuous live Ken Burns motion */}
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
          {/* Gradient Overlay for high-contrast typography */}
          <div className="absolute inset-0 bg-gradient-to-r from-markaz-blue-dark/95 via-markaz-blue/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-markaz-blue-dark/90 via-transparent to-black/30" />
        </div>
      ))}

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl text-white py-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wider uppercase text-amber-300 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Markazu Da-wathil Islamiyya</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white drop-shadow-md">
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
                className="inline-flex items-center gap-2 bg-markaz-green hover:bg-markaz-green-dark text-white px-7 py-3.5 rounded-xl font-semibold text-base shadow-lg shadow-markaz-green/30 hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                <span>{slide.button_text}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onOpenDonate}
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-md px-6 py-3.5 rounded-xl font-semibold text-base transition-all"
            >
              <Heart className="w-4 h-4 text-rose-400 fill-current" />
              <span>Support Koyyam Markaz</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/30 hover:bg-black/60 border border-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/30 hover:bg-black/60 border border-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === current ? 'w-8 h-2.5 bg-markaz-green' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

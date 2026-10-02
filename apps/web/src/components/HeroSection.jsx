import React, { useState, useEffect } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';

export const HeroSection = () => {
  // Static Tick-Zero Baseline for Immediate LCP Paint
  const [heroData, setHeroData] = useState({
    copy: {
      eyebrow_tag: 'CONCIERGE HEALTH COACHING · CANCER SURVIVORS · AUSTIN, TX',
      headline_prefix: 'Live Beyond',
      headline_italic: 'the Prognosis.',
      subheadline: 'For high-achievers who have cleared active treatment and refuse to wait. Physician guidance and elite coaching on one team — reclaiming vitality after cancer, metabolic syndrome, and serious illness.',
      headline_color: '#ffffff',
      italic_color: '#dc2626',
      subheadline_color: '#3b82f6',
      text_shadow_enabled: true,
    },
    slides: [
      {
        id: 1,
        image_url: '/assets/hero-1.webp',
        overlay_opacity: 0.6,
        overlay_color: '#022C22',
        object_position: 'center 30%',
        display_duration_ms: 6000,
      }
    ],
  });

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Non-Blocking Deferred Hydration from Edge API
  useEffect(() => {
    let isMounted = true;
    const fetchHeroData = async () => {
      try {
        const res = await fetch('/api/hero');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.copy) {
            setHeroData((prev) => ({
              copy: data.copy || prev.copy,
              slides: data.slides && data.slides.length > 0 ? data.slides : prev.slides,
            }));
          }
        }
      } catch (err) {
        console.warn('Using baseline hero settings:', err);
      }
    };

    fetchHeroData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Ambient Slide Rotation Timer
  useEffect(() => {
    if (!heroData.slides || heroData.slides.length <= 1) return;

    const currentSlide = heroData.slides[activeSlideIndex] || heroData.slides[0];
    const duration = currentSlide?.display_duration_ms || 6000;

    const timer = setTimeout(() => {
      setActiveSlideIndex((prev) => (prev + 1) % heroData.slides.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [activeSlideIndex, heroData.slides]);

  const copy = heroData.copy;
  const slides = heroData.slides;

  return (
    <main className="relative w-full min-h-screen bg-slate-950 overflow-hidden flex items-center justify-center">
      {/* Zero-Cost Compositor Rules */}
      <style>{`
        .gpu-slide-layer {
          will-change: opacity;
          backface-visibility: hidden;
          transform: translate3d(0, 0, 0);
        }
      `}</style>

      {/* Background Carousel Canvas */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ contain: 'strict' }}
      >
        {slides.map((slide, idx) => {
          const isActive = idx === activeSlideIndex;

          // Free GPU texture memory completely for hidden slides
          if (!isActive) {
            return null;
          }

          return (
            <div
              key={slide.id || idx}
              className="absolute inset-0 opacity-100 z-10 gpu-slide-layer transition-opacity duration-1000 ease-in-out"
            >
              {/* High-Performance Static Image Layer */}
              <div
                className="w-full h-full bg-cover bg-no-repeat gpu-slide-layer"
                style={{
                  backgroundImage: `url('${slide.image_url}')`,
                  backgroundPosition: slide.object_position || 'center 30%',
                }}
              />

              {/* Dynamic Overlay Darkening */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundColor: slide.overlay_color || '#022C22',
                  opacity: slide.overlay_opacity ?? 0.6,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Hero Text Content Layer */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center md:text-left">
        <div className="space-y-6">
          {/* Eyebrow Tag */}
          {copy.eyebrow_tag && (
            <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-amber-200/90 drop-shadow-sm">
              {copy.eyebrow_tag}
            </p>
          )}

          {/* Headline */}
          <h1
            className={`text-4xl sm:text-6xl lg:text-7xl font-serif font-bold leading-tight tracking-tight ${
              copy.text_shadow_enabled ? 'drop-shadow-lg' : ''
            }`}
          >
            <span style={{ color: copy.headline_color || '#ffffff' }}>
              {copy.headline_prefix}{' '}
            </span>
            <span
              className="italic"
              style={{ color: copy.italic_color || '#dc2626' }}
            >
              {copy.headline_italic}
            </span>
          </h1>

          {/* Subheadline Body */}
          {copy.subheadline && (
            <p
              className={`max-w-2xl text-base sm:text-lg lg:text-xl font-light leading-relaxed ${
                copy.text_shadow_enabled ? 'drop-shadow-md' : ''
              }`}
              style={{ color: copy.subheadline_color || '#3b82f6' }}
            >
              {copy.subheadline}
            </p>
          )}

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
            <a
              href="/apply"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold px-7 py-3.5 rounded-lg text-sm transition-all shadow-lg hover:shadow-amber-500/20"
            >
              <span>Request a Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href="/resources"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-medium px-7 py-3.5 rounded-lg text-sm transition-all border border-slate-700/60"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Explore Our Resources</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HeroSection;

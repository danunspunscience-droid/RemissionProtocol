import React, { useState, useEffect } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';

export const HeroSection = () => {
  const [heroData, setHeroData] = useState({
    copy: null,
    slides: [],
  });
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchHeroData = async () => {
      try {
        const res = await fetch('/api/hero');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setHeroData({
              copy: data.copy || null,
              slides: data.slides || [],
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch hero data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchHeroData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Slide Rotation Timer (Pure state trigger, no requestAnimationFrame loops)
  useEffect(() => {
    if (!heroData.slides || heroData.slides.length <= 1) return;

    const currentSlide = heroData.slides[activeSlideIndex];
    const duration = currentSlide?.display_duration_ms || 6000;

    const timer = setTimeout(() => {
      setActiveSlideIndex((prev) => (prev + 1) % heroData.slides.length);
    }, duration);

    return () => clearTimeout(timer);
  }, [activeSlideIndex, heroData.slides]);

  const copy = heroData.copy || {
    eyebrow_tag: 'CONCIERGE HEALTH COACHING · CANCER SURVIVORS · AUSTIN, TX',
    headline_prefix: 'Live Beyond',
    headline_italic: 'the Prognosis.',
    subheadline: 'For high-achievers who have cleared active treatment and refuse to wait. Physician guidance and elite coaching on one team — reclaiming vitality after cancer, metabolic syndrome, and serious illness.',
    headline_color: '#ffffff',
    italic_color: '#dc2626',
    subheadline_color: '#3b82f6',
    text_shadow_enabled: true,
  };

  const slides = heroData.slides.length > 0 ? heroData.slides : [
    {
      id: 1,
      image_url: '/assets/hero-1.webp',
      overlay_opacity: 0.6,
      overlay_color: '#022C22',
      object_position: 'center 30%',
      ken_burns_mode: 'Zoom In',
      zoom_scale: 1.08,
    }
  ];

  return (
    <div className="relative w-full min-h-screen bg-slate-950 overflow-hidden flex items-center justify-center">
      {/* Zero-Idle Compositor Rules & Reduced Motion Overrides */}
      <style>{`
        @keyframes kenburns-zoom-in {
          0% { transform: scale(1) translate3d(0, 0, 0); }
          100% { transform: scale(1.08) translate3d(0, 0, 0); }
        }
        @keyframes kenburns-zoom-out {
          0% { transform: scale(1.08) translate3d(0, 0, 0); }
          100% { transform: scale(1) translate3d(0, 0, 0); }
        }
        .gpu-slide-active {
          will-change: transform, opacity;
          backface-visibility: hidden;
          transform: translate3d(0, 0, 0);
        }
        .animate-ken-burns-in {
          animation: kenburns-zoom-in 8s ease-out forwards;
        }
        .animate-ken-burns-out {
          animation: kenburns-zoom-out 8s ease-out forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-ken-burns-in, .animate-ken-burns-out {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Background Carousel Canvas (Isolated Compositor Containment) */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ contain: 'strict' }}
      >
        {slides.map((slide, idx) => {
          const isActive = idx === activeSlideIndex;
          const isZoomIn = slide.ken_burns_mode !== 'Zoom Out';

          // Unmount inactive slide layers from GPU texture memory completely
          if (!isActive) {
            return null;
          }

          return (
            <div
              key={slide.id || idx}
              className="absolute inset-0 opacity-100 z-10 gpu-slide-active transition-opacity duration-1000 ease-in-out"
            >
              {/* Image Transform Layer (Active Only) */}
              <div
                className={`w-full h-full bg-cover bg-no-repeat gpu-slide-active ${
                  isZoomIn ? 'animate-ken-burns-in' : 'animate-ken-burns-out'
                }`}
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
    </div>
  );
};

export default HeroSection;

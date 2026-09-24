import React, { useEffect, useState } from 'react';

export function HeroSection() {
  const [heroData, setHeroData] = useState(null);

  useEffect(() => {
    fetch('/api/hero')
      .then((res) => (res.ok? res.json(): Promise.reject('Failed to fetch hero endpoint')))
      .then((data) => setHeroData(data))
      .catch((err) => console.warn('HeroSection fallback active:', err));
  }, []);

  const copy = heroData.copy || {
    Eyebrow: 'CONCIERGE HEALTH COACHING · CANCER SURVIVORS · AUSTIN, TX',
    Headline_prefix: 'Live Beyond',
    Headline_italic: 'the Prognosis.',
    Subheadline: 'For high-achievers who have cleared active treatment and refuse to wait. Physician guidance and elite coaching on one team — reclaiming vitality after cancer, metabolic syndrome, and serious illness. Not disease management. Survivorship excellence.',
    Primary_cta_text: 'Request a Consultation →',
    Primary_cta_url: '/consultation',
    Secondary_cta_text: 'Explore Our Resources',
    Secondary_cta_url: '/resources',
    Bottom_tagline: 'PHYSICIAN-GUIDED · COACH-DELIVERED · BUILT FOR LIFE AFTER TREATMENT',
  };

  const defaultVideo = '/hero-bg.mp4';
  const defaultPoster = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=2070&auto=format&fit=crop';
  const asset = heroData.asset || {
    Asset_url: defaultVideo,
    Poster_url: defaultPoster,
    Media_type: 'video',
    Overlay_opacity: 60,
  };

  const videoSrc = asset.asset_url || defaultVideo;
  const posterSrc = asset.poster_url || defaultPoster;
  const opacityVal = Math.min(Math.max((asset.overlay_opacity? 60) / 100, 0), 1);

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between bg-[#040d0a] text-white overflow-hidden px-6 py-12 sm:px-12 lg:px-20">
      {/* Background Video Loop with Poster Fallback */}
      <video
        AutoPlay
        Loop
        Muted
        PlaysInline
        Poster={posterSrc}
        ClassName="absolute inset-0 w-full h-full object-cover object-center"
      >
        <source src={videoSrc} type="video/mp4" />
        <img src={posterSrc} alt="Hero Background" className="w-full h-full object-cover" />
      </video>

      {/* Editorial Dark Emerald Vignette Overlays */}
      <div
        ClassName="absolute inset-0 bg-gradient-to-t from-[#040d0a] via-[#040d0a]/75 to-[#040d0a]/40 pointer-events-none"
        Style={{ opacity: opacityVal }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#040d0a]/90 via-[#040d0a]/60 to-transparent pointer-events-none" />

      {/* Top Spacer for Navigation Alignment */}
      <div className="relative z-10 h-16 sm:h-24" />

      {/* Main Content Block */}
      <div className="relative z-10 max-w-2xl space-y-6 my-auto">
        {/* Eyebrow Tag */}
        {copy.eyebrow && (
          <p className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] text-slate-300 uppercase font-sans-clean">
            {copy.eyebrow}
          </p>
        )}

        {/* Bespoke Editorial Headline - 2-Line Enforced Layout */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-white leading-[1.05] flex flex-col items-start font-editorial">
          <span>{copy.headline_prefix || 'Live Beyond'}</span>
          <span className="font-editorial italic font-normal text-amber-100/95 whitespace-nowrap mt-1">
            {copy.headline_italic || 'the Prognosis.'}
          </span>
        </h1>

        {/* Subheadline Body */}
        <p className="text-sm sm:text-base text-slate-300/90 max-w-xl font-light leading-relaxed pt-1 font-sans-clean">
          {copy.subheadline}
        </p>

        {/* Dual CTAs */}
        <div className="pt-3 flex flex-wrap items-center gap-4">
          {copy.primary_cta_text && (
            <a
              Href={copy.primary_cta_url || '/consultation'}
              ClassName="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded bg-[#c29b38] hover:bg-[#b08b2e] text-slate-950 transition duration-200 shadow-md font-sans-clean"
            >
              {copy.primary_cta_text}
            </a>
          )}
          {copy.secondary_cta_text && (
            <a
              Href={copy.secondary_cta_url || '/resources'}
              ClassName="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded border border-slate-700/80 bg-slate-950/40 hover:bg-slate-900/60 text-slate-200 transition duration-200 font-sans-clean"
            >
              {copy.secondary_cta_text}
            </a>
          )}
        </div>
      </div>

      {/* Bottom Tagline */}
      {copy.bottom_tagline && (
        <div className="relative z-10 pt-10 border-t border-slate-800/40">
          <p className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase font-sans-clean">
            {copy.bottom_tagline}
          </p>
        </div>
      )}
    </section>
  );
}
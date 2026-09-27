import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import CinematicHero from '../components/CinematicHero';

const FALLBACK_HERO_SCENES = [
  {
    src: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1920',
    position: 'center 30%',
    display_duration_ms: 6000,
    overlay_opacity: 60,
    overlay_color: '#022c22',
    ken_burns_mode: 'zoom-in',
    zoom_scale: 1.08
  }
];

export default function HomePage() {
  const [heroData, setHeroData] = useState({ copy: null, slides: [] });

  useEffect(() => {
    fetch('/api/hero')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setHeroData(data);
      })
      .catch((err) => console.error('Failed to fetch hero settings:', err));
  }, []);

  const copy = heroData.copy || {};
  // Use Nullish Coalescing (??) so intentional empty strings ("") are respected and rendered as blank
  const eyebrowTag = copy.eyebrow_tag ?? 'CONCIERGE HEALTH COACHING · CANCER SURVIVORS · AUSTIN, TX';
  const headlinePrefix = copy.headline_prefix ?? 'Strive Beyond';
  const headlineItalic = copy.headline_italic ?? 'the Diagnosis.';
  const subheadline = copy.subheadline ?? 'For high-achievers who have cleared active treatment and refuse to wait. Physician guidance and elite coaching on one team — reclaiming vitality after cancer, metabolic syndrome, and serious illness. Not disease management. Survivorship excellence.';

  const headlineColor = copy.headline_color || '#ffffff';
  const italicColor = copy.italic_color || '#c5a059';
  const subheadlineColor = copy.subheadline_color || '#a1a1aa';
  const hasShadow = Boolean(copy.text_shadow_enabled ?? 1);

  const activeSlides = heroData.slides && heroData.slides.length > 0
    ? heroData.slides
    : FALLBACK_HERO_SCENES;

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Remission Protocol | Concierge Health Coaching for Cancer Survivors</title>
        <meta name="description" content={subheadline} />
      </Helmet>

      <section className="relative flex min-h-screen flex-col justify-end overflow-hidden pb-16 pt-32 md:pb-24">
        <CinematicHero scenes={activeSlides} />

        <div className={`relative z-30 mx-auto max-w-7xl px-6 lg:px-8 ${hasShadow ? 'drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]' : ''}`}>
          <div className="max-w-3xl">
            {eyebrowTag && (
              <p className="text-xs font-semibold tracking-widest uppercase md:text-sm" style={{ color: italicColor }}>
                {eyebrowTag}
              </p>
            )}
            <h1 className="mt-4 font-display text-4xl font-light md:text-6xl lg:text-7xl" style={{ color: headlineColor }}>
              {headlinePrefix} <span className="italic" style={{ color: italicColor }}>{headlineItalic}</span>
            </h1>
            {subheadline && (
              <p className="mt-6 text-base md:text-lg leading-relaxed" style={{ color: subheadlineColor }}>
                {subheadline}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/consultation"
                className="inline-flex items-center gap-2 rounded-sm bg-brass px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent"
              >
                Request a Consultation &rarr;
              </a>
              <a
                href="/resources"
                className="inline-flex items-center gap-2 rounded-sm border border-border bg-card/40 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition hover:bg-card"
              >
                Explore Our Resources
              </a>
            </div>
          </div>

          <div className="mt-16 border-t border-border/40 pt-6">
            <p className="text-[11px] font-medium tracking-widest text-muted-foreground uppercase">
              PHYSICIAN-GUIDED &middot; COACH-DELIVERED &middot; BUILT FOR LIFE AFTER TREATMENT
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

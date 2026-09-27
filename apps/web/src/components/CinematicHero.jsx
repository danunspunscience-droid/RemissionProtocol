import React, { useState, useEffect, useRef } from 'react';

export default function CinematicHero({ slides = [], fallbackScenes = [] }) {
  const [failedUrls, setFailedUrls] = useState(new Set());

  const validCustomSlides = slides.filter((s) => s.image_url && !failedUrls.has(s.image_url));
  const activeSlides = validCustomSlides.length > 0 ? validCustomSlides : fallbackScenes;

  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  const activeSlide = activeSlides[currentIndex] || activeSlides[0];
  const currentDuration = activeSlide?.display_duration_ms || 6000;

  useEffect(() => {
    if (activeSlides.length <= 1) return;

    timerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, currentDuration);

    return () => clearTimeout(timerRef.current);
  }, [currentIndex, activeSlides.length, currentDuration]);

  const handleImageError = (url) => {
    console.warn(`[CinematicHero] Asset load failed for: ${url}. Falling back to baseline scenes.`);
    setFailedUrls((prev) => new Set(prev).add(url));
  };

  if (!activeSlides.length) return null;

  return (
    <div className="absolute inset-0 overflow-hidden bg-jewel">
      {activeSlides.map((slide, idx) => {
        const isActive = idx === currentIndex;
        const src = slide.image_url || slide.src;
        const pos = slide.object_position || slide.position || 'center 30%';
        const fadeMs = slide.transition_speed_ms || 1200;
        const opacityPct = (slide.overlay_opacity ?? 60) / 100;

        return (
          <div
            key={slide.id || src || idx}
            className="absolute inset-0 transition-opacity ease-in-out will-change-[opacity]"
            style={{
              opacity: isActive ? 1 : 0,
              transitionDuration: `${fadeMs}ms`,
              transform: 'translateZ(0)',
            }}
          >
            <img
              src={src}
              alt="Remission Protocol Hero"
              className={`h-full w-full object-cover select-none transition-transform ease-out ${
                isActive ? 'scale-105 duration-[7000ms]' : 'scale-100 duration-0'
              }`}
              style={{ objectPosition: pos }}
              loading={idx === 0 ? 'eager' : 'lazy'}
              onError={() => slide.image_url && handleImageError(slide.image_url)}
            />
            <div
              className="absolute inset-0 bg-jewel pointer-events-none"
              style={{ opacity: opacityPct }}
            />
          </div>
        );
      })}
      <div className="absolute inset-0 bg-gradient-to-t from-jewel via-jewel/40 to-transparent pointer-events-none" />
    </div>
  );
}

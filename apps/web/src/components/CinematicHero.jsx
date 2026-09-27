import React, { useEffect, useState } from 'react';
import KenBurnsView from './KenBurnsView';

const SCENE_DURATION = 6500;
const TRANSITION = 1400;
const DEFAULT_GRADE = 'contrast(1.18) saturate(0.9) brightness(0.94)';

const normalize = (scene) =>
  typeof scene === 'string'
    ? { src: scene, tilt: 0, position: 'center', grade: DEFAULT_GRADE, mode: 'zoom-in', zoomScale: 1.08, displayDurationMs: SCENE_DURATION, overlayOpacity: 60 }
    : {
        src: scene.src || scene.image_url,
        tilt: scene.tilt || 0,
        position: scene.object_position || scene.position || 'center',
        grade: scene.grade || DEFAULT_GRADE,
        mode: scene.ken_burns_mode || 'zoom-in',
        zoomScale: Number(scene.zoom_scale) || 1.08,
        displayDurationMs: Number(scene.display_duration_ms) || SCENE_DURATION,
        overlayOpacity: scene.overlay_opacity !== undefined ? Number(scene.overlay_opacity) : 60,
      };

export default function CinematicHero({ scenes = [], alt = 'Cinematic hero', className = '' }) {
  const items = scenes.map(normalize);
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(() => items.map(() => false));

  useEffect(() => {
    if (items.length <= 1) return undefined;
    const currentDuration = items[active].displayDurationMs || SCENE_DURATION;
    const id = setTimeout(() => {
      setActive((prev) => (prev + 1) % items.length);
    }, currentDuration);
    return () => clearTimeout(id);
  }, [items.length, active]);

  const markLoaded = (i) =>
    setLoaded((prev) => {
      if (prev[i]) return prev;
      const next = [...prev];
      next[i] = true;
      return next;
    });

  if (!items.length) return null;

  return (
    <div className={`absolute inset-0 overflow-hidden bg-jewel ${className}`} aria-hidden="true">
      {items.map((scene, i) => {
        const isActive = i === active;

        return (
          <div
            key={scene.src || i}
            className="absolute inset-0 transition-opacity ease-out"
            style={{
              opacity: isActive ? 1 : 0,
              transitionDuration: `${TRANSITION}ms`,
              zIndex: isActive ? 10 : 1,
            }}
          >
            <KenBurnsView
              src={scene.src}
              isActive={isActive}
              tilt={scene.tilt}
              position={scene.position}
              grade={scene.grade}
              mode={scene.mode}
              zoomScale={scene.zoomScale}
              durationMs={scene.displayDurationMs}
              onLoad={() => markLoaded(i)}
              isEager={i === 0}
              alt={alt}
            />
            <div
              className="absolute inset-0 pointer-events-none transition-opacity"
              style={{
                backgroundColor: `rgba(0, 0, 0, ${scene.overlayOpacity / 100})`,
              }}
            />
          </div>
        );
      })}

      <div
        className="pointer-events-none absolute inset-0 z-20"
        style={{ boxShadow: 'inset 0 0 200px 50px rgba(0,0,0,0.55)' }}
      />

      <noscript>
        <img
          src={items[0].src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </noscript>
    </div>
  );
}

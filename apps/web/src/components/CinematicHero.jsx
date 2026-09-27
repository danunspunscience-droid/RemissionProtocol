import React, { useEffect, useState } from 'react';
import KenBurnsView from './KenBurnsView';

const SCENE_DURATION = 6500;
const TRANSITION = 1400;
const DEFAULT_GRADE = 'contrast(1.18) saturate(0.9) brightness(0.94)';

const normalize = (scene) =>
  typeof scene === 'string'
    ? { src: scene, tilt: 0, position: 'center', grade: DEFAULT_GRADE, mode: 'zoom-in', zoomScale: 1.08, displayDurationMs: SCENE_DURATION }
    : {
        Src: scene.src || scene.image_url,
        Tilt: scene.tilt || 0,
        Position: scene.object_position || scene.position || 'center',
        Grade: scene.grade || DEFAULT_GRADE,
        Mode: scene.ken_burns_mode || 'zoom-in',
        ZoomScale: Number(scene.zoom_scale) || 1.08,
        DisplayDurationMs: Number(scene.display_duration_ms) || SCENE_DURATION,
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
              opacity: isActive && loaded[i] ? 1 : 0,
              transitionDuration: `${TRANSITION}ms`,
            }}
          >
            <KenBurnsView
              Src={scene.src}
              IsActive={isActive}
              Tilt={scene.tilt}
              Position={scene.position}
              Grade={scene.grade}
              Mode={scene.mode}
              ZoomScale={scene.zoomScale}
              DurationMs={scene.displayDurationMs}
              OnLoad={() => markLoaded(i)}
              IsEager={i === 0}
              Alt={alt}
            />
          </div>
        );
      })}

      <div
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: 'inset 0 0 200px 50px rgba(0,0,0,0.55)' }}
      />

      <noscript>
        <img
          Src={items[0].src}
          Alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </noscript>
    </div>
  );
}
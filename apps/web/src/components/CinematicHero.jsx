import React, { useEffect, useState } from 'react';

/**
 * CinematicHero
 * A looping "video-like" hero background built from a sequence of cinematic
 * stills. Each scene crossfades in with a slow Ken Burns zoom, holds, then
 * crossfades to the next — looping seamlessly.
 *
 * Each scene can encode professional cinematography techniques:
 *   - `tilt`    : Dutch-angle rotation in degrees (15–30) for visual drama.
 *   - `position`: object-position to reinforce low-angle framing
 *                 (e.g. "center 25%" lifts the subject for an upward feel).
 *   - `grade`   : per-scene CSS filter override (default is a low-key,
 *                 high-contrast cinematic LUT approximation).
 *
 * Lightweight (no video file), non-blocking (only the first image is eager;
 * the rest preload lazily), mobile responsive, and honors
 * prefers-reduced-motion. A real MP4 uploaded via /admin still overrides
 * this as the live hero.
 *
 * Scenes may be passed as plain URL strings (backwards compatible) or as
 * objects: { src, tilt, position, grade }.
 */
const SCENE_DURATION = 6500; // ms each scene is visible (6–8s feel)
const TRANSITION = 1400; // ms crossfade

// Low-key, high-contrast cinematic grade approximation (cinematic LUT feel).
const DEFAULT_GRADE = 'contrast(1.18) saturate(0.9) brightness(0.94)';

const normalize = (scene, i) =>
    typeof scene === 'string'
        ? { src: scene, tilt: 0, position: 'center', grade: DEFAULT_GRADE }
        : {
              src: scene.src,
              tilt: scene.tilt || 0,
              position: scene.position || 'center',
              grade: scene.grade || DEFAULT_GRADE,
          };

const CinematicHero = ({ scenes = [], alt = 'Cinematic hero', className = '' }) => {
    const items = scenes.map(normalize);
    const [active, setActive] = useState(0);
    const [loaded, setLoaded] = useState(() => items.map(() => false));

    useEffect(() => {
        if (items.length <= 1) return undefined;
        const id = setInterval(
            () => setActive((prev) => (prev + 1) % items.length),
            SCENE_DURATION,
        );
        return () => clearInterval(id);
    }, [items.length]);

    const markLoaded = (i) =>
        setLoaded((prev) => {
            if (prev[i]) return prev;
            const next = prev.slice();
            next[i] = true;
            return next;
        });

    if (!items.length) return null;

    return (
        <div className={`absolute inset-0 overflow-hidden bg-jewel ${className}`} aria-hidden="true">
            {items.map((scene, i) => {
                const isActive = i === active;
                const tilt = scene.tilt;
                // Over-scale rotated frames so the Dutch angle never reveals edges.
                const coverScale = tilt ? 1.4 : 1;
                return (
                    <div
                        key={scene.src}
                        className="absolute inset-0 transition-opacity ease-out"
                        style={{
                            opacity: isActive && loaded[i] ? 1 : 0,
                            transitionDuration: `${TRANSITION}ms`,
                        }}
                    >
                        <div
                            className="absolute inset-0"
                            style={{
                                transform: `rotate(${tilt}deg) scale(${coverScale})`,
                                transformOrigin: 'center center',
                            }}
                        >
                            <img
                                src={scene.src}
                                alt=""
                                onLoad={() => markLoaded(i)}
                                // First image eager for LCP; the rest lazy / non-blocking.
                                {...(i === 0
                                    ? { loading: 'eager', fetchpriority: 'high' }
                                    : { loading: 'lazy' })}
                                decoding="async"
                                className={`absolute inset-0 h-full w-full object-cover ${
                                    isActive ? 'hero-ken-burns' : ''
                                }`}
                                style={{
                                    objectPosition: scene.position,
                                    filter: scene.grade,
                                }}
                            />
                        </div>
                    </div>
                );
            })}

            {/* Cinematic vignette + grade overlay for low-key depth. */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{ boxShadow: 'inset 0 0 200px 50px rgba(0,0,0,0.55)' }}
            />

            {/* Static fallback if JS is disabled: first scene as a plain image. */}
            <noscript>
                <img
                    src={items[0].src}
                    alt={alt}
                    className="absolute inset-0 h-full w-full object-cover"
                />
            </noscript>
        </div>
    );
};

export default CinematicHero;

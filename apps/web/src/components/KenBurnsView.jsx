import React, { useState, useEffect } from 'react';

export default function KenBurnsView({
  Src,
  IsActive = false,
  Tilt = 0,
  Position = 'center',
  Grade = 'contrast(1.18) saturate(0.9) brightness(0.94)',
  Mode = 'zoom-in',
  ZoomScale = 1.08,
  DurationMs = 6500,
  OnLoad,
  IsEager = false,
  Alt = '',
  ClassName = ''
}) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isActive) {
      setAnimating(false);
      const rafId = requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimating(true));
      });
      return () => cancelAnimationFrame(rafId);
    } else {
      setAnimating(false);
    }
  }, [isActive]);

  const coverScale = tilt ? 1.4 : 1;

  let initialScale = 1;
  let targetScale = zoomScale;

  if (mode === 'zoom-out') {
    initialScale = zoomScale;
    targetScale = 1;
  } else if (mode === 'none') {
    initialScale = 1;
    targetScale = 1;
  }

  const currentScale = animating ? targetScale : initialScale;

  return (
    <div
      className={`absolute inset-0 ${className}`}
      style={{
        transform: `rotate(${tilt}deg) scale(${coverScale})`,
        transformOrigin: 'center center',
      }}
    >
      <img
        src={src}
        alt={alt}
        onLoad={onLoad}
        loading={isEager ? 'eager' : 'lazy'}
        {...(isEager ? { fetchpriority: 'high' } : {})}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          objectPosition: position,
          filter: grade,
          transform: `scale3d(${currentScale}, ${currentScale}, 1)`,
          transition: animating && mode !== 'none' ? `transform ${durationMs}ms cubic-bezier(0.25, 1, 0.5, 1)` : 'none',
          willChange: 'transform',
        }}
      />
    </div>
  );
}
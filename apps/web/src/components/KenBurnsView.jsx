import React from 'react';

/**
 * KenBurnsView
 * Standalone, reusable cinematic pan/zoom image wrapper.
 * Supports Dutch-angle tilt rotation, over-scaling to prevent corner clipping,
 * object-positioning, custom filter grading, and eager/lazy LCP controls.
 */
export default function KenBurnsView({
  src,
  isActive = false,
  tilt = 0,
  position = 'center',
  grade = 'contrast(1.18) saturate(0.9) brightness(0.94)',
  onLoad,
  isEager = false,
  alt = '',
  className = ''
}) {
  const coverScale = tilt ? 1.4 : 1;

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
        {...(isEager ? { fetchPriority: 'high' } : {})}
        decoding="async"
        className={`absolute inset-0 h-full w-full object-cover transition-transform ${
          isActive ? 'hero-ken-burns' : ''
        }`}
        style={{
          objectPosition: position,
          filter: grade,
        }}
      />
    </div>
  );
}

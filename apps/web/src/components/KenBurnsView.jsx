import React, { useState, useEffect, useRef } from 'react';

export default function KenBurnsView({
  src,
  isActive = false,
  tilt = 0,
  position = 'center',
  grade = 'contrast(1.18) saturate(0.9) brightness(0.94)',
  mode = 'zoom-in',
  zoomScale = 1.08,
  durationMs = 6500,
  onLoad,
  isEager = false,
  alt = '',
  className = ''
}) {
  const [animating, setAnimating] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      if (onLoad) onLoad();
    }
  }, [src, onLoad]);

  useEffect(() => {
    if (isActive) {
      setAnimating(false);
      if (imgRef.current) {
        void imgRef.current.offsetHeight;
      }
      const timer = setTimeout(() => setAnimating(true), 40);
      return () => clearTimeout(timer);
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
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={onLoad}
        loading={isEager ? 'eager' : 'lazy'}
        {...(isEager ? { fetchPriority: 'high' } : {})}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          objectPosition: position,
          filter: grade,
          transform: `scale3d(${currentScale}, ${currentScale}, 1)`,
          transition: animating && mode !== 'none'
            ? `transform ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1)`
            : 'none',
          willChange: 'transform',
        }}
      />
    </div>
  );
}

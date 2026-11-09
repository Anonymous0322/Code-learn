'use client';

import { useEffect, useState } from 'react';

interface AnimatedNumberProps {
  value: number | string;
  locale?: string;
}

export function AnimatedNumber({ value, locale }: AnimatedNumberProps) {
  const numericValue = typeof value === 'number'
    ? value
    : /^\d+$/.test(value) ? Number(value) : null;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (numericValue === null || !Number.isFinite(numericValue) || numericValue < 0) return;

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionPreference.matches) {
      setDisplayValue(numericValue);
      return;
    }

    let frameId = 0;
    let startTime: number | null = null;
    const duration = 1000;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = 1 - (1 - progress) ** 4;
      setDisplayValue(Math.round(numericValue * easedProgress));
      if (progress < 1) frameId = window.requestAnimationFrame(animate);
    };

    setDisplayValue(0);
    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [numericValue]);

  if (numericValue === null || !Number.isFinite(numericValue) || numericValue < 0) {
    return <>{value}</>;
  }

  const formattedValue = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(displayValue);
  const accessibleValue = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(numericValue);
  return <span aria-label={accessibleValue} aria-live="off">{formattedValue}</span>;
}

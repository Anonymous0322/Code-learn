export const COLORS = {
  neon: {
    blue: '#00d4ff',
    cyan: '#00e5ff',
    purple: '#a855f7',
    pink: '#ec4899',
    green: '#22c55e',
    orange: '#f97316',
    yellow: '#eab308',
    red: '#ef4444',
  },
  dark: {
    950: '#0a0a1a',
    900: '#0f0f23',
    800: '#1a1a3e',
    700: '#252550',
    600: '#333366',
  },
} as const;

export const GRADIENTS = {
  neon: 'linear-gradient(135deg, #00d4ff 0%, #a855f7 100%)',
  neonSmooth: 'linear-gradient(135deg, #00e5ff 0%, #00d4ff 50%, #a855f7 100%)',
  dark: 'linear-gradient(180deg, #0a0a1a 0%, #0f0f23 100%)',
  card: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
} as const;

export const SHADOWS = {
  neon: '0 0 5px #00d4ff, 0 0 10px #00d4ff, 0 0 20px #00d4ff',
  neonSm: '0 0 3px #00d4ff, 0 0 6px #00d4ff',
  purple: '0 0 5px #a855f7, 0 0 10px #a855f7',
  glow: '0 4px 20px rgba(0, 212, 255, 0.15)',
  card: '0 4px 30px rgba(0, 0, 0, 0.3)',
} as const;

export const FONT_SIZES = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
  '6xl': '3.75rem',
  '7xl': '4.5rem',
} as const;

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

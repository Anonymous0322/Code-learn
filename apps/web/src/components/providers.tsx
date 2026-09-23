'use client';

import { useState, createContext, ReactNode } from 'react';

export const ThemeContext = createContext<{
  theme: string;
  toggleTheme: () => void;
  language: string;
  setLanguage: (lang: string) => void;
}>({
  theme: 'dark',
  toggleTheme: () => {},
  language: 'en',
  setLanguage: () => {},
});

export function Providers({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(t => t === 'dark' ? 'light' : 'dark'), language, setLanguage }}>
      {children}
    </ThemeContext.Provider>
  );
}

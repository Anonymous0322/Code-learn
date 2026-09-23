'use client';

import { useState, createContext, useContext, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 5 * 60 * 1000, retry: 1 },
    },
  }));
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme(t => t === 'dark' ? 'light' : 'dark'), language, setLanguage }}>
      <QueryClientProvider client={queryClient}>
        <div className={theme === 'dark' ? '' : 'light'}>
          {children}
        </div>
      </QueryClientProvider>
    </ThemeContext.Provider>
  );
}

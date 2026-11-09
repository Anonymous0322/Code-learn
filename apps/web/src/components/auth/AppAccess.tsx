'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Footer } from '@/components/layout/Footer';
import { Navigation } from '@/components/layout/Navigation';
import { useAuthStore } from '@/store/authStore';

function isAuthRoute(pathname: string) {
  return pathname === '/auth' || pathname.startsWith('/auth/');
}

function AccessLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050711]" aria-label="Loading">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400" />
    </main>
  );
}

export function AppAccess({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const currentUser = useAuthStore(state => state.currentUser);
  const initialized = useAuthStore(state => state.initialized);
  const authRoute = isAuthRoute(pathname);

  useEffect(() => {
    if (!initialized || currentUser || authRoute) return;
    const next = `${window.location.pathname}${window.location.search}`;
    router.replace(`/auth/login?next=${encodeURIComponent(next)}`);
  }, [authRoute, currentUser, initialized, pathname, router]);

  if (authRoute) {
    return <main className="min-h-screen">{children}</main>;
  }

  if (!initialized || !currentUser) {
    return <AccessLoading />;
  }

  return (
    <>
      <Navigation />
      <main>{children}</main>
      <Footer />
    </>
  );
}

'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Footer } from '@/components/layout/Footer';
import { Navigation } from '@/components/layout/Navigation';
import { useAuthStore } from '@/store/authStore';

function isPublicRoute(pathname: string) {
  return pathname === '/auth'
    || pathname.startsWith('/auth/')
    || pathname === '/'
    || pathname === '/about'
    || pathname === '/faq'
    || pathname === '/privacy'
    || pathname === '/terms'
    || pathname === '/courses'
    || pathname.startsWith('/courses/');
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
  const publicRoute = isPublicRoute(pathname);
  const authRoute = pathname === '/auth' || pathname.startsWith('/auth/');
  const showFooter = pathname === '/';

  useEffect(() => {
    if (!initialized || currentUser || publicRoute) return;
    const next = `${window.location.pathname}${window.location.search}`;
    router.replace(`/auth/login?next=${encodeURIComponent(next)}`);
  }, [currentUser, initialized, pathname, publicRoute, router]);

  if (authRoute) {
    return <main className="min-h-screen">{children}</main>;
  }

  if (publicRoute) {
    return (
      <>
        <Navigation />
        <main>{children}</main>
        {showFooter && <Footer />}
      </>
    );
  }

  if (!initialized || !currentUser) {
    return <AccessLoading />;
  }

  return (
    <>
      <Navigation />
      <main>{children}</main>
      {showFooter && <Footer />}
    </>
  );
}

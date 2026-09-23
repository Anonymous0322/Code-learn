import { Suspense } from 'react';
import { Loading } from '@/components/ui/Loading';
import { HeroSection } from '@/components/page/HeroSection';
import { FeatureSection } from '@/components/page/FeatureSection';
import { LanguageCards } from '@/components/page/LanguageCards';
import { HowItWorks } from '@/components/page/HowItWorks';
import { StatsSection } from '@/components/page/StatsSection';
import { CTASection } from '@/components/page/CTASection';
import { Footer } from '@/components/layout/Footer';

export default async function Home() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<Loading />}>
        <HeroSection />
        <StatsSection />
        <LanguageCards />
        <FeatureSection />
        <HowItWorks />
        <CTASection />
      </Suspense>
      <Footer />
    </main>
  );
}

'use client';

import { HeroSection } from '@/components/page/HeroSection';
import { LanguageCards } from '@/components/page/LanguageCards';
import { StatsSection } from '@/components/page/StatsSection';
import { FeatureSection } from '@/components/page/FeatureSection';
import { useI18n } from '@/components/providers';
import { useCourseStore } from '@/store/courseStore';

export default function HomePage() {
  const { t } = useI18n();
  const courses = useCourseStore(state => state.courses).filter(course => course.isActive);

  const localizedCourses = courses.map((course) => {
    return {
      label: course.title,
      desc: course.description,
      iconPath: course.iconUrl || `/images/logos/${course.languageCode}.svg`,
      slug: course.slug,
    };
  });

  const features = [
    { icon: 'lesson', title: t('featureLessonTitle'), description: t('featureLessonText') },
    { icon: 'practice', title: t('featurePracticeTitle'), description: t('featurePracticeText') },
    { icon: 'language', title: t('featureLanguageTitle'), description: t('featureLanguageText') },
  ];

  const stats = [
    { label: t('statsCourses'), value: String(courses.length), icon: 'courses' },
    { label: t('statsLessons'), value: String(courses.reduce((count, course) => count + (course.levels?.length || 0), 0)), icon: 'lessons' },
  ];

  const steps = [
    { number: 1, title: t('stepChooseTitle'), description: t('stepChooseText') },
    { number: 2, title: t('stepStartTitle'), description: t('stepStartText') },
    { number: 3, title: t('stepLearnTitle'), description: t('stepLearnText') },
    { number: 4, title: t('stepBuildTitle'), description: t('stepBuildText') },
  ];

  return (
    <div>
      <HeroSection
        title="Learn to Code. From Zero to Developer."
        subtitle="Master programming from absolute zero. Interactive lessons, real-time code practice, and progress tracking — all in your language."
        ctaText="Start Learning"
        ctaLink="/courses"
      />

      <section id="languages" className="relative border-b border-white/10 py-10 sm:py-12">
        <div className="mx-auto max-w-[1220px] px-4 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div><p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">{t('basics')}</p><h2 className="font-[Space_Grotesk] text-xl font-semibold text-white sm:text-2xl">{t('choose')}</h2></div>
            <a href="/courses" className="hidden text-xs font-semibold text-slate-400 transition-colors hover:text-white sm:block">{t('viewAll')} →</a>
          </div>
          <LanguageCards languages={localizedCourses} />
        </div>
      </section>

      <section id="roadmap" className="py-14 bg-bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-text-primary mb-12 text-center gradient-text">{t('why')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <FeatureSection key={i} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-text-primary mb-12 text-center gradient-text">{t('byTheNumbers')}</h2>
          <StatsSection stats={stats} />
        </div>
      </section>

      <section className="py-14 bg-bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-text-primary mb-12 text-center gradient-text">{t('howItWorks')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.number} className="text-center animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">{step.title}</h3>
                <p className="text-sm text-text-secondary">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

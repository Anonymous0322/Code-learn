'use client';

import { useEffect, useState } from 'react';
import { HeroSection } from '@/components/page/HeroSection';
import { LanguageCards } from '@/components/page/LanguageCards';
import { StatsSection } from '@/components/page/StatsSection';
import { FeatureSection } from '@/components/page/FeatureSection';
import { useI18n } from '@/components/providers';
import { useCourseStore } from '@/store/courseStore';
import { getSupabase } from '@/lib/supabase';

export default function HomePage() {
  const { t, tr, language } = useI18n();
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [membersLive, setMembersLive] = useState(false);
  const [memberCountError, setMemberCountError] = useState('');
  const courses = useCourseStore(state => state.courses).filter(course => course.isActive);

  useEffect(() => {
    let cancelled = false;
    let receivedRealtimeUpdate = false;
    const supabase = getSupabase();
    const channel = supabase
      .channel('public:project-members')
      .on('broadcast', { event: 'member_count_updated' }, ({ payload }) => {
        const count = Number(payload?.count);
        if (!Number.isSafeInteger(count) || count < 0) return;
        receivedRealtimeUpdate = true;
        setMemberCount(count);
        setMemberCountError('');
      })
      .subscribe(status => {
        if (cancelled) return;
        if (status === 'SUBSCRIBED') {
          setMembersLive(true);
          setMemberCountError('');
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setMembersLive(false);
          setMemberCountError(tr('Realtime ulanişida xatolik.', 'Ошибка подключения к обновлениям в реальном времени.', 'Realtime connection failed.'));
          console.error('Loyiha a’zolari soni uchun realtime kanaliga ulanib bo‘lmadi.', status);
        } else if (status === 'CLOSED') {
          setMembersLive(false);
        }
      });

    void Promise.resolve(supabase.rpc('get_project_member_count')).then(({ data, error }) => {
      if (error) throw error;
      const count = Number(data);
      if (!Number.isSafeInteger(count) || count < 0) {
        throw new Error('Supabase loyiha a’zolari sonini noto‘g‘ri qaytardi.');
      }
      if (!cancelled && !receivedRealtimeUpdate) setMemberCount(count);
    }).catch(error => {
      if (cancelled) return;
      setMemberCountError(tr('A’zolar sonini yuklab bölmadi.', 'Не удалось загрузить число участников.', 'Could not load the member count.'));
      console.error('Loyiha a’zolari sonini yuklab bo‘lmadi.', error);
    });

    return () => {
      cancelled = true;
      void supabase.removeChannel(channel);
    };
  }, [tr]);

  const localizedCourses = courses.map((course) => {
    return {
      label: course.translations?.[language]?.title || course.title,
      desc: course.translations?.[language]?.description || course.description,
      iconPath: course.iconUrl || `/images/logos/${course.languageCode}.svg`,
      slug: course.slug,
    };
  });

  const features = [
    { icon: 'lesson', title: t('featureLessonTitle'), description: t('featureLessonText') },
    { icon: 'practice', title: t('featurePracticeTitle'), description: t('featurePracticeText') },
    { icon: 'progress', title: t('featureProgressTitle'), description: t('featureProgressText') },
    { icon: 'community', title: t('featureCommunityTitle'), description: t('featureCommunityText') },
  ];

  const stats = [
    { label: t('statsCourses'), value: String(courses.length), icon: 'courses' },
    { label: t('statsLessons'), value: String(courses.reduce((count, course) => count + (course.levels?.length || 0), 0)), icon: 'lessons' },
    {
      label: t('statsMembers'),
      value: memberCount === null ? '—' : String(memberCount),
      icon: 'learners',
      statusLabel: membersLive ? tr('Jonli', 'В реальном времени', 'Live') : tr('Ulanmoqda…', 'Подключение…', 'Connecting…'),
      statusError: memberCountError,
    },
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
              <div
                key={step.number}
                className="group relative rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-6 text-center transition-all duration-300 hover:-translate-y-2 hover:border-neon-blue/30 hover:bg-white/[0.05] hover:shadow-[0_16px_40px_rgba(59,130,246,0.12)] animate-fade-in motion-reduce:transform-none motion-reduce:transition-none"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-neon-blue to-neon-purple text-2xl font-bold text-white shadow-[0_8px_24px_rgba(99,102,241,0.35)] ring-4 ring-indigo-400/10 transition duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:ring-indigo-400/25 motion-reduce:transition-none">
                  <span className="absolute inset-[-5px] rounded-full border border-indigo-300/20 transition duration-300 group-hover:inset-[-8px] group-hover:border-indigo-300/45 motion-reduce:transition-none" />
                  {step.number}
                </div>
                <h3 className="mb-2 text-lg font-bold text-text-primary transition-colors group-hover:text-white">{step.title}</h3>
                <p className="text-sm text-text-secondary">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

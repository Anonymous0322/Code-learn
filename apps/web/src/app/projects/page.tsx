'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '@/components/providers';
import { useAuthStore } from '@/store/authStore';
import { ProjectProgress, useProjectProgressStore } from '@/store/projectProgressStore';

interface GuidedProject {
  id: string;
  title: string;
  level: string;
  description: string;
  goal: string;
  steps: string[];
  starterCode: string;
}

const projects: GuidedProject[] = [
  {
    id: 'personal-portfolio',
    title: 'Shaxsiy portfolio sahifasi',
    level: 'Boshlang‘ich · HTML',
    description: 'O‘zingiz haqingizda ma’lumot, ko‘nikmalar va loyihalar bo‘limiga ega portfolio yarating.',
    goal: 'Semantik HTML elementlaridan foydalanib, o‘zingizni tanishtiradigan sahifa tuzing.',
    steps: [
      'Sahifaga ismingiz va kasbingiz yozilgan asosiy sarlavha qo‘shing.',
      'O‘zingiz haqingizda qisqa paragraf yozing.',
      'Ko‘nikmalaringiz uchun tartibli ro‘yxat yarating.',
      'Bog‘lanish uchun email yoki havola qo‘shing.',
    ],
    starterCode: '<main class="card">\n  <h1>Ism Familiya</h1>\n  <p>Men web dasturlashni o‘rganyapman.</p>\n  <h2>Ko‘nikmalarim</h2>\n  <ul>\n    <li>HTML</li>\n    <li>CSS</li>\n  </ul>\n  <a href="mailto:salom@example.com">Men bilan bog‘lanish</a>\n</main>\n<style>\n  body { font-family: system-ui; background: #eef2ff; padding: 32px; }\n  .card { max-width: 560px; margin: auto; padding: 32px; background: white; border-radius: 16px; }\n</style>',
  },
  {
    id: 'product-landing',
    title: 'Mahsulot landing sahifasi',
    level: 'O‘rta · HTML + CSS',
    description: 'Mahsulotni tanishtiruvchi, chaqiriq tugmasi va moslashuvchan dizaynga ega sahifa yarating.',
    goal: 'Sarlavha, foyda kartalari va ko‘zga tashlanadigan tugma bilan chiroyli landing sahifa tayyorlang.',
    steps: [
      'Mahsulot nomi va foydasini tushuntiruvchi sarlavha yozing.',
      'Kamida uchta asosiy afzallikni kartalarda ko‘rsating.',
      'Asosiy chaqiriq tugmasini qo‘shing.',
      'CSS bilan ranglar, masofalar va mobil ko‘rinishni sozlang.',
    ],
    starterCode: '<main class="landing">\n  <p class="eyebrow">YANGI AVLOD ILOVASI</p>\n  <h1>Vaqtingizni foydali boshqaring</h1>\n  <p class="intro">Rejalaringizni bir joyda tartibga soling.</p>\n  <section class="features">\n    <article><h2>Oddiy</h2><p>Foydalanish oson.</p></article>\n    <article><h2>Tezkor</h2><p>Rejalar doim yoningizda.</p></article>\n    <article><h2>Qulay</h2><p>Natijangizni kuzating.</p></article>\n  </section>\n  <button>Boshlash</button>\n</main>\n<style>\n  * { box-sizing: border-box; }\n  body { margin: 0; padding: 32px; font-family: system-ui; background: #0f172a; color: white; }\n  .landing { max-width: 850px; margin: 30px auto; text-align: center; }\n  .eyebrow { color: #67e8f9; letter-spacing: .15em; }\n  h1 { font-size: clamp(2rem, 6vw, 4rem); }\n  .intro { color: #cbd5e1; }\n  .features { display: grid; grid-template-columns: repeat(auto-fit,minmax(160px,1fr)); gap: 12px; margin: 32px 0; }\n  article { padding: 18px; border: 1px solid #334155; border-radius: 14px; }\n  button { padding: 12px 24px; border: 0; border-radius: 999px; background: #22d3ee; font-weight: bold; }\n</style>',
  },
  {
    id: 'click-counter',
    title: 'Interaktiv hisoblagich',
    level: 'O‘rta · JavaScript',
    description: 'Tugmalar orqali qiymatni oshirish, kamaytirish va qayta boshlash mumkin bo‘lgan hisoblagich yarating.',
    goal: 'JavaScript hodisalari va DOM orqali sahifadagi qiymatni boshqaring.',
    steps: [
      'Hisoblagich qiymatini ko‘rsatadigan element yarating.',
      'Qiymatni oshirish va kamaytirish tugmalarini qo‘shing.',
      'Tugmalarga click hodisasi orqali JavaScript ulang.',
      'Qiymatni nolga qaytaradigan tugma qo‘shing.',
    ],
    starterCode: '<main class="counter">\n  <h1>Hisoblagich</h1>\n  <p id="value">0</p>\n  <button id="minus">−</button>\n  <button id="plus">+</button>\n  <button id="reset">Qayta boshlash</button>\n</main>\n<style>\n  body { font-family: system-ui; display: grid; min-height: 90vh; place-items: center; background: #eef2ff; }\n  .counter { text-align: center; padding: 32px; background: white; border-radius: 18px; }\n  #value { font-size: 48px; font-weight: bold; }\n  button { padding: 10px 16px; margin: 4px; cursor: pointer; }\n</style>\n<script>\n  let count = 0;\n  const value = document.querySelector("#value");\n  document.querySelector("#plus").addEventListener("click", () => {\n    count += 1;\n    value.textContent = count;\n  });\n  document.querySelector("#minus").addEventListener("click", () => {\n    count -= 1;\n    value.textContent = count;\n  });\n  document.querySelector("#reset").addEventListener("click", () => {\n    count = 0;\n    value.textContent = count;\n  });\n</script>',
  },
];

function createPreview(code: string) {
  const policy = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'none'; form-action 'none'; base-uri 'none'">`;
  return `<!doctype html><html><head><meta charset="utf-8">${policy}</head><body>${code}</body></html>`;
}

export default function ProjectsPage() {
  const { tr } = useI18n();
  const user = useAuthStore(state => state.currentUser);
  const initializeProgress = useProjectProgressStore(state => state.initialize);
  const loadProgress = useProjectProgressStore(state => state.load);
  const saveProgress = useProjectProgressStore(state => state.save);
  const [activeId, setActiveId] = useState(projects[0].id);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [code, setCode] = useState(projects[0].starterCode);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const activeProject = useMemo(() => projects.find(project => project.id === activeId) || projects[0], [activeId]);
  const projectText = useMemo(() => {
    if (activeProject.id === 'personal-portfolio') return {
      title: tr('Shaxsiy portfolio sahifasi', 'Страница личного портфолио', 'Personal portfolio page'),
      level: tr('Boshlang‘ich · HTML', 'Начальный · HTML', 'Beginner · HTML'),
      description: tr('O‘zingiz haqingizda ma’lumot, ko‘nikmalar va loyihalar bo‘limiga ega portfolio yarating.', 'Создайте портфолио с информацией о себе, навыками и проектами.', 'Create a portfolio with information about yourself, your skills, and projects.'),
      goal: tr('Semantik HTML elementlaridan foydalanib, o‘zingizni tanishtiradigan sahifa tuzing.', 'Создайте страницу-знакомство с помощью семантических элементов HTML.', 'Build an introduction page using semantic HTML elements.'),
      steps: [
        tr('Sahifaga ismingiz va kasbingiz yozilgan asosiy sarlavha qo‘shing.', 'Добавьте главный заголовок с именем и профессией.', 'Add a main heading with your name and profession.'),
        tr('O‘zingiz haqingizda qisqa paragraf yozing.', 'Напишите короткий абзац о себе.', 'Write a short paragraph about yourself.'),
        tr('Ko‘nikmalaringiz uchun tartibli ro‘yxat yarating.', 'Создайте упорядоченный список навыков.', 'Create an ordered list of your skills.'),
        tr('Bog‘lanish uchun email yoki havola qo‘shing.', 'Добавьте email или ссылку для связи.', 'Add an email address or link for contact.'),
      ],
    };
    if (activeProject.id === 'product-landing') return {
      title: tr('Mahsulot landing sahifasi', 'Посадочная страница продукта', 'Product landing page'),
      level: tr('O‘rta · HTML + CSS', 'Средний · HTML + CSS', 'Intermediate · HTML + CSS'),
      description: tr('Mahsulotni tanishtiruvchi, chaqiriq tugmasi va moslashuvchan dizaynga ega sahifa yarating.', 'Создайте адаптивную страницу продукта с описанием и кнопкой действия.', 'Create a responsive product page with an introduction and call-to-action button.'),
      goal: tr('Sarlavha, foyda kartalari va ko‘zga tashlanadigan tugma bilan chiroyli landing sahifa tayyorlang.', 'Подготовьте привлекательную страницу с заголовком, карточками преимуществ и заметной кнопкой.', 'Build an attractive landing page with a heading, benefit cards, and a prominent button.'),
      steps: [
        tr('Mahsulot nomi va foydasini tushuntiruvchi sarlavha yozing.', 'Добавьте заголовок с названием и пользой продукта.', 'Write a heading with the product name and its benefit.'),
        tr('Kamida uchta asosiy afzallikni kartalarda ko‘rsating.', 'Покажите как минимум три преимущества в карточках.', 'Show at least three key benefits in cards.'),
        tr('Asosiy chaqiriq tugmasini qo‘shing.', 'Добавьте основную кнопку действия.', 'Add a primary call-to-action button.'),
        tr('CSS bilan ranglar, masofalar va mobil ko‘rinishni sozlang.', 'Настройте цвета, отступы и мобильное отображение с помощью CSS.', 'Use CSS to style colors, spacing, and the mobile layout.'),
      ],
    };
    return {
      title: tr('Interaktiv hisoblagich', 'Интерактивный счётчик', 'Interactive counter'),
      level: tr('O‘rta · JavaScript', 'Средний · JavaScript', 'Intermediate · JavaScript'),
      description: tr('Tugmalar orqali qiymatni oshirish, kamaytirish va qayta boshlash mumkin bo‘lgan hisoblagich yarating.', 'Создайте счётчик, значение которого можно увеличивать, уменьшать и сбрасывать кнопками.', 'Create a counter that can be incremented, decremented, and reset using buttons.'),
      goal: tr('JavaScript hodisalari va DOM orqali sahifadagi qiymatni boshqaring.', 'Управляйте значением на странице с помощью событий JavaScript и DOM.', 'Control the displayed value using JavaScript events and the DOM.'),
      steps: [
        tr('Hisoblagich qiymatini ko‘rsatadigan element yarating.', 'Создайте элемент для отображения значения счётчика.', 'Create an element that displays the counter value.'),
        tr('Qiymatni oshirish va kamaytirish tugmalarini qo‘shing.', 'Добавьте кнопки увеличения и уменьшения значения.', 'Add buttons to increment and decrement the value.'),
        tr('Tugmalarga click hodisasi orqali JavaScript ulang.', 'Добавьте обработчики событий click для кнопок.', 'Add JavaScript click event handlers to the buttons.'),
        tr('Qiymatni nolga qaytaradigan tugma qo‘shing.', 'Добавьте кнопку сброса значения до нуля.', 'Add a button that resets the value to zero.'),
      ],
    };
  }, [activeProject.id, tr]);

  useEffect(() => { initializeProgress(user?.id || null); }, [initializeProgress, user?.id]);

  useEffect(() => {
    let cancelled = false;
    setCompletedSteps([]);
    setCode(activeProject.starterCode);
    setPreview('');
    setMessage('');
    setError('');
    if (!user) return () => { cancelled = true; };

    setLoading(true);
    loadProgress(activeProject.id, user.id)
      .then((progress: ProjectProgress | null) => {
        if (cancelled || !progress) return;
        setCompletedSteps(progress.completedSteps.filter(index => index >= 0 && index < activeProject.steps.length));
        setCode(progress.code);
      })
      .catch(() => {
        if (!cancelled) setError(tr('Saqlangan loyiha holatini yuklab bo‘lmadi. Internet va Supabase sozlamalarini tekshiring.', 'Не удалось загрузить сохранённый проект. Проверьте подключение и настройки Supabase.', 'Could not load the saved project. Check your internet connection and Supabase settings.'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [activeProject, loadProgress, tr, user]);

  const toggleStep = (stepIndex: number) => {
    setCompletedSteps(current => current.includes(stepIndex)
      ? current.filter(index => index !== stepIndex)
      : [...current, stepIndex].sort((a, b) => a - b));
    setMessage('');
  };

  const handleSave = async () => {
    if (!user) {
      setError(tr('Loyiha jarayonini hisobingizga saqlash uchun tizimga kiring.', 'Войдите, чтобы сохранить прогресс проекта в аккаунте.', 'Sign in to save your project progress to your account.'));
      return;
    }
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await saveProgress(activeProject.id, user.id, { completedSteps, code });
      setMessage(tr('Loyiha jarayoni hisobingizga saqlandi.', 'Прогресс проекта сохранён в аккаунте.', 'Project progress saved to your account.'));
    } catch {
      setError(tr('Loyiha jarayonini saqlab bo‘lmadi. Internetni tekshirib, qayta urinib ko‘ring.', 'Не удалось сохранить прогресс проекта. Проверьте интернет и попробуйте снова.', 'Could not save project progress. Check your connection and try again.'));
    } finally {
      setSaving(false);
    }
  };

  const percent = Math.round(completedSteps.length * 100 / activeProject.steps.length);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan">{tr('Amaliyot', 'Практика', 'Practice')}</p>
        <h1 className="mt-2 font-[Space_Grotesk] text-3xl font-semibold text-white sm:text-4xl">{tr('Dasturlash loyihalari', 'Проекты по программированию', 'Programming projects')}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">{tr('Yo‘riqnoma bo‘yicha haqiqiy kichik loyihalar yarating, kodni brauzerda sinang va bajarilgan bosqichlarni hisobingizda saqlang.', 'Создавайте небольшие проекты по инструкциям, проверяйте код в браузере и сохраняйте прогресс в аккаунте.', 'Build small projects using guided instructions, test code in your browser, and save progress to your account.')}</p>
        <Link href="/portfolio" className="mt-4 inline-flex rounded-lg border border-neon-cyan/30 px-4 py-2 text-sm font-semibold text-neon-cyan hover:bg-neon-cyan/10">{tr('Mening portfolioim', 'Моё портфолио', 'My portfolio')} →</Link>
      </header>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <nav aria-label={tr('Loyiha tanlash', 'Выбор проекта', 'Choose a project')} className="h-fit space-y-2">
          {projects.map(project => (
            <button
              key={project.id}
              type="button"
              onClick={() => setActiveId(project.id)}
              aria-current={project.id === activeId ? 'page' : undefined}
              className={`w-full rounded-xl border p-4 text-left transition-colors ${project.id === activeId ? 'border-neon-cyan/40 bg-neon-cyan/10' : 'border-white/10 bg-white/[0.035] hover:border-white/20'}`}
            >
              <span className="block font-semibold text-white">{project.id === 'personal-portfolio' ? tr('Shaxsiy portfolio sahifasi', 'Страница личного портфолио', 'Personal portfolio page') : project.id === 'product-landing' ? tr('Mahsulot landing sahifasi', 'Посадочная страница продукта', 'Product landing page') : tr('Interaktiv hisoblagich', 'Интерактивный счётчик', 'Interactive counter')}</span>
              <span className="mt-1 block text-xs text-slate-400">{project.id === activeProject.id ? projectText.level : project.id === 'personal-portfolio' ? tr('Boshlang‘ich · HTML', 'Начальный · HTML', 'Beginner · HTML') : project.id === 'product-landing' ? tr('O‘rta · HTML + CSS', 'Средний · HTML + CSS', 'Intermediate · HTML + CSS') : tr('O‘rta · JavaScript', 'Средний · JavaScript', 'Intermediate · JavaScript')}</span>
            </button>
          ))}
        </nav>

        <section className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs text-neon-cyan">{projectText.level}</p>
              <h2 className="mt-1 font-[Space_Grotesk] text-2xl font-semibold text-white">{projectText.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{projectText.description}</p>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">{completedSteps.length}/{activeProject.steps.length} · {percent}%</span>
          </div>

          <div className="mt-5 rounded-xl border border-neon-cyan/15 bg-neon-cyan/[0.04] p-4">
            <h3 className="text-sm font-semibold text-white">{tr('Loyiha maqsadi', 'Цель проекта', 'Project goal')}</h3>
            <p className="mt-1 text-sm text-slate-300">{projectText.goal}</p>
          </div>

          <div className="mt-5">
            <h3 className="text-sm font-semibold text-white">{tr('Bajarish bosqichlari', 'Этапы выполнения', 'Project steps')}</h3>
            <div className="mt-3 space-y-2">
              {projectText.steps.map((step, index) => (
                <label key={step} className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 p-3 text-sm text-slate-300 hover:bg-white/[0.03]">
                  <input type="checkbox" checked={completedSteps.includes(index)} onChange={() => toggleStep(index)} disabled={loading} className="mt-0.5 accent-cyan-400 disabled:opacity-50" />
                  <span className={completedSteps.includes(index) ? 'text-emerald-200' : ''}>{step}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            <div>
              <label htmlFor="project-code" className="mb-2 block text-xs font-medium text-slate-400">{tr('HTML/CSS/JavaScript muharriri', 'Редактор HTML/CSS/JavaScript', 'HTML/CSS/JavaScript editor')}</label>
              <textarea id="project-code" value={code} onChange={event => { setCode(event.target.value); setMessage(''); }} spellCheck={false} className="min-h-80 w-full resize-y rounded-xl border border-white/10 bg-[#060914] p-4 font-mono text-xs leading-5 text-emerald-200 outline-none focus:border-neon-cyan" />
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={() => setPreview(createPreview(code))} className="rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple px-4 py-2 text-sm font-semibold text-white">▶ {tr('Natijani ko‘rish', 'Предпросмотр', 'Preview result')}</button>
                <button type="button" onClick={handleSave} disabled={saving || loading} className="rounded-lg border border-white/15 px-4 py-2 text-sm text-slate-200 hover:border-neon-cyan/40 disabled:opacity-60">{saving ? tr('Saqlanmoqda…', 'Сохранение…', 'Saving…') : tr('Jarayonni saqlash', 'Сохранить прогресс', 'Save progress')}</button>
              </div>
              {!user && <p className="mt-2 text-xs text-slate-500">{tr('Kod va bajarilgan bosqichlarni saqlash uchun', 'Чтобы сохранить код и выполненные шаги,', 'To save your code and completed steps,')} <Link href="/auth/login" className="text-neon-cyan hover:underline">{tr('tizimga kiring', 'войдите', 'sign in')}</Link>.</p>}
              {loading && <p className="mt-2 text-xs text-slate-500">{tr('Saqlangan loyiha yuklanmoqda…', 'Загрузка сохранённого проекта…', 'Loading saved project…')}</p>}
              {message && <p role="status" className="mt-3 text-sm text-emerald-300">{message}</p>}
              {error && <p role="alert" className="mt-3 text-sm text-amber-200">{error}</p>}
            </div>
            <div>
              <h3 className="mb-2 text-xs font-medium text-slate-400">{tr('Natija oynasi', 'Окно результата', 'Preview window')}</h3>
              {preview ? (
                <iframe title={`${projectText.title} ${tr('natijasi', 'предпросмотр', 'preview')}`} sandbox="allow-scripts" srcDoc={preview} className="h-96 w-full rounded-xl border border-white/10 bg-white" />
              ) : (
                <div className="flex h-96 items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#060914] p-5 text-center text-sm text-slate-500">{tr('Kodni ishga tushirgandan keyin natija shu yerda chiqadi.', 'После запуска кода результат появится здесь.', 'Run your code to see the result here.')}</div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

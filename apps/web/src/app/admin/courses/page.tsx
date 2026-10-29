'use client';

import { useState } from 'react';
import { useI18n } from '@/components/providers';
import { useCourseStore, CourseItem } from '@/store/courseStore';

export default function AdminCoursesPage() {
  const { tr, language } = useI18n();
  const courseLanguage = language === 'ru' || language === 'uz' ? language : 'en';
  const { courses, addCourse, updateCourse, deleteCourse } = useCourseStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);

  // Form states
  const [translations, setTranslations] = useState<CourseItem['translations']>({});
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [languageCode, setLanguageCode] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [isActive, setIsActive] = useState(true);
  const [notice, setNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const openAddModal = () => {
    setEditingCourse(null);
    setTranslations({});
    setTitle('');
    setSlug('');
    setLanguageCode('');
    setIconUrl('');
    setDescription('');
    setDifficulty('beginner');
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (course: CourseItem) => {
    setEditingCourse(course);
    setTranslations(course.translations || {});
    setTitle(course.title);
    setSlug(course.slug);
    setLanguageCode(course.languageCode);
    setIconUrl(course.iconUrl || '');
    setDescription(course.description);
    setDifficulty(course.difficulty);
    setIsActive(course.isActive);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    let saveSucceeded = false;
    const normalizedSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '');
    if (!title.trim() || !normalizedSlug) {
      setNotice({ text: tr('Iltimos, barcha majburiy maydonlarni to‘ldiring.', 'Заполните все обязательные поля.', 'Please fill in all required fields.'), type: 'error' });
      return;
    }

    if (courses.some(course => course.slug === normalizedSlug && course.id !== editingCourse?.id)) {
      setNotice({ text: tr('Bu URL nomi bilan kurs mavjud. Boshqa slug tanlang.', 'Курс с таким URL уже существует. Выберите другой slug.', 'A course with this URL already exists. Choose a different slug.'), type: 'error' });
      return;
    }

    if (editingCourse) {
      const res = await updateCourse(editingCourse.id, {
        title,
        slug: normalizedSlug,
        languageCode: (languageCode || normalizedSlug).toLowerCase().trim(),
        iconUrl: iconUrl.trim() || null,
        translations,
        description,
        difficulty,
        isActive,
      });
      setNotice({ text: res.success ? tr('Kurs yangilandi.', 'Курс обновлён.', 'Course updated.') : res.message, type: res.success ? 'success' : 'error' });
      saveSucceeded = res.success;
    } else {
      const res = await addCourse({
        title,
        slug: normalizedSlug,
        languageCode: (languageCode || normalizedSlug).toLowerCase().trim(),
        iconUrl: iconUrl.trim() || null,
        translations,
        description,
        difficulty,
        orderIndex: courses.length,
        isActive,
        levels: [],
      });
      setNotice({ text: res.success ? tr('Kurs qo‘shildi.', 'Курс добавлен.', 'Course added.') : res.message, type: res.success ? 'success' : 'error' });
      saveSucceeded = res.success;
    }

    if (saveSucceeded) setModalOpen(false);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleDelete = async (id: string, courseTitle: string) => {
    if (confirm(tr(`Haqiqatan ham "${courseTitle}" kursini o‘chirmoqchimisiz?`, `Вы действительно хотите удалить курс «${courseTitle}»?`, `Are you sure you want to delete the course "${courseTitle}"?`))) {
      const res = await deleteCourse(id);
      setNotice({ text: res.success ? tr('Kurs o‘chirildi.', 'Курс удалён.', 'Course deleted.') : res.message, type: res.success ? 'success' : 'error' });
      setTimeout(() => setNotice(null), 3000);
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const updateTranslation = (locale: 'uz' | 'ru' | 'en', field: 'title' | 'description', value: string) => {
    setTranslations(current => ({
      ...current,
      [locale]: { ...current?.[locale], [field]: value },
    }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="font-[Space_Grotesk] text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <span>📚</span> {tr('Kurslar boshqaruvi', 'Управление курсами', 'Manage courses')}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {tr('Saytdagi dasturlash kurslarini yarating, tahrirlang va o‘chiring.', 'Создавайте, редактируйте и удаляйте курсы программирования.', 'Create, edit, and delete programming courses.')}
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white text-xs font-bold shadow-lg shadow-neon-blue/20 hover:opacity-95 transition-all flex items-center gap-2 w-fit"
        >
          <span>+</span> {tr('Yangi kurs qo‘shish', 'Добавить курс', 'Add course')}
        </button>
      </div>

      {notice && (
        <div
          className={`p-3 rounded-xl text-xs font-medium border flex items-center justify-between animate-fade-in ${
            notice.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          <span>{notice.text}</span>
          <button onClick={() => setNotice(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Search and filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder={tr('Kurs nomi yoki slug bo‘yicha qidirish...', 'Поиск по названию курса или slug...', 'Search by course name or slug...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0a0f24] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-neon-cyan/50"
          />
          <span className="absolute left-3 top-2.5 text-xs text-slate-500">🔍</span>
        </div>
        <span className="text-xs text-slate-400">{tr('Jami:', 'Всего:', 'Total:')} {filteredCourses.length} {tr('ta kurs', 'курсов', 'courses')}</span>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="p-5 rounded-2xl border border-white/10 bg-[#0a0f24]/80 backdrop-blur-xl flex flex-col justify-between hover:border-white/20 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-neon-blue/15 border border-neon-cyan/30 flex items-center justify-center font-mono font-bold text-xs text-neon-cyan uppercase">
                    {course.languageCode.slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{course.translations?.[courseLanguage]?.title || course.title}</h3>
                    <span className="font-mono text-[10px] text-slate-400">/{course.slug}</span>
                  </div>
                </div>
                <span
                  className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    course.isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-red-500/15 text-red-400 border border-red-500/30'
                  }`}
                >
                  {course.isActive ? tr('FAOL', 'АКТИВЕН', 'ACTIVE') : tr('NOFAOL', 'НЕАКТИВЕН', 'INACTIVE')}
                </span>
              </div>

              <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                {course.translations?.[courseLanguage]?.description || course.description}
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase bg-white/5 border border-white/10 text-slate-300 px-2 py-0.5 rounded">
                  {course.difficulty === 'beginner' ? tr('Boshlang‘ich', 'Начальный', 'Beginner') : course.difficulty === 'intermediate' ? tr('O‘rta', 'Средний', 'Intermediate') : tr('Yuqori', 'Продвинутый', 'Advanced')}
                </span>
                <span className="text-[10px] text-slate-400">
                  {course.levels?.length || 0} {tr('dars', 'уроков', 'lessons')}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(course)}
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium border border-white/10 transition-colors"
                >
                  ✏️ {tr('Tahrirlash', 'Изменить', 'Edit')}
                </button>
                <button
                  type="button"
                  aria-label={tr('O‘chirish', 'Удалить', 'Delete')}
                  title={tr('O‘chirish', 'Удалить', 'Delete')}
                  onClick={() => handleDelete(course.id, course.title)}
                  className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-medium border border-red-500/20 transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm animate-fade-in sm:items-center">
          <div className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto overscroll-contain rounded-2xl border border-white/15 bg-[#0d132b] p-4 shadow-2xl sm:p-6">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <h2 className="font-bold text-base text-white">
                {editingCourse ? tr('Kursni tahrirlash', 'Редактировать курс', 'Edit course') : tr('Yangi kurs qo‘shish', 'Добавить курс', 'Add course')}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">{tr('Kurs nomi', 'Название курса', 'Course name')} *</label>
                <input
                  type="text"
                  required
                  placeholder={tr('Masalan: JavaScript asoslari', 'Например: Основы JavaScript', 'Example: JavaScript basics')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#060914] border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Slug (URL) *</label>
                  <input
                    type="text"
                    required
                    placeholder="javascript"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#060914] border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-neon-cyan"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">{tr('Til kodi (masalan: js, py)', 'Код языка (например: js, py)', 'Language code (e.g. js, py)')}</label>
                  <input
                    type="text"
                    placeholder="js"
                    value={languageCode}
                    onChange={(e) => setLanguageCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#060914] border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-neon-cyan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">{tr('Kurs logotipi (rasm manzili)', 'Логотип курса (URL изображения)', 'Course logo (image URL)')}</label>
                <input
                  type="text"
                  placeholder="/images/logos/react.svg yoki https://..."
                  value={iconUrl}
                  onChange={(e) => setIconUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#060914] border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-neon-cyan"
                />
                <p className="mt-1 text-[10px] text-slate-500">{tr('Rasmni public/images/logos papkasiga joylang va bu yerga uning manzilini kiriting.', 'Поместите изображение в public/images/logos и укажите здесь его путь.', 'Place the image in public/images/logos and enter its path here.')}</p>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">{tr('Tavsif', 'Описание', 'Description')}</label>
                <textarea
                  rows={3}
                  placeholder={tr('Ushbu kursda nimalar o‘rganiladi...', 'Чему посвящён этот курс...', 'What this course covers...')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#060914] border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-neon-cyan resize-none"
                />
              </div>

              <details className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                <summary className="cursor-pointer text-xs font-semibold text-slate-200">{tr('Kurs tarjimalari', 'Переводы курса', 'Course translations')}</summary>
                <p className="mt-2 text-[10px] leading-5 text-slate-400">{tr('Har bir tilda ko‘rinadigan nom va tavsifni kiriting. Bo‘sh maydonlar asosiy matnni ko‘rsatadi.', 'Укажите название и описание для каждого языка. Пустые поля будут показывать основной текст.', 'Add a title and description for each language. Empty fields fall back to the main text.')}</p>
                {([
                  ['uz', tr('O‘zbekcha', 'Узбекский', 'Uzbek')],
                  ['ru', tr('Ruscha', 'Русский', 'Russian')],
                  ['en', tr('Inglizcha', 'Английский', 'English')],
                ] as const).map(([locale, localeLabel]) => (
                  <fieldset key={locale} className="mt-3 space-y-2 border-t border-white/10 pt-3">
                    <legend className="px-1 text-[11px] font-semibold text-neon-cyan">{localeLabel}</legend>
                    <input
                      type="text"
                      value={translations?.[locale]?.title || ''}
                      onChange={event => updateTranslation(locale, 'title', event.target.value)}
                      placeholder={tr('Kurs nomi', 'Название курса', 'Course title')}
                      aria-label={`${localeLabel} — ${tr('Kurs nomi', 'Название курса', 'Course title')}`}
                      className="w-full rounded-lg border border-white/10 bg-[#060914] px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:border-neon-cyan focus:outline-none"
                    />
                    <textarea
                      rows={2}
                      value={translations?.[locale]?.description || ''}
                      onChange={event => updateTranslation(locale, 'description', event.target.value)}
                      placeholder={tr('Kurs tavsifi', 'Описание курса', 'Course description')}
                      aria-label={`${localeLabel} — ${tr('Kurs tavsifi', 'Описание курса', 'Course description')}`}
                      className="w-full resize-none rounded-lg border border-white/10 bg-[#060914] px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:border-neon-cyan focus:outline-none"
                    />
                  </fieldset>
                ))}
              </details>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">{tr('Qiyinlik darajasi', 'Уровень сложности', 'Difficulty')}</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as CourseItem['difficulty'])}
                    className="w-full px-3 py-2 rounded-xl bg-[#060914] border border-white/10 text-white focus:outline-none focus:border-neon-cyan"
                  >
                    <option value="beginner">{tr('Boshlang‘ich', 'Начальный', 'Beginner')}</option>
                    <option value="intermediate">{tr('O‘rta', 'Средний', 'Intermediate')}</option>
                    <option value="advanced">{tr('Yuqori', 'Продвинутый', 'Advanced')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">{tr('Holati', 'Статус', 'Status')}</label>
                  <select
                    value={isActive ? 'active' : 'inactive'}
                    onChange={(e) => setIsActive(e.target.value === 'active')}
                    className="w-full px-3 py-2 rounded-xl bg-[#060914] border border-white/10 text-white focus:outline-none focus:border-neon-cyan"
                  >
                    <option value="active">{tr('Faol', 'Активен', 'Active')}</option>
                    <option value="inactive">{tr('Nofaol (qoralama)', 'Неактивен (черновик)', 'Inactive (draft)')}</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 hover:border-white/20 text-slate-300"
                >
                  {tr('Bekor qilish', 'Отмена', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold shadow-md shadow-neon-blue/20"
                >
                  {tr('Saqlash', 'Сохранить', 'Save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

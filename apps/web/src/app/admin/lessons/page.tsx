'use client';

import { useEffect, useRef, useState } from 'react';
import { useCourseStore, LevelItem, QuizQuestion, ExerciseCheck } from '@/store/courseStore';
import { useI18n } from '@/components/providers';
import { LessonContent } from '@/components/lesson/LessonContent';

const labels = {
  en: { heading: 'Lessons and Modules', intro: 'Manage interactive lessons and practical modules for each course', add: 'Add lesson', choose: 'Choose a course:', lessons: 'lessons', edit: 'Edit', remove: 'Delete', none: 'No lessons in this course yet.', first: 'Add the first lesson', missingCourse: 'No course selected.', courseLessons: 'lessons', total: 'Total:', cancel: 'Cancel', save: 'Save', course: 'Course', title: 'Lesson title', description: 'Short description', theory: 'Lesson text', required: 'Lesson title is required', addTitle: 'Add lesson', editTitle: 'Edit lesson', help: 'Add the lesson content in Uzbek, then provide starter code for the playground.', editorLanguage: 'Playground language', starterCode: 'Starter code', uzbek: 'Uzbek', quiz: 'Lesson quiz', addQuestion: 'Add question', question: 'Question', answer: 'Answer', correctAnswer: 'Correct answer', removeQuestion: 'Remove', incompleteQuestion: 'Complete every quiz question and all four answer options.', questionLimit: 'Maximum 10 questions per lesson.', exercise: 'Coding exercise', instructions: 'Exercise instructions', addCheck: 'Add check', checkLabel: 'Requirement', selector: 'CSS selector', checkType: 'Check type', expected: 'Expected value', property: 'CSS property', removeCheck: 'Remove check', invalidExercise: 'Complete the instructions and every check field.', preview: 'Lesson text preview', up: 'Move up', down: 'Move down', quizExplanation: 'Answer explanation (shown after submission)' },
  ru: { heading: 'Уроки и модули', intro: 'Управление интерактивными уроками и практическими модулями курса', add: 'Добавить урок', choose: 'Выберите курс:', lessons: 'уроков', edit: 'Изменить', remove: 'Удалить', none: 'В этом курсе пока нет уроков.', first: 'Добавить первый урок', missingCourse: 'Курс не выбран.', courseLessons: 'уроки', total: 'Всего:', cancel: 'Отмена', save: 'Сохранить', course: 'Курс', title: 'Название урока', description: 'Краткое описание', theory: 'Материал урока', required: 'Введите название урока', addTitle: 'Добавить урок', editTitle: 'Изменить урок', help: 'Добавьте материал урока на узбекском языке и начальный код для практики.', editorLanguage: 'Язык редактора', starterCode: 'Начальный код', uzbek: 'Узбекский', quiz: 'Тест к уроку', addQuestion: 'Добавить вопрос', question: 'Вопрос', answer: 'Ответ', correctAnswer: 'Правильный ответ', removeQuestion: 'Удалить', incompleteQuestion: 'Заполните все вопросы теста и все четыре варианта ответа.', questionLimit: 'Максимум 10 вопросов на урок.', exercise: 'Практическое задание', instructions: 'Инструкция', addCheck: 'Добавить проверку', checkLabel: 'Требование', selector: 'CSS-селектор', checkType: 'Тип проверки', expected: 'Ожидаемое значение', property: 'CSS-свойство', removeCheck: 'Удалить проверку', invalidExercise: 'Заполните инструкцию и все поля проверок.', preview: 'Предпросмотр текста урока', up: 'Вверх', down: 'Вниз', quizExplanation: 'Пояснение к ответу (после теста)' },
  uz: { heading: 'Darslar va modullar boshqaruvi', intro: 'Har bir kursdagi interaktiv darslar va amaliy modullarni boshqarish', add: 'Yangi dars qo‘shish', choose: 'Kursni tanlang:', lessons: 'ta dars', edit: 'Tahrirlash', remove: 'O‘chirish', none: 'Bu kursda hali darslar yo‘q.', first: 'Birinchi darsni qo‘shish', missingCourse: 'Kurs tanlanmagan.', courseLessons: 'darslari', total: 'Jami:', cancel: 'Bekor qilish', save: 'Saqlash', course: 'Kurs', title: 'Dars sarlavhasi', description: 'Qisqa tavsif', theory: 'Dars matni', required: 'Dars sarlavhasi majburiy', addTitle: 'Yangi dars qo‘shish', editTitle: 'Darsni tahrirlash', help: 'Dars matnini o‘zbek tilida kiriting va amaliyot uchun boshlang‘ich kodni qo‘shing.', editorLanguage: 'IDE dasturlash tili', starterCode: 'Boshlang‘ich kod', uzbek: 'O‘zbekcha', quiz: 'Dars mini-testi', addQuestion: 'Savol qo‘shish', question: 'Savol', answer: 'Javob varianti', correctAnswer: 'To‘g‘ri javob', removeQuestion: 'O‘chirish', incompleteQuestion: 'Testdagi barcha savol va to‘rtta javob variantini to‘ldiring.', questionLimit: 'Har bir dars uchun eng ko‘pi 10 ta savol.', exercise: 'Kod mashqi', instructions: 'Vazifa yo‘riqnomasi', addCheck: 'Tekshiruv qo‘shish', checkLabel: 'Tekshiruv talabi', selector: 'CSS selektor', checkType: 'Tekshirish turi', expected: 'Kutilgan qiymat', property: 'CSS xususiyati', removeCheck: 'Tekshiruvni o‘chirish', invalidExercise: 'Mashq yo‘riqnomasi va barcha tekshiruv maydonlarini to‘ldiring.', preview: 'Dars matni ko‘rinishi', up: 'Yuqoriga', down: 'Pastga', quizExplanation: 'Javob izohi (testdan keyin ko‘rsatiladi)' },
} as const;

const getEditorLanguage = (languageCode: string): NonNullable<LevelItem['editorLanguage']> => {
  const normalized = languageCode.toLowerCase();
  return normalized === 'css' || normalized === 'javascript' ? normalized : 'html';
};

export default function AdminLessonsPage() {
  const { language } = useI18n();
  const text = labels[language as keyof typeof labels] || labels.en;
  const { courses, addLevel, updateLevel, deleteLevel, moveLevel } = useCourseStore();
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [editingLevel, setEditingLevel] = useState<LevelItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [theory, setTheory] = useState('');
  const [editorLanguage, setEditorLanguage] = useState<NonNullable<LevelItem['editorLanguage']>>('html');
  const [starterCode, setStarterCode] = useState('');
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [exerciseInstructions, setExerciseInstructions] = useState('');
  const [exerciseChecks, setExerciseChecks] = useState<ExerciseCheck[]>([]);
  const [notice, setNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const currentCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  useEffect(() => {
    if (modalOpen) modalRef.current?.querySelector<HTMLElement>('input, textarea, select, button')?.focus();
  }, [modalOpen]);

  const openAddModal = () => {
    setEditingLevel(null);
    setTitle('');
    setDescription('');
    setTheory('');
    setEditorLanguage(getEditorLanguage(currentCourse?.languageCode || 'html'));
    setStarterCode('');
    setQuiz([]);
    setExerciseInstructions('');
    setExerciseChecks([]);
    setModalOpen(true);
  };

  const openEditModal = (lvl: LevelItem) => {
    setEditingLevel(lvl);
    setTitle(lvl.title);
    setDescription(lvl.description || '');
    setTheory(lvl.theory || '');
    setEditorLanguage(lvl.editorLanguage || getEditorLanguage(currentCourse?.languageCode || 'html'));
    setStarterCode(lvl.starterCode || '');
    setQuiz((lvl.quiz || []).map(question => ({
      ...question,
      id: question.id || crypto.randomUUID(),
      options: [...question.options],
    })));
    setExerciseInstructions(lvl.exercise?.instructions || '');
    setExerciseChecks((lvl.exercise?.checks || []).map(check => ({ ...check })));
    setModalOpen(true);
  };

  const addQuizQuestion = () => {
    setQuiz(current => [...current, {
      id: crypto.randomUUID(),
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      explanation: '',
    }]);
  };

  const updateQuizQuestion = (questionId: string, updates: Partial<QuizQuestion>) => {
    setQuiz(current => current.map(question => question.id === questionId ? { ...question, ...updates } : question));
  };

  const addExerciseCheck = () => setExerciseChecks(current => [...current, {
    id: crypto.randomUUID(), label: '', selector: '', type: 'element',
  }]);
  const updateExerciseCheck = (checkId: string, updates: Partial<ExerciseCheck>) => {
    setExerciseChecks(current => current.map(check => check.id === checkId ? { ...check, ...updates } : check));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    let saveSucceeded = false;
    if (!title.trim()) {
      setNotice({ text: text.required, type: 'error' });
      return;
    }
    if (quiz.length > 10 || quiz.some(question => !question.question.trim() || question.options.length !== 4 || question.options.some(option => !option.trim()) || !Number.isInteger(question.correctIndex) || question.correctIndex < 0 || question.correctIndex > 3)) {
      setNotice({ text: text.incompleteQuestion, type: 'error' });
      return;
    }
    if ((exerciseInstructions.trim() || exerciseChecks.length) && (!exerciseInstructions.trim() || !exerciseChecks.length || exerciseChecks.some(check => !check.label.trim() || !check.selector.trim() || ((check.type === 'text' || check.type === 'style') && !check.expected?.trim()) || (check.type === 'style' && !check.property?.trim())))) {
      setNotice({ text: text.invalidExercise, type: 'error' });
      return;
    }
    const exercise = exerciseInstructions.trim() ? { instructions: exerciseInstructions.trim(), checks: exerciseChecks } : null;

    if (editingLevel) {
      const res = await updateLevel(currentCourse.id, editingLevel.id, {
        title,
        description,
        theory,
        editorLanguage,
        starterCode,
        quiz,
        exercise,
        translations: {},
      });
      setNotice({ text: res.message, type: res.success ? 'success' : 'error' });
      saveSucceeded = res.success;
    } else {
      const res = await addLevel(currentCourse.id, {
        title,
        description,
        theory,
        editorLanguage,
        starterCode,
        quiz,
        exercise,
        translations: {},
        levelIndex: currentCourse.levels?.length || 0,
        orderIndex: currentCourse.levels?.length || 0,
      });
      setNotice({ text: res.message, type: res.success ? 'success' : 'error' });
      saveSucceeded = res.success;
    }

    if (saveSucceeded) setModalOpen(false);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleDelete = async (levelId: string, levelTitle: string) => {
    if (confirm(`"${levelTitle}" darsini o'chirmoqchimisiz?`)) {
      const res = await deleteLevel(currentCourse.id, levelId);
      setNotice({ text: res.message, type: res.success ? 'success' : 'error' });
      setTimeout(() => setNotice(null), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="font-[Space_Grotesk] text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <span>📖</span> {text.heading}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {text.intro}
          </p>
        </div>

        <button
          onClick={openAddModal}
          disabled={!currentCourse}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white text-xs font-bold shadow-lg shadow-neon-blue/20 hover:opacity-95 transition-all flex items-center gap-2 w-fit"
        >
          <span>+</span> {text.add}
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

      {/* Course Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/5">
        <span className="text-xs font-bold text-slate-400 mr-2 whitespace-nowrap">{text.choose}</span>
        {courses.map((course) => (
          <button
            key={course.id}
            onClick={() => setSelectedCourseId(course.id)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
              currentCourse?.id === course.id
                ? 'bg-neon-blue/20 border-neon-cyan/50 text-white shadow-md shadow-neon-blue/15'
                : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <span className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-[10px] uppercase font-mono text-neon-cyan">
              {course.languageCode.slice(0, 2)}
            </span>
            <span>{course.title}</span>
            <span className="text-[10px] opacity-60">({course.levels?.length || 0})</span>
          </button>
        ))}
      </div>

      {/* Current Course Info & Lessons List */}
      {currentCourse ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#0a0f24] border border-white/10 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm text-white">
                {currentCourse.title} {text.courseLessons}
              </h2>
              <p className="text-xs text-slate-400">{currentCourse.description}</p>
            </div>
            <span className="text-xs text-neon-cyan font-mono font-bold">
              {text.total} {currentCourse.levels?.length || 0} {text.lessons}
            </span>
          </div>

          <div className="space-y-2">
            {[...(currentCourse.levels || [])].sort((a, b) => a.orderIndex - b.orderIndex).map((level, idx, orderedLevels) => (
              <div
                key={level.id}
                className="p-4 rounded-xl border border-white/10 bg-[#0a0f24]/70 hover:border-white/20 transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-mono font-bold text-xs text-slate-300">
                    {idx + 1}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-xs sm:text-sm text-white truncate">
                      {level.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {level.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button type="button" aria-label={`${text.up}: ${level.title}`} disabled={idx === 0} onClick={async () => {
                    const result = await moveLevel(currentCourse.id, level.id, -1);
                    if (!result.success) setNotice({ text: result.message, type: 'error' });
                  }} className="rounded-lg border border-white/10 px-2 py-1.5 text-xs text-slate-300 disabled:opacity-30">↑</button>
                  <button type="button" aria-label={`${text.down}: ${level.title}`} disabled={idx === orderedLevels.length - 1} onClick={async () => {
                    const result = await moveLevel(currentCourse.id, level.id, 1);
                    if (!result.success) setNotice({ text: result.message, type: 'error' });
                  }} className="rounded-lg border border-white/10 px-2 py-1.5 text-xs text-slate-300 disabled:opacity-30">↓</button>
                  <button
                    onClick={() => openEditModal(level)}
                    className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium border border-white/10 transition-colors"
                  >
                    ✏️ {text.edit}
                  </button>
                  <button
                    onClick={() => handleDelete(level.id, level.title)}
                    className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-medium border border-red-500/20 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}

            {(currentCourse.levels || []).length === 0 && (
              <div className="p-8 text-center rounded-xl border border-white/10 bg-[#0a0f24]/50">
                <p className="text-sm text-slate-400 mb-3">{text.none}</p>
                <button
                  onClick={openAddModal}
                  className="px-4 py-2 rounded-xl bg-neon-blue/20 text-neon-cyan border border-neon-cyan/40 text-xs font-bold"
                >
                  + {text.first}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-slate-400 text-sm">{text.missingCourse}</p>
      )}

      {/* Modal */}
      {modalOpen && (
        <div role="dialog" aria-modal="true" aria-labelledby="lesson-modal-title" ref={modalRef} className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm animate-fade-in sm:items-center" onKeyDown={event => {
          if (event.key === 'Escape') {
            setModalOpen(false);
            return;
          }
          if (event.key !== 'Tab') return;
          const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled])'));
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}>
          <div className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto overscroll-contain rounded-2xl border border-white/15 bg-[#0d132b] p-4 shadow-2xl sm:p-6">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <h2 id="lesson-modal-title" className="font-bold text-base text-white">
                {editingLevel ? text.editTitle : text.addTitle}
              </h2>
              <button type="button" aria-label={text.cancel} onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form aria-labelledby="lesson-modal-title" onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">{text.course}</label>
                <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold">
                  {currentCourse.title}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">{text.title} ({text.uzbek}) *</label>
                <input
                  type="text"
                  required
                  placeholder=""
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#060914] border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">{text.description} ({text.uzbek})</label>
                <textarea
                  rows={3}
                  placeholder="Dars haqida qisqacha..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#060914] border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-neon-cyan resize-none"
                />
              </div>

              <div>
                <label htmlFor="lesson-theory" className="mb-1 block font-medium text-slate-300">{text.theory} ({text.uzbek})</label>
                <textarea
                  id="lesson-theory"
                  rows={8}
                  placeholder="Dars mavzusi, tushuntirish va misollar..."
                  value={theory}
                  onChange={event => setTheory(event.target.value)}
                  className="w-full resize-y rounded-xl border border-white/10 bg-[#060914] px-3 py-2 text-white placeholder-slate-600 focus:border-neon-cyan focus:outline-none"
                />
                <p className="mt-2 text-[10px] text-slate-500">Format: # sarlavha, - ro‘yxat, **qalin**, `kod`</p>
                <div className="mt-3 rounded-xl border border-white/10 bg-black/15 p-4">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-slate-500">{text.preview}</p>
                  <LessonContent content={theory || 'Dars matni shu yerda ko‘rinadi.'} />
                </div>
              </div>

              <div>
                <label htmlFor="lesson-editor-language" className="mb-1 block font-medium text-slate-300">{text.editorLanguage}</label>
                <select
                  id="lesson-editor-language"
                  value={editorLanguage}
                  onChange={event => setEditorLanguage(event.target.value as NonNullable<LevelItem['editorLanguage']>)}
                  className="w-full rounded-xl border border-white/10 bg-[#060914] px-3 py-2 text-white focus:border-neon-cyan focus:outline-none"
                >
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="javascript">JavaScript</option>
                </select>
              </div>

              <div>
                <label htmlFor="lesson-starter-code" className="mb-1 block font-medium text-slate-300">{text.starterCode}</label>
                <textarea
                  id="lesson-starter-code"
                  rows={6}
                  spellCheck={false}
                  placeholder="<h1>Salom, dunyo!</h1>"
                  value={starterCode}
                  onChange={event => setStarterCode(event.target.value)}
                  className="w-full resize-y rounded-xl border border-white/10 bg-[#060914] px-3 py-2 font-mono text-white placeholder-slate-600 focus:border-neon-cyan focus:outline-none"
                />
              </div>

              <section className="space-y-3 rounded-xl border border-white/10 p-4">
                <div>
                  <h3 className="font-semibold text-white">{text.exercise}</h3>
                  <p className="mt-1 text-[10px] text-slate-400">Tekshiruvlar brauzerda, sandbox ichida bajariladi.</p>
                </div>
                <label className="block text-slate-300">
                  {text.instructions}
                  <textarea rows={3} value={exerciseInstructions} onChange={event => setExerciseInstructions(event.target.value)} className="mt-1 w-full resize-y rounded-lg border border-white/10 bg-[#060914] px-3 py-2 text-white focus:border-neon-cyan focus:outline-none" />
                </label>
                {exerciseChecks.map((check, index) => <fieldset key={check.id} className="space-y-2 rounded-lg border border-white/10 p-3">
                  <legend className="px-1 text-[10px] text-slate-400">{text.checkLabel} {index + 1}</legend>
                  <input aria-label={text.checkLabel} value={check.label} onChange={event => updateExerciseCheck(check.id, { label: event.target.value })} placeholder={text.checkLabel} className="w-full rounded-lg border border-white/10 bg-[#060914] px-3 py-2 text-white focus:border-neon-cyan focus:outline-none" />
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input aria-label={text.selector} value={check.selector} onChange={event => updateExerciseCheck(check.id, { selector: event.target.value })} placeholder={text.selector + ' (masalan, h1)'} className="w-full rounded-lg border border-white/10 bg-[#060914] px-3 py-2 text-white focus:border-neon-cyan focus:outline-none" />
                    <select aria-label={text.checkType} value={check.type} onChange={event => updateExerciseCheck(check.id, { type: event.target.value as ExerciseCheck['type'] })} className="w-full rounded-lg border border-white/10 bg-[#060914] px-3 py-2 text-white focus:border-neon-cyan focus:outline-none">
                      <option value="element">Element mavjud</option><option value="text">Matn ichida bor</option><option value="style">CSS qiymati</option>
                    </select>
                  </div>
                  {(check.type === 'text' || check.type === 'style') && <div className="grid gap-2 sm:grid-cols-2">
                    {check.type === 'style' && <input aria-label={text.property} value={check.property || ''} onChange={event => updateExerciseCheck(check.id, { property: event.target.value })} placeholder={text.property + ' (color)'} className="w-full rounded-lg border border-white/10 bg-[#060914] px-3 py-2 text-white focus:border-neon-cyan focus:outline-none" />}
                    <input aria-label={text.expected} value={check.expected || ''} onChange={event => updateExerciseCheck(check.id, { expected: event.target.value })} placeholder={text.expected} className="w-full rounded-lg border border-white/10 bg-[#060914] px-3 py-2 text-white focus:border-neon-cyan focus:outline-none" />
                  </div>}
                  <button type="button" onClick={() => setExerciseChecks(current => current.filter(item => item.id !== check.id))} className="text-[10px] text-rose-300">{text.removeCheck}</button>
                </fieldset>)}
                <button type="button" onClick={addExerciseCheck} className="rounded-lg border border-neon-cyan/30 px-3 py-2 text-xs font-semibold text-neon-cyan">+ {text.addCheck}</button>
              </section>

              <section className="space-y-3 rounded-xl border border-white/10 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-white">{text.quiz}</h3>
                    <p className="mt-1 text-[10px] text-slate-400">Har bir savol uchun 4 ta variant va 1 ta to‘g‘ri javob belgilang.</p>
                  </div>
                  <button type="button" onClick={addQuizQuestion} disabled={quiz.length >= 10} className="rounded-lg border border-neon-cyan/30 bg-neon-cyan/10 px-3 py-2 text-xs font-semibold text-neon-cyan disabled:cursor-not-allowed disabled:opacity-50">
                    + {text.addQuestion}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500">{text.questionLimit}</p>

                {quiz.map((question, questionIndex) => (
                  <fieldset key={question.id} className="space-y-3 rounded-xl border border-white/10 bg-black/10 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <legend className="text-xs font-semibold text-slate-200">{text.question} {questionIndex + 1}</legend>
                      <button
                        type="button"
                        onClick={() => setQuiz(current => current.filter(item => item.id !== question.id))}
                        className="rounded-md px-2 py-1 text-[10px] text-rose-300 hover:bg-rose-400/10"
                      >
                        {text.removeQuestion}
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      required
                      aria-label={`${text.question} ${questionIndex + 1}`}
                      placeholder={`${text.question}...`}
                      value={question.question}
                      onChange={event => updateQuizQuestion(question.id, { question: event.target.value })}
                      className="w-full resize-y rounded-lg border border-white/10 bg-[#060914] px-3 py-2 text-white placeholder-slate-600 focus:border-neon-cyan focus:outline-none"
                    />
                    <div className="grid gap-2 sm:grid-cols-2">
                      {question.options.map((option, optionIndex) => (
                        <input
                          key={`${question.id}-option-${optionIndex}`}
                          type="text"
                          required
                          aria-label={`${text.answer} ${optionIndex + 1}`}
                          placeholder={`${text.answer} ${optionIndex + 1}`}
                          value={option}
                          onChange={event => {
                            const options = [...question.options];
                            options[optionIndex] = event.target.value;
                            updateQuizQuestion(question.id, { options });
                          }}
                          className="w-full rounded-lg border border-white/10 bg-[#060914] px-3 py-2 text-white placeholder-slate-600 focus:border-neon-cyan focus:outline-none"
                        />
                      ))}
                    </div>
                    <label className="flex flex-col gap-1 text-[11px] text-slate-400">
                      {text.correctAnswer}
                      <select
                        value={question.correctIndex}
                        onChange={event => updateQuizQuestion(question.id, { correctIndex: Number(event.target.value) })}
                        className="w-full rounded-lg border border-white/10 bg-[#060914] px-3 py-2 text-white focus:border-neon-cyan focus:outline-none"
                      >
                        {question.options.map((option, optionIndex) => (
                          <option key={optionIndex} value={optionIndex}>{option.trim() || `${text.answer} ${optionIndex + 1}`}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block text-[11px] text-slate-400">
                      {text.quizExplanation}
                      <textarea
                        rows={2}
                        value={question.explanation || ''}
                        onChange={event => updateQuizQuestion(question.id, { explanation: event.target.value })}
                        maxLength={1000}
                        placeholder={text.quizExplanation}
                        className="mt-1 w-full resize-y rounded-lg border border-white/10 bg-[#060914] px-3 py-2 text-white placeholder-slate-600 focus:border-neon-cyan focus:outline-none"
                      />
                    </label>
                  </fieldset>
                ))}
              </section>

              <p className="text-[10px] leading-4 text-slate-400">{text.help}</p>
              <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 hover:border-white/20 text-slate-300"
                >
                  {text.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold shadow-md shadow-neon-blue/20"
                >
                  {text.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

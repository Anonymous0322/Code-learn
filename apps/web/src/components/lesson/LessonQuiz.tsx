'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/components/providers';
import { useAuthStore } from '@/store/authStore';
import { QuizQuestion } from '@/store/courseStore';
import { QuizResult, useLearningProgressStore } from '@/store/learningProgressStore';

interface LessonQuizProps {
  lessonId: string;
  questions: QuizQuestion[];
}

const labels = {
  en: {
    title: 'Quick quiz',
    instruction: 'Choose one answer for each question, then check your result.',
    submit: 'Check answers',
    score: 'Your result',
    saved: 'Your result is saved to your account.',
    signIn: 'Sign in to save this result to your account.',
    correct: 'Correct answer',
    incorrect: 'Not quite',
    unanswered: 'Answer every question before submitting.',
    loadError: 'Could not load your saved quiz result.',
    saveError: 'Your result could not be saved. Check your connection and try again.',
    loading: 'Loading saved result…',
    saving: 'Saving result…',
    retry: 'Try again',
    explanation: 'Why this is correct',
    review: 'Review these topics',
    reviewIntro: 'These questions may be useful to review:',
  },
  ru: {
    title: 'Короткий тест',
    instruction: 'Выберите один ответ на каждый вопрос, затем проверьте результат.',
    submit: 'Проверить ответы',
    score: 'Ваш результат',
    saved: 'Результат сохранён в вашем аккаунте.',
    signIn: 'Войдите, чтобы сохранить результат в аккаунте.',
    correct: 'Правильный ответ',
    incorrect: 'Неверно',
    unanswered: 'Ответьте на все вопросы перед отправкой.',
    loadError: 'Не удалось загрузить сохранённый результат теста.',
    saveError: 'Не удалось сохранить результат. Проверьте соединение и попробуйте снова.',
    loading: 'Загрузка сохранённого результата…',
    saving: 'Сохранение результата…',
    retry: 'Попробовать снова',
    explanation: 'Почему это правильно',
    review: 'Повторите темы',
    reviewIntro: 'Полезно повторить следующие вопросы:',
  },
  uz: {
    title: 'Qisqa test',
    instruction: 'Har bir savolga bittadan javob tanlang, so‘ng natijani tekshiring.',
    submit: 'Javoblarni tekshirish',
    score: 'Sizning natijangiz',
    saved: 'Natija hisobingizga saqlandi.',
    signIn: 'Natijani hisobingizga saqlash uchun tizimga kiring.',
    correct: 'To‘g‘ri javob',
    incorrect: 'Noto‘g‘ri',
    unanswered: 'Yuborishdan oldin barcha savollarga javob bering.',
    loadError: 'Saqlangan test natijasini yuklab bo‘lmadi.',
    saveError: 'Natijani saqlab bo‘lmadi. Internetni tekshirib, qayta urinib ko‘ring.',
    loading: 'Saqlangan natija yuklanmoqda…',
    saving: 'Natija saqlanmoqda…',
    retry: 'Qayta ishlash',
    explanation: 'Bu javob nima uchun to‘g‘ri',
    review: 'Qayta ko‘rib chiqing',
    reviewIntro: 'Quyidagi savollarni takrorlash foydali bo‘ladi:',
  },
} as const;

export function LessonQuiz({ lessonId, questions }: LessonQuizProps) {
  const { language } = useI18n();
  const text = labels[language as keyof typeof labels] || labels.en;
  const user = useAuthStore(state => state.currentUser);
  const loadQuizResult = useLearningProgressStore(state => state.loadQuizResult);
  const saveQuizResult = useLearningProgressStore(state => state.saveQuizResult);
  const storedResult = useLearningProgressStore(state => state.quizResults[lessonId]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [attemptResult, setAttemptResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);
  const result = attemptResult || storedResult;

  useEffect(() => {
    if (!user || questions.length === 0) return;
    let cancelled = false;
    setLoading(true);
    loadQuizResult(lessonId, user.id)
      .catch(() => {
        if (!cancelled) setError(text.loadError);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [lessonId, loadQuizResult, questions.length, text.loadError, user]);

  if (questions.length === 0) return null;

  const handleSubmit = async () => {
    if (questions.some(question => answers[question.id] === undefined)) {
      setError(text.unanswered);
      return;
    }
    const score = questions.reduce(
      (total, question) => total + (answers[question.id] === question.correctIndex ? 1 : 0),
      0,
    );
    const nextResult: QuizResult = {
      score,
      total: questions.length,
      percentage: Math.round(score * 100 / questions.length),
      submittedAt: new Date().toISOString(),
    };
    setAttemptResult(nextResult);
    setSubmitted(true);
    setError('');
    setSaveFailed(false);
    if (!user) return;

    setSaving(true);
    try {
      await saveQuizResult(lessonId, user.id, score, questions.length);
    } catch {
      setSaveFailed(true);
      setError(text.saveError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
      <h2 className="font-[Space_Grotesk] text-xl font-semibold text-white">{text.title}</h2>
      <p className="mt-1 text-sm text-slate-400">{text.instruction}</p>

      <div className="mt-5 space-y-5">
        {questions.map((question, questionIndex) => (
          <fieldset key={question.id} className="rounded-xl border border-white/10 bg-[#0a0f1d] p-4">
            <legend className="px-1 text-sm font-semibold text-white">
              {questionIndex + 1}. {question.question}
            </legend>
            <div className="mt-2 space-y-2">
              {question.options.map((option, optionIndex) => {
                const selected = answers[question.id] === optionIndex;
                const isCorrect = submitted && optionIndex === question.correctIndex;
                const isWrongSelection = submitted && selected && !isCorrect;
                return (
                  <button
                    key={`${question.id}-${optionIndex}`}
                    type="button"
                    disabled={submitted}
                    aria-pressed={selected}
                    onClick={() => setAnswers(current => ({ ...current, [question.id]: optionIndex }))}
                    className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                      isCorrect
                        ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200'
                        : isWrongSelection
                          ? 'border-rose-400/40 bg-rose-400/10 text-rose-200'
                          : selected
                            ? 'border-neon-cyan/50 bg-neon-cyan/10 text-white'
                            : 'border-white/10 text-slate-300 hover:border-white/25 hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className="mr-2 font-mono text-xs text-slate-500">{String.fromCharCode(65 + optionIndex)}.</span>
                    {option}
                  </button>
                );
              })}
            </div>
            {submitted && (
              <div className={`mt-3 rounded-lg p-3 text-xs ${answers[question.id] === question.correctIndex ? 'bg-emerald-400/5 text-emerald-300' : 'bg-amber-400/5 text-amber-200'}`}>
                <p>{answers[question.id] === question.correctIndex ? text.correct : `${text.incorrect}: ${question.options[question.correctIndex]}`}</p>
                {question.explanation?.trim() && <p className="mt-2 leading-5 text-slate-300"><span className="font-semibold text-white">{text.explanation}:</span> {question.explanation}</p>}
              </div>
            )}
          </fieldset>
        ))}
      </div>

      {!submitted && (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving || loading}
          className="mt-5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-60"
        >
          {text.submit}
        </button>
      )}

      {result && (
        <div className="mt-5 rounded-xl border border-neon-cyan/20 bg-neon-cyan/5 p-4">
          <p className="font-semibold text-white">{text.score}: {result.score}/{result.total} ({result.percentage}%)</p>
          <p className="mt-1 text-sm text-slate-300">{!user ? text.signIn : saving ? text.saving : saveFailed ? text.saveError : text.saved}</p>
        </div>
      )}
      {submitted && questions.some(question => answers[question.id] !== question.correctIndex) && (
        <aside className="mt-5 rounded-xl border border-amber-300/20 bg-amber-300/[0.05] p-4">
          <h3 className="text-sm font-semibold text-amber-100">{text.review}</h3>
          <p className="mt-1 text-xs text-slate-400">{text.reviewIntro}</p>
          <ul className="mt-3 space-y-2">
            {questions.filter(question => answers[question.id] !== question.correctIndex).map(question => <li key={question.id} className="text-xs leading-5 text-slate-300">
              <span className="font-semibold text-white">{question.question}</span>
              {question.explanation?.trim() && <span className="block text-slate-400">{question.explanation}</span>}
            </li>)}
          </ul>
        </aside>
      )}
      {submitted && (
        <button
          type="button"
          onClick={() => {
            setAnswers({});
            setAttemptResult(null);
            setSubmitted(false);
            setSaveFailed(false);
            setError('');
          }}
          disabled={saving}
          className="mt-4 rounded-lg border border-white/15 px-4 py-2 text-sm text-slate-300 hover:border-white/30 disabled:opacity-60"
        >
          {text.retry}
        </button>
      )}
      {loading && !result && <p className="mt-4 text-xs text-slate-500">{text.loading}</p>}
      {error && <p role="alert" className="mt-4 rounded-lg border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-200">{error}</p>}
    </section>
  );
}

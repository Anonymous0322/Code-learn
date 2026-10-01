'use client';

import { useState } from 'react';
import { useCourseStore, CourseItem } from '@/store/courseStore';

export default function AdminCoursesPage() {
  const { courses, addCourse, updateCourse, deleteCourse } = useCourseStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [languageCode, setLanguageCode] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [isActive, setIsActive] = useState(true);
  const [notice, setNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const openAddModal = () => {
    setEditingCourse(null);
    setTitle('');
    setSlug('');
    setLanguageCode('');
    setDescription('');
    setDifficulty('beginner');
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (course: CourseItem) => {
    setEditingCourse(course);
    setTitle(course.title);
    setSlug(course.slug);
    setLanguageCode(course.languageCode);
    setDescription(course.description);
    setDifficulty(course.difficulty);
    setIsActive(course.isActive);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      setNotice({ text: 'Iltimos, barcha majburiy maydonlarni to\'ldiring!', type: 'error' });
      return;
    }

    if (editingCourse) {
      const res = updateCourse(editingCourse.id, {
        title,
        slug: slug.toLowerCase().trim(),
        languageCode: (languageCode || slug).toLowerCase().trim(),
        description,
        difficulty,
        isActive,
      });
      setNotice({ text: res.message, type: 'success' });
    } else {
      const res = addCourse({
        title,
        slug: slug.toLowerCase().trim(),
        languageCode: (languageCode || slug).toLowerCase().trim(),
        description,
        difficulty,
        orderIndex: courses.length,
        isActive,
        levels: [],
      });
      setNotice({ text: res.message, type: 'success' });
    }

    setModalOpen(false);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleDelete = (id: string, courseTitle: string) => {
    if (confirm(`Haqiqatan ham "${courseTitle}" kursini o'chirmoqchimisiz?`)) {
      const res = deleteCourse(id);
      setNotice({ text: res.message, type: 'success' });
      setTimeout(() => setNotice(null), 3000);
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="font-[Space_Grotesk] text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <span>📚</span> Kurslar Boshqaruvi
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Saytdagi barcha dasturlash kurslarini yaratish, tahrirlash va o'chirish
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white text-xs font-bold shadow-lg shadow-neon-blue/20 hover:opacity-95 transition-all flex items-center gap-2 w-fit"
        >
          <span>+</span> Yangi Kurs Qo'shish
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
            placeholder="Kurs nomi yoki slug bo'yicha qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0a0f24] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-neon-cyan/50"
          />
          <span className="absolute left-3 top-2.5 text-xs text-slate-500">🔍</span>
        </div>
        <span className="text-xs text-slate-400">Jami: {filteredCourses.length} ta kurs</span>
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
                    <h3 className="font-bold text-sm text-white">{course.title}</h3>
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
                  {course.isActive ? 'FAOL' : 'NOFAOL'}
                </span>
              </div>

              <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                {course.description}
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase bg-white/5 border border-white/10 text-slate-300 px-2 py-0.5 rounded">
                  {course.difficulty}
                </span>
                <span className="text-[10px] text-slate-400">
                  {course.levels?.length || 0} dars
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(course)}
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium border border-white/10 transition-colors"
                >
                  ✏️ Tahrirlash
                </button>
                <button
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="max-w-lg w-full bg-[#0d132b] border border-white/15 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <h2 className="font-bold text-base text-white">
                {editingCourse ? 'Kursni Tahrirlash' : 'Yangi Kurs Qo\'shish'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Kurs Nomi *</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: JavaScript Asoslari"
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
                  <label className="block text-slate-300 mb-1 font-medium">Til Kodi (masalan: js, py)</label>
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
                <label className="block text-slate-300 mb-1 font-medium">Tavsif (Description)</label>
                <textarea
                  rows={3}
                  placeholder="Ushbu kursda nimalar o'rganiladi..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#060914] border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-neon-cyan resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Murakkablik Darajasi</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-[#060914] border border-white/10 text-white focus:outline-none focus:border-neon-cyan"
                  >
                    <option value="beginner">Boshlang'ich (Beginner)</option>
                    <option value="intermediate">O'rta (Intermediate)</option>
                    <option value="advanced">Ilg'or (Advanced)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Holati</label>
                  <select
                    value={isActive ? 'active' : 'inactive'}
                    onChange={(e) => setIsActive(e.target.value === 'active')}
                    className="w-full px-3 py-2 rounded-xl bg-[#060914] border border-white/10 text-white focus:outline-none focus:border-neon-cyan"
                  >
                    <option value="active">Faol (Active)</option>
                    <option value="inactive">Nofaol (Draft/Inactive)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 hover:border-white/20 text-slate-300"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold shadow-md shadow-neon-blue/20"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useCourseStore, LevelItem } from '@/store/courseStore';

export default function AdminLessonsPage() {
  const { courses, addLevel, updateLevel, deleteLevel } = useCourseStore();
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<LevelItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [notice, setNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const currentCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  const openAddModal = () => {
    setEditingLevel(null);
    setTitle('');
    setDescription('');
    setModalOpen(true);
  };

  const openEditModal = (lvl: LevelItem) => {
    setEditingLevel(lvl);
    setTitle(lvl.title);
    setDescription(lvl.description || '');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setNotice({ text: 'Dars sarlavhasi majburiy!', type: 'error' });
      return;
    }

    if (editingLevel) {
      const res = updateLevel(currentCourse.id, editingLevel.id, {
        title,
        description,
      });
      setNotice({ text: res.message, type: 'success' });
    } else {
      const res = addLevel(currentCourse.id, {
        title,
        description,
        levelIndex: currentCourse.levels?.length || 0,
        orderIndex: currentCourse.levels?.length || 0,
      });
      setNotice({ text: res.message, type: 'success' });
    }

    setModalOpen(false);
    setTimeout(() => setNotice(null), 3000);
  };

  const handleDelete = (levelId: string, levelTitle: string) => {
    if (confirm(`"${levelTitle}" darsini o'chirmoqchimisiz?`)) {
      const res = deleteLevel(currentCourse.id, levelId);
      setNotice({ text: res.message, type: 'success' });
      setTimeout(() => setNotice(null), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="font-[Space_Grotesk] text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <span>📖</span> Darslar va Modullar Boshqaruvi
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Har bir kurs bo'yicha interaktiv darslar va amaliy modullarni boshqarish
          </p>
        </div>

        <button
          onClick={openAddModal}
          disabled={!currentCourse}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white text-xs font-bold shadow-lg shadow-neon-blue/20 hover:opacity-95 transition-all flex items-center gap-2 w-fit"
        >
          <span>+</span> Yangi Dars Qo'shish
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
        <span className="text-xs font-bold text-slate-400 mr-2 whitespace-nowrap">Kursni tanlang:</span>
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
                {currentCourse.title} darslari
              </h2>
              <p className="text-xs text-slate-400">{currentCourse.description}</p>
            </div>
            <span className="text-xs text-neon-cyan font-mono font-bold">
              Jami: {currentCourse.levels?.length || 0} ta dars
            </span>
          </div>

          <div className="space-y-2">
            {(currentCourse.levels || []).map((level, idx) => (
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
                      {level.description || 'Amaliy tushuntirish va kod namunalari'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEditModal(level)}
                    className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium border border-white/10 transition-colors"
                  >
                    ✏️ Tahrirlash
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
                <p className="text-sm text-slate-400 mb-3">Bu kursda hali darslar yo'q.</p>
                <button
                  onClick={openAddModal}
                  className="px-4 py-2 rounded-xl bg-neon-blue/20 text-neon-cyan border border-neon-cyan/40 text-xs font-bold"
                >
                  + Birinchi darsni qo'shish
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-slate-400 text-sm">Kurs tanlanmagan.</p>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="max-w-md w-full bg-[#0d132b] border border-white/15 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <h2 className="font-bold text-base text-white">
                {editingLevel ? 'Darsni Tahrirlash' : 'Yangi Dars Qo\'shish'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Kurs</label>
                <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-bold">
                  {currentCourse.title}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Dars / Modul Sarlavhasi *</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Variables va Data Types"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#060914] border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Dars Tavsifi</label>
                <textarea
                  rows={3}
                  placeholder="Darsda nimalar o'rgatiladi..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#060914] border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-neon-cyan resize-none"
                />
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

'use client';

import { useState } from 'react';
import { useCourseStore } from '@/store/courseStore';
import { useAuthStore } from '@/store/authStore';

export default function AdminSettingsPage() {
  const { resetToDefaults: resetCourses, courses } = useCourseStore();
  const { currentUser } = useAuthStore();
  const [notice, setNotice] = useState<string | null>(null);

  const handleReset = () => {
    if (confirm('Barcha kurs ma\'lumotlarini asl holatiga qaytarishni xohlaysizmi? Qo\'shilgan yangi kurslar o\'chadi.')) {
      resetCourses();
      setNotice('Ma\'lumotlar muvaffaqiyatli asl holatiga qaytarildi!');
      setTimeout(() => setNotice(null), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-4 border-b border-white/10">
        <h1 className="font-[Space_Grotesk] text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
          <span>⚙️</span> Tizim Sozlamalari
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          CodeLearn platformasi ma'lumotlar bazasi va boshqaruv parametrlari
        </p>
      </div>

      {notice && (
        <div className="p-3 rounded-xl text-xs font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 animate-fade-in">
          {notice}
        </div>
      )}

      {/* System info */}
      <div className="p-6 rounded-2xl border border-white/10 bg-[#0a0f24]">
        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <span>ℹ️</span> Tizim Holati
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-slate-400 block mb-1">Platforma versiyasi:</span>
            <span className="text-white font-mono font-bold">CodeLearn v2.4 (Next.js 14)</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-slate-400 block mb-1">Boshqaruvchi:</span>
            <span className="text-neon-cyan font-mono font-bold">{currentUser?.name} ({currentUser?.role?.toUpperCase()})</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-slate-400 block mb-1">Faol Kurslar:</span>
            <span className="text-emerald-400 font-mono font-bold">{courses.length} ta</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-slate-400 block mb-1">Ma'lumotlar bazasi:</span>
            <span className="text-purple-300 font-mono font-bold">Sinxronlashtirilgan (Auto-storage)</span>
          </div>
        </div>
      </div>

      {/* Reset data */}
      <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/[0.02]">
        <h2 className="text-sm font-bold text-red-400 mb-2 flex items-center gap-2">
          <span>⚠️</span> Xavfli Hudud
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Agar test jarayonida biron ma'lumotni noto'g'ri o'zgartirgan bo'lsangiz, tizimdagi barcha kurslarni boshlang'ich standart holatiga qaytarishingiz mumkin.
        </p>

        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-bold transition-all"
        >
          Kurslarni Boshlang'ich Holatga Qaytarish
        </button>
      </div>
    </div>
  );
}

'use client';

import { useCourseStore } from '@/store/courseStore';
import { useAuthStore } from '@/store/authStore';
import { useI18n } from '@/components/providers';

export default function AdminSettingsPage() {
  const courses = useCourseStore(state => state.courses);
  const syncError = useCourseStore(state => state.syncError);
  const coursesInitialized = useCourseStore(state => state.initialized);
  const { currentUser } = useAuthStore();
  const { tr } = useI18n();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-4 border-b border-white/10">
        <h1 className="font-[Space_Grotesk] text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
          <span>⚙️</span> {tr('Tizim sozlamalari', 'Настройки системы', 'System settings')}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {tr('CodeLearn platformasi va ma’lumotlar bazasi holati.', 'Состояние платформы CodeLearn и базы данных.', 'CodeLearn platform and database status.')}
        </p>
      </div>

      {/* System info */}
      <div className="p-6 rounded-2xl border border-white/10 bg-[#0a0f24]">
        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <span>ℹ️</span> {tr('Tizim holati', 'Состояние системы', 'System status')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-slate-400 block mb-1">{tr('Platforma:', 'Платформа:', 'Platform:')}</span>
            <span className="text-white font-mono font-bold">CodeLearn</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-slate-400 block mb-1">{tr('Boshqaruvchi:', 'Администратор:', 'Administrator:')}</span>
            <span className="text-neon-cyan font-mono font-bold">{currentUser?.name} ({currentUser?.role?.toUpperCase()})</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-slate-400 block mb-1">{tr('Faol kurslar:', 'Активные курсы:', 'Active courses:')}</span>
            <span className="text-emerald-400 font-mono font-bold">{courses.filter(course => course.isActive).length}</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-slate-400 block mb-1">{tr('Ma’lumotlar bazasi:', 'База данных:', 'Database:')}</span>
            <span className={`font-mono font-bold ${syncError ? 'text-red-300' : 'text-purple-300'}`}>{syncError ? tr('Ulanish xatosi', 'Ошибка подключения', 'Connection error') : coursesInitialized ? tr('Supabase bilan ulangan', 'Подключено к Supabase', 'Connected to Supabase') : tr('Supabase’ga ulanmoqda...', 'Подключение к Supabase...', 'Connecting to Supabase...')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

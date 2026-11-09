'use client';

import Link from 'next/link';
import { useI18n } from '@/components/providers';
import { useAuthStore } from '@/store/authStore';
import { useCourseStore } from '@/store/courseStore';
import { AnimatedNumber } from '@/components/AnimatedNumber';

export default function AdminDashboardPage() {
  const { currentUser, users } = useAuthStore();
  const { courses } = useCourseStore();
  const { tr, language } = useI18n();

  const totalLessons = courses.reduce((acc, c) => acc + (c.levels?.length || 0), 0);
  const totalUsers = users.length;
  const adminUsers = users.filter((u) => u.role === 'admin' || u.role === 'creator');
  const studentUsers = users.filter((u) => u.role === 'user');

  const stats = [
    {
      label: tr('Jami kurslar', 'Всего курсов', 'Total courses'),
      value: courses.length,
      icon: '📚',
      sub: `${courses.filter((c) => c.isActive).length} ${tr('ta faol kurs', 'активных курсов', 'active courses')}`,
      color: 'from-blue-500/20 to-cyan-500/20 text-neon-cyan border-cyan-500/30',
    },
    {
      label: tr('Jami darslar va modullar', 'Всего уроков и модулей', 'Total lessons and modules'),
      value: totalLessons,
      icon: '📖',
      sub: tr('Interaktiv darslar', 'Интерактивные уроки', 'Interactive lessons'),
      color: 'from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30',
    },
    {
      label: tr('Jami foydalanuvçilar', 'Всего пользователей', 'Total users'),
      value: totalUsers,
      icon: '👥',
      sub: `${studentUsers.length} ${tr('o‘quvchi ro‘yxatda', 'учащихся', 'learners')}`,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      label: tr('Administratorlar', 'Администраторы', 'Administrators'),
      value: adminUsers.length,
      icon: '👑',
      sub: tr('Creator va Adminlar', 'Создатели и администраторы', 'Creators and admins'),
      color: 'from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-5 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:pb-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-widest text-neon-cyan font-mono font-bold">
              {tr('Boşqaruv paneli', 'Панель управления', 'Dashboard')}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">{tr('Tizim boşqaruvi', 'Управление системой', 'System management')}</span>
          </div>
          <h1 className="break-words font-[Space_Grotesk] text-2xl font-bold text-white sm:text-4xl">
            {tr('Xuş kelibsiz', 'Добро пожаловать', 'Welcome')}, {currentUser?.name}!
          </h1>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-400 sm:text-sm">
            {tr('Bu panelda kurslar, darslar, foydalanuvçilar va rollarni boşqarişingiz mumkin.', 'Здесь можно управлять курсами, уроками, пользователями и ролями.', 'Manage courses, lessons, users, and roles from this dashboard.')}
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:w-auto">
          <Link
            href="/admin/courses"
            className="flex min-h-11 items-center justify-center rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple px-3 py-2.5 text-center text-xs font-bold text-white shadow-lg shadow-neon-blue/20 transition-all hover:opacity-95 sm:px-4"
          >
            + {tr('Kurs qöşiş', 'Добавить курс', 'Add course')}
          </Link>
          <Link
            href="/admin/users"
            className="flex min-h-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.05] px-3 py-2.5 text-center text-xs font-semibold text-slate-200 transition-all hover:border-neon-cyan/40 sm:px-4"
          >
            👥 {tr('Rollarni boşqariş', 'Управление ролями', 'Manage roles')}
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`min-w-0 rounded-2xl border bg-gradient-to-br p-3.5 shadow-lg backdrop-blur-xl sm:p-5 ${stat.color}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-lg sm:text-2xl">{stat.icon}</span>
              <span className="text-2xl font-extrabold text-white font-[Space_Grotesk] sm:text-3xl">
                <AnimatedNumber value={stat.value} locale={language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US'} />
              </span>
            </div>
            <p className="mt-3 break-words text-[10px] font-bold leading-4 text-white sm:text-xs">{stat.label}</p>
            <p className="mt-0.5 break-words text-[9px] leading-4 text-slate-400 sm:text-[11px]">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Role Hierarchy Card */}
      <div className="rounded-2xl border border-white/10 bg-[#0a0f24]/80 p-4 backdrop-blur-xl sm:p-6">
        <h2 className="mb-2 flex items-center gap-2 text-base font-bold text-white sm:mb-3 sm:text-lg">
          <span>🏛️</span> {tr('Rollar va ruxsatlar', 'Роли и права доступа', 'Roles and permissions')}
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          {tr('Tizimda vakolatlari farq qiluvçi uçta asosiy rol mavjud:', 'В системе есть три основные роли с разными уровнями доступа:', 'The system has three main roles with different access levels:')}
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 sm:gap-4">
          {/* Creator */}
          <div className="p-4 rounded-xl border border-purple-500/40 bg-purple-500/10">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-purple-200 flex items-center gap-1.5">
                <span>👑</span> {tr('Yaratuvçi (Creator)', 'Создатель (Creator)', 'Creator')}
              </span>
              <span className="text-[10px] bg-purple-500/30 text-purple-300 font-mono font-bold px-2 py-0.5 rounded">
                {tr('ENG YUQORI', 'ВЫСШИЙ', 'HIGHEST')}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {tr('Barça ruxsatlar: kurs va darslarni boşqariş hamda istalgan foydalanuvçining rolini özgartiriş.', 'Полный доступ: управление курсами и уроками, изменение роли любого пользователя.', 'Full access: manage courses and lessons, and change any user’s role.')}
            </p>
          </div>

          {/* Admin */}
          <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/10">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-blue-200 flex items-center gap-1.5">
                <span>🛡️</span> {tr('Administrator', 'Администратор', 'Administrator')}
              </span>
              <span className="text-[10px] bg-blue-500/30 text-blue-300 font-mono font-bold px-2 py-0.5 rounded">
                {tr('ORTA', 'СРЕДНИЙ', 'MEDIUM')}
              </span>
            </div>
            <p className="text-xs text-slate-300">
              {tr('Kurslar, modullar va darslarni boşqaradi. Foydalanuvçilar rollarini özgartira olmaydi.', 'Управляет курсами, модулями и уроками, но не может менять роли пользователей.', 'Manages courses, modules, and lessons, but cannot change user roles.')}
            </p>
          </div>

          {/* User */}
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-slate-300 flex items-center gap-1.5">
                <span>👤</span> {tr('Foydalanuvçi', 'Пользователь', 'User')}
              </span>
              <span className="text-[10px] bg-white/10 text-slate-400 font-mono px-2 py-0.5 rounded">
                {tr('ODDIY', 'ОБЫЧНЫЙ', 'STANDARD')}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {tr('Kurslarni örganadi va kod maşqlarini bajaradi. Admin panelga kira olmaydi.', 'Изучает курсы и практикуется в коде. Нет доступа к панели администратора.', 'Learns courses and practices coding. No access to the admin panel.')}
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Courses & Users */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 sm:gap-6">
        {/* Kurslar ro'yxati */}
        <div className="min-w-0 rounded-2xl border border-white/10 bg-[#0a0f24]/80 p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h3 className="flex items-center gap-2 text-sm font-bold text-white">
              <span>📚</span> {tr('Mavjud kurslar', 'Доступные курсы', 'Available courses')} ({courses.length})
            </h3>
            <Link href="/admin/courses" className="text-xs text-neon-cyan hover:underline">
              {tr('Barçasini boşqariş', 'Управлять всеми', 'Manage all')} →
            </Link>
          </div>

          <div className="space-y-2">
            {courses.slice(0, 4).map((c) => (
              <div
                key={c.id}
                className="flex min-w-0 items-center justify-between gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-all hover:border-white/15"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neon-blue/15 border border-neon-cyan/30 flex items-center justify-center font-mono font-bold text-xs text-neon-cyan uppercase">
                    {c.languageCode.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{c.translations?.[language]?.title || c.title}</p>
                    <p className="text-[10px] text-slate-400">{c.levels?.length || 0} {tr('ta dars/modul', 'уроков/модулей', 'lessons/modules')}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  {c.difficulty === 'beginner' ? tr('Boşlanğiç', 'Начальный', 'Beginner') : c.difficulty === 'intermediate' ? tr('Örta', 'Средний', 'Intermediate') : tr('Yuqori', 'Продвинутый', 'Advanced')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Foydalanuvchilar */}
        <div className="p-5 rounded-2xl border border-white/10 bg-[#0a0f24]/80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <span>👥</span> {tr('Foydalanuvçilar', 'Пользователи', 'Users')} ({users.length})
            </h3>
            <Link href="/admin/users" className="text-xs text-neon-cyan hover:underline">
              {tr('Rollarni özgartiriş', 'Изменить роли', 'Change roles')} →
            </Link>
          </div>

          <div className="space-y-2">
            {users.slice(0, 4).map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white uppercase">
                    {u.name.slice(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-white">{u.name}</p>
                    <p className="max-w-40 truncate text-[10px] text-slate-400 sm:max-w-none">{u.email}</p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    u.role === 'creator'
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                      : u.role === 'admin'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                      : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {u.role === 'creator' ? tr('YARATUVÇI', 'СОЗДАТЕЛЬ', 'CREATOR') : u.role === 'admin' ? tr('ADMIN', 'АДМИН', 'ADMIN') : tr('FOYDALANUVÇI', 'ПОЛЬЗОВАТЕЛЬ', 'USER')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

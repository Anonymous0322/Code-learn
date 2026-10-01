'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useCourseStore } from '@/store/courseStore';

export default function AdminDashboardPage() {
  const { currentUser, users } = useAuthStore();
  const { courses } = useCourseStore();

  const totalLessons = courses.reduce((acc, c) => acc + (c.levels?.length || 0), 0);
  const totalUsers = users.length;
  const adminUsers = users.filter((u) => u.role === 'admin' || u.role === 'creator');
  const studentUsers = users.filter((u) => u.role === 'user');

  const stats = [
    {
      label: 'Jami Kurslar',
      value: courses.length,
      icon: '📚',
      sub: `${courses.filter((c) => c.isActive).length} ta faol kurs`,
      color: 'from-blue-500/20 to-cyan-500/20 text-neon-cyan border-cyan-500/30',
    },
    {
      label: 'Jami Darslar & Modullar',
      value: totalLessons,
      icon: '📖',
      sub: 'Interaktiv darslar',
      color: 'from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30',
    },
    {
      label: 'Jami Foydalanuvchilar',
      value: totalUsers,
      icon: '👥',
      sub: `${studentUsers.length} o'quvchi ro'yxatda`,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      label: 'Boshqaruvchilar',
      value: adminUsers.length,
      icon: '👑',
      sub: 'Creator va Adminlar',
      color: 'from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-widest text-neon-cyan font-mono font-bold">
              Boshqaruv Paneli
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">Avtomatlashtirilgan tizim</span>
          </div>
          <h1 className="font-[Space_Grotesk] text-3xl sm:text-4xl font-bold text-white">
            Xush kelibsiz, {currentUser?.name}!
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Ushbu panel orqali saytdagi barcha kurslar, darslar, foydalanuvchilar va rollarni to'liq boshqara olasiz.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/courses"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white text-xs font-bold shadow-lg shadow-neon-blue/20 hover:opacity-95 transition-all"
          >
            + Yangi Kurs Qo'shish
          </Link>
          <Link
            href="/admin/users"
            className="px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 hover:border-neon-cyan/40 text-slate-200 text-xs font-semibold transition-all"
          >
            👥 Rollarni Boshqarish
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`p-5 rounded-2xl bg-gradient-to-br ${stat.color} border backdrop-blur-xl shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-3xl font-extrabold text-white font-[Space_Grotesk]">
                {stat.value}
              </span>
            </div>
            <p className="text-xs font-bold text-white mt-3">{stat.label}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Role Hierarchy Card */}
      <div className="p-6 rounded-2xl border border-white/10 bg-[#0a0f24]/80 backdrop-blur-xl">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
          <span>🏛️</span> Rollar Tizimi va Vakolatlar Ierarxiyasi
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Tizimda 3 ta asosiy rol mavjud bo'lib, ular vakolat darajasiga ko'ra avtomatik chegaralangan:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Creator */}
          <div className="p-4 rounded-xl border border-purple-500/40 bg-purple-500/10">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-purple-200 flex items-center gap-1.5">
                <span>👑</span> Bosh Admin (Creator)
              </span>
              <span className="text-[10px] bg-purple-500/30 text-purple-300 font-mono font-bold px-2 py-0.5 rounded">
                ENG YUQORI
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Mutlaq barcha vakolatlar: kurs va darslarni boshqarish, yangi adminlar tayinlash, boshqa foydalanuvchilarning rolini o'zgartirish, administratorlarni o'chirish.
            </p>
          </div>

          {/* Admin */}
          <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/10">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-blue-200 flex items-center gap-1.5">
                <span>🛡️</span> Admin (Nazoratchi)
              </span>
              <span className="text-[10px] bg-blue-500/30 text-blue-300 font-mono font-bold px-2 py-0.5 rounded">
                ORTA
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Kurslar, modullar va darslarni qo'shish, tahrirlash, o'chirish huquqi. Lekin Bosh Adminni (Creator) o'chira yoki uning rolini o'zgartira olmaydi.
            </p>
          </div>

          {/* User */}
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-slate-300 flex items-center gap-1.5">
                <span>👤</span> Foydalanuvchi (User)
              </span>
              <span className="text-[10px] bg-white/10 text-slate-400 font-mono px-2 py-0.5 rounded">
                ODDIY
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Saytdan o'rganish, darslarni o'tish va kod mashq qilish. Admin panelga kirishi taqiqlangan (403 Forbidden).
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Courses & Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kurslar ro'yxati */}
        <div className="p-5 rounded-2xl border border-white/10 bg-[#0a0f24]/80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <span>📚</span> Mavjud Kurslar ({courses.length})
            </h3>
            <Link href="/admin/courses" className="text-xs text-neon-cyan hover:underline">
              Barchasini boshqarish →
            </Link>
          </div>

          <div className="space-y-2">
            {courses.slice(0, 4).map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neon-blue/15 border border-neon-cyan/30 flex items-center justify-center font-mono font-bold text-xs text-neon-cyan uppercase">
                    {c.languageCode.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{c.title}</p>
                    <p className="text-[10px] text-slate-400">{c.levels?.length || 0} ta dars/modul</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  {c.difficulty}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Foydalanuvchilar */}
        <div className="p-5 rounded-2xl border border-white/10 bg-[#0a0f24]/80">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <span>👥</span> Foydalanuvchilar ({users.length})
            </h3>
            <Link href="/admin/users" className="text-xs text-neon-cyan hover:underline">
              Rollarni o'zgartirish →
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
                  <div>
                    <p className="text-xs font-bold text-white">{u.name}</p>
                    <p className="text-[10px] text-slate-400">{u.email}</p>
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
                  {u.role.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

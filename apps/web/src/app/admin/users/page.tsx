'use client';

import { useState } from 'react';
import { useI18n } from '@/components/providers';
import { useAuthStore, UserRole } from '@/store/authStore';

export default function AdminUsersPage() {
  const { currentUser, users, updateUserRole, toggleUserStatus } = useAuthStore();
  const { tr, language } = useI18n();
  const dateLocale = language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US';
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [notice, setNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const isCurrentCreator = currentUser?.role === 'creator';
  const roleFilters: { id: 'all' | UserRole; label: string }[] = [
    { id: 'all', label: tr('Barchasi', 'Все', 'All') },
    { id: 'creator', label: tr('Yaratuvchi', 'Создатели', 'Creators') },
    { id: 'admin', label: tr('Administrator', 'Администраторы', 'Admins') },
    { id: 'user', label: tr('Foydalanuvchi', 'Пользователи', 'Users') },
  ];

  const handleRoleChange = async (userId: string, selectedRole: UserRole) => {
    const res = await updateUserRole(userId, selectedRole);
    const roleLabel = selectedRole === 'creator' ? 'Creator' : selectedRole === 'admin' ? 'Admin' : tr('Foydalanuvchi', 'Пользователь', 'User');
    setNotice({
      text: res.success
        ? tr(`Rol muvaffaqiyatli o‘zgartirildi: ${roleLabel}`, `Роль изменена: ${roleLabel}`, `Role updated: ${roleLabel}`)
        : res.message,
      type: res.success ? 'success' : 'error',
    });
    setTimeout(() => setNotice(null), 3500);
  };

  const handleStatusToggle = async (userId: string) => {
    const res = await toggleUserStatus(userId);
    setNotice({
      text: res.success
        ? tr(
            `Foydalanuvchi holati yangilandi: ${res.message.endsWith('Faol') ? 'Faol' : 'Bloklangan'}`,
            `Статус пользователя обновлён: ${res.message.endsWith('Faol') ? 'Активен' : 'Заблокирован'}`,
            `User status updated: ${res.message.endsWith('Faol') ? 'Active' : 'Banned'}`
          )
        : res.message,
      type: res.success ? 'success' : 'error',
    });
    setTimeout(() => setNotice(null), 3000);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="font-[Space_Grotesk] text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
            <span>👥</span> {tr('Foydalanuvchilar va rollarni boshqarish', 'Управление пользователями и ролями', 'Manage users and roles')}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {tr('Foydalanuvchilarga rol bering, holati va hisoblarini boshqaring.', 'Назначайте роли и управляйте статусами и аккаунтами пользователей.', 'Assign roles and manage user statuses and accounts.')}
          </p>
        </div>

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
          <button onClick={() => setNotice(null)} className="text-slate-400 hover:text-white">×</button>
        </div>
      )}

      {/* Role permission info banner */}
      <div className="p-4 rounded-xl border border-white/10 bg-[#0a0f24] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{isCurrentCreator ? '👑' : '🛡️'}</span>
          <div>
            <p className="text-xs font-bold text-white">
              {tr('Sizning rolingiz:', 'Ваша роль:', 'Your role:')} {isCurrentCreator ? 'Creator' : 'Admin'}
            </p>
            <p className="text-[11px] text-slate-400">
              {isCurrentCreator
                ? tr('Siz istalgan hisobga Creator, Admin yoki User rolini bera olasiz.', 'Вы можете назначить любой учётной записи роль Creator, Admin или User.', 'You can assign Creator, Admin, or User to any account.')
                : tr('Rollarni faqat Creator o‘zgartira oladi.', 'Изменять роли может только Creator.', 'Only a Creator can change roles.')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-mono">
          <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
            CREATOR &gt; ADMIN &gt; USER
          </span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder={tr('Ism yoki email bo‘yicha qidirish...', 'Поиск по имени или email...', 'Search by name or email...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0a0f24] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-neon-cyan/50"
          />
          <span className="absolute left-3 top-2.5 text-xs text-slate-500">🔍</span>
        </div>

        <div className="flex items-center gap-1 bg-[#0a0f24] p-1 rounded-xl border border-white/10 self-start sm:self-auto">
          {roleFilters.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                roleFilter === tab.id
                  ? 'bg-neon-blue/20 text-neon-cyan font-bold border border-neon-cyan/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0a0f24]/90 backdrop-blur-xl">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-mono uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3.5 px-4">{tr('Foydalanuvchi', 'Пользователь', 'User')}</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">{tr('Joriy roli', 'Текущая роль', 'Current role')}</th>
              <th className="py-3.5 px-4">{tr('Rol tayinlash', 'Назначить роль', 'Assign role')}</th>
              <th className="py-3.5 px-4">{tr('Holati', 'Статус', 'Status')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredUsers.map((user) => {
              const isTargetCreator = user.role === 'creator';
              const isSelf = user.id === currentUser?.id;

              return (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                  {/* Name */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold uppercase ${
                          user.role === 'creator'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            : user.role === 'admin'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                            : 'bg-white/10 text-slate-300'
                        }`}
                      >
                        {user.name.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-bold text-white flex items-center gap-1.5">
                          {user.name}
                          {isSelf && (
                            <span className="text-[9px] bg-white/10 text-slate-400 px-1.5 py-0.2 rounded">
                              {tr('Siz', 'Вы', 'You')}
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-slate-500">{tr('Ro‘yxatdan o‘tgan:', 'Дата регистрации:', 'Joined:')} {new Date(user.createdAt).toLocaleDateString(dateLocale)}</p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-3.5 px-4 font-mono text-slate-300">{user.email}</td>

                  {/* Current Role Badge */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                        user.role === 'creator'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-500/20'
                          : user.role === 'admin'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : 'bg-white/10 text-slate-400 border border-white/10'
                      }`}
                    >
                      <span>{user.role === 'creator' ? '👑' : user.role === 'admin' ? '🛡️' : '👤'}</span>
                      <span>{user.role === 'creator' ? tr('CREATOR', 'СОЗДАТЕЛЬ', 'CREATOR') : user.role === 'admin' ? tr('ADMINISTRATOR', 'АДМИНИСТРАТОР', 'ADMIN') : tr('FOYDALANUVCHI', 'ПОЛЬЗОВАТЕЛЬ', 'USER')}</span>
                    </span>
                  </td>

                  {/* Role Assignment Dropdown */}
                  <td className="py-3.5 px-4">
                    {isCurrentCreator ? (
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#060914] border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-neon-cyan cursor-pointer"
                      >
                        <option value="user">{tr('Foydalanuvchi — kurslarni o‘rganadi', 'Пользователь — изучает курсы', 'User — learns courses')}</option>
                        <option value="admin">{tr('Administrator — kurs va darslarni boshqaradi', 'Администратор — управляет курсами и уроками', 'Admin — manages courses and lessons')}</option>
                        <option value="creator">{tr('Creator — barcha rollarni boshqaradi', 'Создатель — управляет всеми ролями', 'Creator — manages all roles')}</option>
                      </select>
                    ) : (
                      <span className="text-[11px] text-slate-500 italic">
                        {tr('Faqat Creator o‘zgartiradi', 'Изменить может только Creator', 'Only a Creator can change roles')}
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleStatusToggle(user.id)}
                      disabled={isTargetCreator || (!isCurrentCreator && user.role === 'admin')}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border transition-colors ${
                        user.status === 'active'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                          : 'bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25'
                      } ${isTargetCreator ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                    >
                      {user.status === 'active' ? `✓ ${tr('FAOL', 'АКТИВЕН', 'ACTIVE')}` : `× ${tr('BLOKLANGAN', 'ЗАБЛОКИРОВАН', 'BANNED')}`}
                    </button>
                  </td>

                  
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-xs">
            {tr('Qidiruv bo‘yicha foydalanuvchi topilmadi.', 'Пользователи не найдены.', 'No users found.')}
          </div>
        )}
      </div>

      {/* Modal: Add User */}
    </div>
  );
}

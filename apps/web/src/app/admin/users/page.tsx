'use client';

import { useState } from 'react';
import { useAuthStore, UserRole } from '@/store/authStore';

export default function AdminUsersPage() {
  const { currentUser, users, updateUserRole, toggleUserStatus, deleteUser, addUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('user');
  const [notice, setNotice] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const isCurrentCreator = currentUser?.role === 'creator';

  const handleRoleChange = (userId: string, selectedRole: UserRole) => {
    const res = updateUserRole(userId, selectedRole);
    setNotice({ text: res.message, type: res.success ? 'success' : 'error' });
    setTimeout(() => setNotice(null), 3500);
  };

  const handleStatusToggle = (userId: string) => {
    const res = toggleUserStatus(userId);
    setNotice({ text: res.message, type: res.success ? 'success' : 'error' });
    setTimeout(() => setNotice(null), 3000);
  };

  const handleDelete = (userId: string, userName: string) => {
    if (confirm(`Haqiqatan ham "${userName}" foydalanuvchisini tizimdan butunlay o'chirmoqchimisiz?`)) {
      const res = deleteUser(userId);
      setNotice({ text: res.message, type: res.success ? 'success' : 'error' });
      setTimeout(() => setNotice(null), 3000);
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      setNotice({ text: 'Ism va email kiritilishi shart!', type: 'error' });
      return;
    }

    const res = addUser({
      name: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      role: newRole,
      status: 'active',
    });

    setNotice({ text: res.message, type: res.success ? 'success' : 'error' });
    if (res.success) {
      setNewName('');
      setNewEmail('');
      setNewRole('user');
      setModalOpen(false);
    }
    setTimeout(() => setNotice(null), 3500);
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
            <span>👥</span> Foydalanuvchilar va Rollarni Boshqarish
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Foydalanuvchilarga rol berish (Creator, Admin, User), holatlarini va hisoblarini boshqarish
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white text-xs font-bold shadow-lg shadow-neon-blue/20 hover:opacity-95 transition-all flex items-center gap-2 w-fit"
        >
          <span>+</span> Yangi Foydalanuvchi
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

      {/* Role permission info banner */}
      <div className="p-4 rounded-xl border border-white/10 bg-[#0a0f24] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{isCurrentCreator ? '👑' : '🛡️'}</span>
          <div>
            <p className="text-xs font-bold text-white">
              Sizning darajangiz: {isCurrentCreator ? 'Bosh Admin (Creator)' : 'Admin'}
            </p>
            <p className="text-[11px] text-slate-400">
              {isCurrentCreator
                ? 'Siz Bosh Adminsiz! Har qanday foydalanuvchiga Creator, Admin yoki User rolini bera olasiz.'
                : 'Siz Adminsiz. Rol berish vakolati faqat Bosh Admin (Creator) ga tegishli.'}
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
            placeholder="Ism yoki email bo'yicha qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#0a0f24] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-neon-cyan/50"
          />
          <span className="absolute left-3 top-2.5 text-xs text-slate-500">🔍</span>
        </div>

        <div className="flex items-center gap-1 bg-[#0a0f24] p-1 rounded-xl border border-white/10 self-start sm:self-auto">
          {[
            { id: 'all', label: 'Barchasi' },
            { id: 'creator', label: '👑 Creator' },
            { id: 'admin', label: '🛡️ Admin' },
            { id: 'user', label: '👤 User' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id as any)}
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
              <th className="py-3.5 px-4">Foydalanuvchi</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Joriy Roli</th>
              <th className="py-3.5 px-4">Rol Tayinlash</th>
              <th className="py-3.5 px-4">Holati</th>
              <th className="py-3.5 px-4 text-right">Amallar</th>
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
                              Siz
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-slate-500">{user.createdAt} da qo'shilgan</p>
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
                      <span>{user.role === 'creator' ? 'CREATOR (BOSH)' : user.role === 'admin' ? 'ADMIN' : 'USER'}</span>
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
                        <option value="user">👤 User (Oddiy)</option>
                        <option value="admin">🛡️ Admin (Nazoratchi)</option>
                        <option value="creator">👑 Creator (Bosh Admin)</option>
                      </select>
                    ) : (
                      <span className="text-[11px] text-slate-500 italic">
                        {isTargetCreator ? 'Creator (o\'zgarmas)' : 'Faqat Creator o\'zgartiradi'}
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
                      {user.status === 'active' ? '✓ FAOL' : '✕ BLOKLANGAN'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    {isCurrentCreator && !isSelf && (
                      <button
                        onClick={() => handleDelete(user.id, user.name)}
                        className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 transition-colors"
                        title="O'chirish"
                      >
                        🗑️ O'chirish
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-xs">
            Qidiruv bo'yicha hech qanday foydalanuvchi topilmadi.
          </div>
        )}
      </div>

      {/* Modal: Add User */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="max-w-md w-full bg-[#0d132b] border border-white/15 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
              <h2 className="font-bold text-base text-white">Yangi Foydalanuvchi Qo'shish</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">To'liq Ism *</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Sardor Rahimov"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#060914] border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Email Manzili *</label>
                <input
                  type="email"
                  required
                  placeholder="sardor@codelearn.uz"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#060914] border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Tayinlanadigan Rol *</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-xl bg-[#060914] border border-white/10 text-white focus:outline-none focus:border-neon-cyan"
                >
                  <option value="user">👤 User (Oddiy Foydalanuvchi)</option>
                  <option value="admin">🛡️ Admin (Nazoratchi)</option>
                  {isCurrentCreator && <option value="creator">👑 Creator (Bosh Admin)</option>}
                </select>
                <p className="text-[10px] text-slate-500 mt-1">
                  Eslatma: Creator roliga faqat eng katta bosh adminlar tayinlanadi.
                </p>
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
                  Qo'shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

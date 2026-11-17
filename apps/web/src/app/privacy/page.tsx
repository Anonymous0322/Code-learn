import Link from 'next/link';

export default function PrivacyPage() {
  return <main className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">CodeLearn</p>
    <h1 className="mt-3 font-[Space_Grotesk] text-4xl font-bold text-white">Maxfiylik siyosati</h1>
    <p className="mt-3 text-sm text-slate-400">Boshlang‘ich loyiha · O‘zbekiston · Oxirgi yangilanish: 2026-yil 17-noyabr</p>
    <div className="mt-8 space-y-6 text-sm leading-7 text-slate-300">
      <section><h2 className="text-lg font-semibold text-white">Qanday ma’lumotlar olinadi?</h2><p className="mt-2">Hisob ochish va xizmatdan foydalanish uchun profilingiz (ism, email, avatar), o‘quv jarayoni, test natijalari va forumdagi yozuvlaringiz saqlanishi mumkin. Xizmat Supabase infratuzilmasidan foydalanadi.</p></section>
      <section><h2 className="text-lg font-semibold text-white">Ixtiyoriy analitika</h2><p className="mt-2">Faqat alohida rozilik berganingizdan keyin ro‘yxatdan o‘tish, dars boshlash/yakunlash, kursni tugatish va haftalik qaytish kabi hodisalar qayd qilinadi. Analitika jadvalida ism yoki email saqlanmaydi; takrorlarni sanash uchun qaytarib bog‘lash mo‘ljallanmagan psevdonim kalit ishlatiladi. Administratorlarga faqat jamlangan ko‘rsatkichlar ko‘rsatiladi. Rozilikni Sozlamalar’dan bekor qilish mumkin; bunda avvalgi analitika hodisalari ham o‘chiriladi.</p></section>
      <section><h2 className="text-lg font-semibold text-white">Ma’lumotlarni boshqarish</h2><p className="mt-2">Sozlamalar sahifasidan ma’lumotlaringizni JSON ko‘rinishida eksport qilishingiz yoki hisobni o‘chirishni so‘rashingiz mumkin. O‘chirish 30 kun ichida bajariladi va shu vaqt ichida so‘rovni bekor qilish mumkin. Huquqiy yoki texnik istisnolar bo‘lishi mumkin.</p></section>
      <section><h2 className="text-lg font-semibold text-white">Saqlash va himoya</h2><p className="mt-2">Ma’lumotlar xizmatni taqdim etish, xavfsizlikni saqlash va qonuniy majburiyatlarni bajarish uchun zarur muddat davomida qayta ishlanadi. Ma’lumotlarga kirish rolga asoslangan cheklovlar bilan himoyalanadi.</p></section>
      <section><h2 className="text-lg font-semibold text-white">Aloqa</h2><p className="mt-2">Maxfiylik va yordam bo‘yicha <a className="text-cyan-300 underline" href="mailto:ruhiddinov03@gmail.com">ruhiddinov03@gmail.com</a> manziliga yozing.</p></section>
      <p className="rounded-xl border border-amber-300/15 bg-amber-300/[0.04] p-4 text-amber-100">Ushbu matn boshlang‘ich loyiha bo‘lib, yuridik maslahat hisoblanmaydi. O‘zbekiston qonunchiligiga muvofiqligini yurist bilan tekshirtiring.</p>
    </div>
    <Link href="/" className="mt-8 inline-flex text-sm text-cyan-300 hover:underline">← Bosh sahifa</Link>
  </main>;
}

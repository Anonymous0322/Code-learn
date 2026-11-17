import Link from 'next/link';

export default function TermsPage() {
  return <main className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">CodeLearn</p>
    <h1 className="mt-3 font-[Space_Grotesk] text-4xl font-bold text-white">Foydalanish shartlari</h1>
    <p className="mt-3 text-sm text-slate-400">Boshlang‘ich loyiha · O‘zbekiston · Oxirgi yangilanish: 2026-yil 17-noyabr</p>
    <div className="mt-8 space-y-6 text-sm leading-7 text-slate-300">
      <section><h2 className="text-lg font-semibold text-white">Xizmatdan foydalanish</h2><p className="mt-2">CodeLearn dasturlashni o‘rganish uchun ta’limiy materiallar, kurslar va hamjamiyat imkoniyatlarini taqdim etadi. Hisob ma’lumotlaringizni himoya qilish va profilingizdagi ma’lumotlarni to‘g‘ri saqlash sizning mas’uliyatingizdir.</p></section>
      <section><h2 className="text-lg font-semibold text-white">Hamjamiyat qoidalari</h2><p className="mt-2">Hurmat bilan muloqot qiling. Spam, tahdid, haqorat, noqonuniy kontent va boshqa foydalanuvchilarning huquqlarini buzuvchi materiallarni joylamang. Forumdagi kontent xabar qilinishi va tekshiruv vaqtida yashirilishi mumkin.</p></section>
      <section><h2 className="text-lg font-semibold text-white">Hisob va kontent</h2><p className="mt-2">Xavfsizlik yoki qoidabuzarlik holatlarida ayrim funksiyalar cheklanishi mumkin. O‘zingiz joylagan kontent uchun javobgarsiz va uni joylash uchun zarur huquqlarga ega bo‘lishingiz kerak.</p></section>
      <section><h2 className="text-lg font-semibold text-white">Xizmatning mavjudligi</h2><p className="mt-2">Xizmatni yaxshilash, ta’mirlash yoki xavfsizlik sababli ayrim imkoniyatlar vaqtincha o‘zgarishi yoki ishlamasligi mumkin. Muhim o‘zgarishlar e’lon qilinadi.</p></section>
      <section><h2 className="text-lg font-semibold text-white">Aloqa</h2><p className="mt-2">Savollar bo‘yicha <a className="text-cyan-300 underline" href="mailto:ruhiddinov03@gmail.com">ruhiddinov03@gmail.com</a> manziliga murojaat qiling.</p></section>
      <p className="rounded-xl border border-amber-300/15 bg-amber-300/[0.04] p-4 text-amber-100">Ushbu shartlar boshlang‘ich loyiha bo‘lib, yuridik maslahat hisoblanmaydi. Nashrdan oldin yurist bilan tekshiring.</p>
    </div>
    <Link href="/" className="mt-8 inline-flex text-sm text-cyan-300 hover:underline">← Bosh sahifa</Link>
  </main>;
}

import Link from 'next/link';

const laws = [
  { title: '“Elektron tijorat to‘g‘risida”gi Qonun, O‘RQ-792', href: 'https://lex.uz/docs/6213382' },
  { title: '“Iste’molchilarning huquqlarini himoya qilish to‘g‘risida”gi Qonun', href: 'https://lex.uz/docs/14643' },
  { title: '“Shaxsga doir ma’lumotlar to‘g‘risida”gi Qonun, O‘RQ-547', href: 'https://lex.uz/docs/4396419' },
  { title: '“Bola huquqlarining kafolatlari to‘g‘risida”gi Qonun, O‘RQ-139', href: 'https://lex.uz/docs/1297315' },
  { title: '“Axborotlashtirish to‘g‘risida”gi Qonun', href: 'https://lex.uz/docs/83472' },
];

export default function TermsPage() {
  return <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">CodeLearn</p>
    <h1 className="mt-3 font-[Space_Grotesk] text-4xl font-bold text-white">Foydalanish shartlari</h1>
    <p className="mt-3 text-sm text-slate-400">Amal qilish sanasi: 2026-yil 17-noyabr</p>

    <div className="mt-7 space-y-4">
      <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-sm leading-6 text-slate-300">
        <h2 className="font-semibold text-white">Xizmat ko‘rsatuvchi va aloqa</h2>
        <p className="mt-2">CodeLearn loyihasini yurituvchi: <strong className="text-white">Ruhiddinov Behruz</strong>. Yuridik maqomi va rasmiy nomi hozircha taqdim etilmagan.</p>
        <p>Email: <a className="text-cyan-300 underline" href="mailto:ruhiddinov03@gmail.com">ruhiddinov03@gmail.com</a> · Telefon: <a className="text-cyan-300 underline" href="tel:+998991916203">+998 99 191 62 03</a>.</p>
        <p>Pochta manzili: taqdim etilmagan. Agar elektron tijorat yoki iste’molchilar to‘g‘risidagi qonunlar CodeLearn’ga tatbiq qilinsa, qonunda nazarda tutilgan xizmat ko‘rsatuvchi rekvizitlarini qo‘shish zarur.</p>
      </section>
      <section className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.05] p-5 text-sm leading-6 text-amber-100">
        <h2 className="font-semibold">Voyaga yetmagan foydalanuvchilar</h2>
        <p className="mt-2">18 yoshga to‘lmagan shaxs CodeLearn’dan faqat ota-onasi, vasiysi yoki homiysining qonun talablariga mos yozma/elektron roziligi olinganidan keyin foydalanishi mumkin. Amaldagi ro‘yxatdan o‘tish jarayoni bunday rozilikni yig‘maydi yoki tekshirmaydi. Shu sababli hozirgi xizmat voyaga yetmaganlar rozilik jarayoni mavjud deb da’vo qilmaydi; bunday jarayon ishga tushirilmaguncha voyaga yetmagan shaxs ro‘yxatdan o‘tmasligi kerak.</p>
      </section>
    </div>

    <div className="mt-8 space-y-7 text-sm leading-7 text-slate-300">
      <section><h2 className="text-lg font-semibold text-white">1. Shartlarni qabul qilish</h2><p className="mt-2">Saytdan foydalanishdan oldin ushbu shartlar va <Link className="text-cyan-300 underline" href="/privacy">Maxfiylik siyosati</Link> bilan tanishing. Hisob yaratishdan oldin foydalanuvchi shartlarga rozilik berishi kerak. Shartlarga rozi bo‘lmasangiz, hisob yaratmang va xizmatdan foydalanmang. Operator ro‘yxatdan o‘tish vaqtida rozilik qayd etilishini va uni isbotlash mumkinligini ta’minlashi lozim.</p></section>
      <section><h2 className="text-lg font-semibold text-white">2. Xizmat va narx</h2><p className="mt-2">CodeLearn dasturlashni o‘rganish uchun kurslar, mashqlar, o‘quv jarayonini saqlash va forum imkoniyatlarini taqdim etadi. Foydalanuvchi taqdim etgan ma’lumotga ko‘ra, hozirda xizmat bepul va pullik tariflar e’lon qilinmagan. Kelgusida to‘lovli xizmat joriy etilsa, narx, to‘lov tartibi, xizmat shartlari va bekor qilish qoidalari oldindan alohida ko‘rsatiladi; foydalanuvchi roziligisiz amaldagi bepul xizmat pullik qilinmaydi.</p></section>
      <section><h2 className="text-lg font-semibold text-white">3. Hisob va xavfsizlik</h2><p className="mt-2">Ro‘yxatdan o‘tishda to‘g‘ri ma’lumot bering, email manzilingizni tasdiqlang va parolingizni boshqalarga bermang. Hisobingizdan ruxsatsiz foydalanilganini sezsangiz, darhol xizmat ko‘rsatuvchiga xabar bering. Xavfsizlik yoki qoidabuzarlik holatlarida administrator hisobni tekshirishi, vaqtincha cheklashi yoki o‘chirishi mumkin. Bu choralar foydalanuvchining qonuniy huquqlarini bekor qilmaydi.</p></section>
      <section><h2 className="text-lg font-semibold text-white">4. O‘quv kontenti</h2><p className="mt-2">Kurs va mashqlar ta’limiy maqsadda taqdim etiladi. Kursdan foydalanish ishga joylashish, imtihondan o‘tish yoki muayyan natijaga erishishni kafolatlamaydi. CodeLearn kontentni yangilashi yoki xizmat ishini ta’mirlash/xavfsizlik sababli vaqtincha cheklashi mumkin; bu qonun bilan kafolatlangan huquqlarni bekor qilmaydi.</p></section>
      <section><h2 className="text-lg font-semibold text-white">5. Forum va foydalanuvchi kontenti</h2><p className="mt-2">Forumga joylagan matn, kod, rasm va boshqa ma’lumotlaringiz uchun o‘zingiz javobgarsiz. Boshqa shaxsning shaxsiy ma’lumotlarini yoki mualliflik huquqi bilan himoyalangan asarlarini qonuniy asossiz joylamang. Haqorat, tahdid, spam va qonunga xilof kontent taqiqlanadi.</p><p className="mt-2">Siz CodeLearn’ga o‘zingiz joylagan kontentni xizmat ichida ko‘rsatish, saqlash, formatlash va qoidabuzarliklarni tekshirish uchun zarur bo‘lgan, oddiy va haq olinmaydigan ruxsat berasiz. Bu ruxsat kontentga egalik huquqingizni CodeLearn’ga o‘tkazmaydi. Kontentni o‘chirsangiz yoki hisobingiz o‘chirilsa, qonuniy sabab bilan saqlash talab qilinmasa, u xizmatdan olib tashlanadi.</p><p className="mt-2">Kontent haqida “Shikoyat qilish” tugmasi orqali xabar bering. Moderatorlar shikoyatni ko‘rib chiqib, zarur bo‘lsa kontentni yashirishi, olib tashlashi yoki hisobni cheklashi mumkin. Qonun bilan taqiqlangan axborot bo‘yicha operator tegishli qonuniy choralarni ko‘radi.</p></section>
      <section><h2 className="text-lg font-semibold text-white">6. Intellektual mulk</h2><p className="mt-2">CodeLearn’ning o‘ziga tegishli nom, interfeys va materiallar tegishli huquq egalariga tegishli. Qonun ruxsat bergan shaxsiy ta’limiy foydalanishdan tashqari, ularni ruxsatsiz ko‘chirish, tarqatish yoki tijorat maqsadida ishlatish mumkin emas. Ochiq litsenziyali materiallarga ularning alohida litsenziyasi tatbiq etiladi.</p></section>
      <section><h2 className="text-lg font-semibold text-white">7. Hisobni o‘chirish va ma’lumotlar</h2><p className="mt-2">Hisob, shaxsga doir ma’lumotlar va analitika bo‘yicha tartib <Link className="text-cyan-300 underline" href="/privacy">Maxfiylik siyosati</Link>da tushuntirilgan. Sozlamalar’dan ma’lumot nusxasini yuklab olish, hisobni o‘chirishni so‘rash yoki so‘rovni 30 kun ichida bekor qilish mumkin. Bu muddat qonundagi rozilikni qaytarib olish yoki boshqa huquqlarni cheklamaydi.</p></section>
      <section><h2 className="text-lg font-semibold text-white">8. Shikoyat va murojaatlar</h2><p className="mt-2">Xizmat, hisob yoki shaxsga doir ma’lumotlar bo‘yicha <a className="text-cyan-300 underline" href="mailto:ruhiddinov03@gmail.com">ruhiddinov03@gmail.com</a> yoki <a className="text-cyan-300 underline" href="tel:+998991916203">+998 99 191 62 03</a> orqali murojaat qiling. Murojaatlarda parol, tasdiqlash kodi yoki maxfiy kalit yubormang.</p></section>
      <section><h2 className="text-lg font-semibold text-white">9. Shartlarning yangilanishi va qonun</h2><p className="mt-2">Shartlarga kiritilgan muhim o‘zgarishlar ushbu sahifada yangi amal qilish sanasi bilan e’lon qilinadi; zarur hollarda foydalanuvchiga alohida xabar beriladi yoki qayta rozilik so‘raladi. O‘zbekiston qonunchiligida belgilangan iste’molchi va boshqa majburiy huquqlar ushbu shartlar bilan cheklanmaydi.</p></section>
      <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
        <h2 className="text-lg font-semibold text-white">Rasmiy huquqiy manbalar</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">{laws.map(law => <li key={law.href}><a className="text-cyan-300 underline" href={law.href} target="_blank" rel="noreferrer">{law.title} — LexUZ</a></li>)}</ul>
        <p className="mt-3 text-xs leading-5 text-slate-400">Elektron tijorat qonunining 16-moddasi hamda iste’molchilar huquqlarini himoya qilish qonunining 5–6-moddalari CodeLearn faoliyatiga tatbiq etilishi xizmat qanday yuritilishi va sotilishiga bog‘liq. Ushbu sahifa muayyan holat bo‘yicha yuridik xulosa emas.</p>
      </section>
    </div>
    <Link href="/" className="mt-8 inline-flex text-sm text-cyan-300 hover:underline">← Bosh sahifa</Link>
  </main>;
}

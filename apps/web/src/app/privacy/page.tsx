import Link from 'next/link';

const laws = [
  { title: '“Shaxsga doir ma’lumotlar to‘g‘risida”gi Qonun, O‘RQ-547', href: 'https://lex.uz/docs/4396419' },
  { title: '2026-yilgi O‘RQ-1125-son Qonun', href: 'https://lex.uz/docs/8099215' },
  { title: '“Bola huquqlarining kafolatlari to‘g‘risida”gi Qonun, O‘RQ-139', href: 'https://lex.uz/docs/1297315' },
  { title: '“Axborotlashtirish to‘g‘risida”gi Qonun', href: 'https://lex.uz/docs/83472' },
];

export default function PrivacyPage() {
  return <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">CodeLearn</p>
    <h1 className="mt-3 font-[Space_Grotesk] text-4xl font-bold text-white">Maxfiylik siyosati</h1>
    <p className="mt-3 text-sm text-slate-400">Amal qilish sanasi: 2026-yil 17-noyabr</p>

    <div className="mt-7 space-y-4">
      <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 text-sm leading-6 text-slate-300">
        <h2 className="font-semibold text-white">Xizmatni yurituvchi va aloqa</h2>
        <p className="mt-2">CodeLearn loyihasini yurituvchi: <strong className="text-white">Ruhiddinov Behruz</strong>. Loyiha yuridik shaxs yoki yakka tartibdagi tadbirkor nomidan yuritiladimi — bu ma’lumot hozircha taqdim etilmagan.</p>
        <p>Email: <a className="text-cyan-300 underline" href="mailto:ruhiddinov03@gmail.com">ruhiddinov03@gmail.com</a> · Telefon: <a className="text-cyan-300 underline" href="tel:+998991916203">+998 99 191 62 03</a>.</p>
        <p>Pochta manzili: hozircha taqdim etilmagan. Email pochta manzili o‘rnini bosmaydi.</p>
      </section>

      <section className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.05] p-5 text-sm leading-6 text-amber-100">
        <h2 className="font-semibold">Muhim: voyaga yetmaganlar</h2>
        <p className="mt-2">O‘zbekistonning “Shaxsga doir ma’lumotlar to‘g‘risida”gi Qonuni 21-moddasiga ko‘ra, voyaga yetmagan shaxsning ma’lumotlarini qayta ishlash uchun ota-onasi, vasiysi yoki homiysining yozma, shu jumladan elektron hujjat shaklidagi roziligi talab etiladi. Hozirgi CodeLearn ro‘yxatdan o‘tish jarayoni bunday rozilikni so‘ramaydi yoki tekshirmaydi. Shu sababli ota-ona yoki vasiyning qonuniy roziligi oldindan olinmaguncha 18 yoshga to‘lmagan shaxs hisob ochmasligi va xizmatdan foydalanmasligi kerak. Bu qoida bajarilishini CodeLearn alohida tasdiqlamaguncha sayt voyaga yetmaganlar uchun rozilik jarayoni tayyor deb hisoblanmasin.</p>
      </section>

      <section className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.05] p-5 text-sm leading-6 text-amber-100">
        <h2 className="font-semibold">Muhim: ma’lumotlarning xorijda saqlanishi</h2>
        <p className="mt-2">CodeLearn’ning Supabase loyihasi siz bergan ma’lumotga ko‘ra Fransiyaning Parij (West EU, eu-west-3) hududida joylashgan. O‘zbekiston qonunining 27¹-moddasi xorijda saqlanadigan shaxsga doir ma’lumotlar uchun tegishli himoya shartlarini belgilaydi. CodeLearn operatori Supabase shartnomasi, zaxira nusxalari, xizmat ko‘rsatuvchi subpudratchilar va qonundagi himoya shartlariga muvofiqlikni tekshirishi kerak. Faqat ushbu siyosatni e’lon qilish xorijda ma’lumot saqlashga o‘z-o‘zidan qonuniy asos yaratmaydi. Muvofiqlik tekshirilgani haqida hozircha ma’lumot berilmagan.</p>
      </section>
    </div>

    <div className="mt-8 space-y-7 text-sm leading-7 text-slate-300">
      <section>
        <h2 className="text-lg font-semibold text-white">1. Siyosat nimani tushuntiradi?</h2>
        <p className="mt-2">Ushbu siyosat CodeLearn saytidan foydalanganda sizga oid ma’lumotlar qanday olinishi, ishlatilishi, saqlanishi va o‘chirilishi haqida axborot beradi. “Shaxsga doir ma’lumotlar to‘g‘risida”gi Qonun, jumladan uning 3, 4, 10, 17–23, 27¹, 28, 30 va 31-moddalari qo‘llanishi mumkin.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-white">2. Qanday ma’lumotlar qayta ishlanadi?</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Hisob ma’lumotlari: ism, email manzili, Supabase hisob identifikatori va ro‘li.</li>
          <li>Profil ma’lumotlari: foydalanuvchi tanlagan avatar. Avatar ommaviy saqlash manzilida joylashadi va havolaga ega bo‘lgan shaxslar ko‘rishi mumkin.</li>
          <li>O‘quv ma’lumotlari: yakunlangan darslar, faollik kunlari, test natijalari, saqlangan darslar, loyiha jarayoni va haftalik reja.</li>
          <li>Forum ma’lumotlari: mavzu va javob matni, profil nomi/avatari, shikoyat mazmuni va ko‘rib chiqish holati. Forumga kirgan foydalanuvchilar joylangan kontentni ko‘rishi mumkin.</li>
          <li>Texnik ma’lumotlar: Supabase va Vercel kabi xizmat ko‘rsatuvchilarda qayd etilishi mumkin bo‘lgan so‘rov, xavfsizlik va ishlash jurnallari. Ularning aniq tarkibi va saqlanish muddati xizmat ko‘rsatuvchilar sozlamalari hamda shartlariga bog‘liq.</li>
        </ul>
        <p className="mt-2">Google yoki GitHub orqali kirishni tanlasangiz, tegishli xizmat hisobni tasdiqlash uchun zarur ma’lumotlarni qayta ishlaydi. Bu xizmatlarning o‘z maxfiylik shartlari ham amal qiladi.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-white">3. Ma’lumotlardan foydalanish maqsadi va asoslari</h2>
        <p className="mt-2">Ma’lumotlar hisob yaratish va unga kirish, kurs va o‘quv jarayonini taqdim etish, natijalarni saqlash, forum ishlashi, xavfsizlik va suiiste’molning oldini olish, foydalanuvchi murojaatlariga javob berish hamda qonuniy majburiyatlarni bajarish uchun ishlatiladi. Qonunning 18-moddasida ko‘rsatilgan tegishli huquqiy asos qo‘llanadi: masalan, xizmat shartnomasini bajarish uchun zarur ishlov, qonuniy majburiyat yoki muayyan ixtiyoriy ishlov uchun rozilik.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-white">4. Ixtiyoriy analitika</h2>
        <p className="mt-2">Faqat alohida rozilik berganingizdan keyin ro‘yxatdan o‘tish, dars boshlash/yakunlash, kursni tugatish va haftalik qaytish hodisalari hisoblanadi. Analitika jadvalida ism va email emas, hisob identifikatoridan hosil qilingan barqaror psevdonim kalit ishlatiladi. Bu haqiqiy anonimlashtirish emas. Administratorlarga alohida foydalanuvchilarning yozuvlari emas, jamlangan ko‘rsatkichlar taqdim etiladi. Rozilikni Sozlamalar’da bekor qilishingiz mumkin; bekor qilinganda shu analitika hodisalari o‘chiriladi.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-white">5. Xizmat ko‘rsatuvchilar va ma’lumot uzatish</h2>
        <p className="mt-2">CodeLearn Supabase’dan tizimga kirish, ma’lumotlar bazasi va fayllarni saqlash uchun, Vercel’dan esa veb-ilovani joylashtirish va ishlatish uchun foydalanadi. Google va GitHub siz tanlagan kirish usulini tasdiqlaydi. Ular o‘z xizmatlari uchun zarur ma’lumotlarni tegishli shartlar asosida qayta ishlashi mumkin. CodeLearn ma’lumotlaringizni sotmaydi.</p>
        <p className="mt-2">Supabase ma’lumotlar bazasi Fransiyada joylashgan. Qonunning 15 va 27¹-moddalariga muvofiq, ma’lumotlarni chegaradan tashqariga uzatish va xorijda saqlash uchun zarur huquqiy asos hamda himoya choralarini operator tekshirishi lozim. Ma’lumotlarning Fransiyada saqlanishi ushbu talablar bajarilganini o‘z-o‘zidan anglatmaydi. Ma’lumot oluvchilar va uzatish asoslari haqida <a className="text-cyan-300 underline" href="mailto:ruhiddinov03@gmail.com">ruhiddinov03@gmail.com</a> orqali so‘rashingiz mumkin.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-white">6. Brauzer xotirasi</h2>
        <p className="mt-2">Sayt brauzeringizning mahalliy xotirasidan tizimga kirish holati, tanlangan til va analitika roziligi haqidagi tanlovni saqlash uchun foydalanadi. Analitika roziligisiz o‘quv analitikasi hodisalari yuborilmasligi kerak; rozilikni istalgan vaqtda qaytarib olishingiz mumkin.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-white">7. Saqlash va o‘chirish</h2>
        <p className="mt-2">Hisob ma’lumotlari xizmatni ko‘rsatish maqsadi uchun zarur muddat davomida saqlanadi. Sozlamalar’da hisobni o‘chirish so‘rovi yuborilgach, tizim uni 30 kundan keyin bajarishga rejalashtiradi; shu muddat ichida so‘rovni bekor qilish mumkin. Bu 30 kun CodeLearn taqdim etayotgan tiklash imkoniyati bo‘lib, qonunda belgilangan saqlash muddati emas va ma’lumotlarni o‘chirish yoki qayta ishlashni to‘xtatish bo‘yicha qonuniy huquqlarni cheklamaydi. Operator qonunning 17-moddasidagi o‘chirish asoslari va alohida saqlash majburiyatlariga rioya qilishi kerak. Xizmat ko‘rsatuvchilarning zaxira nusxalari va server jurnallari o‘z saqlash muddatiga ega bo‘lishi mumkin.</p>
        <p className="mt-2">O‘z ma’lumotlaringiz nusxasini Sozlamalar’dan JSON ko‘rinishida yuklab olishingiz, hisobni o‘chirishni so‘rashingiz yoki maxfiylik bo‘yicha murojaatni email orqali yuborishingiz mumkin. Qonunning 30-moddasi doirasidagi so‘rovlar ko‘rib chiqiladi; aniqlik kiritish zarur bo‘lsa, shaxs tasdiqlanishi so‘ralishi mumkin.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-white">8. Huquqlaringiz va murojaat tartibi</h2>
        <p className="mt-2">Qonunda ko‘rsatilgan doirada ma’lumotlaringiz bor-yo‘qligini bilish, qayta ishlash maqsadi va asoslari haqida ma’lumot so‘rash, rozilikka asoslangan ishlovni bekor qilish, qonundagi shartlarda ishlovni to‘xtatishni talab qilish hamda vakolatli organga yoki sudga murojaat qilish huquqlaringiz bor. Ma’lumotni tuzatish so‘rovlarini qonundagi muddatlarda, shu jumladan 11-moddadagi talablarni hisobga olib ko‘rib chiqamiz. Murojaat: <a className="text-cyan-300 underline" href="mailto:ruhiddinov03@gmail.com">ruhiddinov03@gmail.com</a>.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-white">9. Himoya va ommaviy kontent</h2>
        <p className="mt-2">Kirish huquqi foydalanuvchi roli bo‘yicha cheklanadi va ma’lumotlar bazasida ruxsat siyosatlari ishlatiladi. Biroq internet orqali ma’lumot uzatish yoki saqlashning hech bir usuli mutlaq xavfsizlikni kafolatlamaydi. Forumda boshqa shaxsning ma’lumotlarini tegishli huquqiy asos yoki roziliksiz joylamang. “Axborotlashtirish to‘g‘risida”gi Qonunning 12¹-moddasi qo‘llanadigan kontent bo‘yicha operator noqonuniy axborotni aniqlash va tegishli choralarni ko‘rish majburiyatini bajaradi; shikoyatni forumdagi “Shikoyat qilish” tugmasi orqali yuborish mumkin.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-white">10. Siyosat o‘zgarishi</h2>
        <p className="mt-2">Mazmunli o‘zgarishlar ushbu sahifada yangi sana bilan e’lon qilinadi. Qonun talab qiladigan alohida xabarnoma yoki rozilik zarur bo‘lsa, sayt siyosat havolasini yangilash bilangina cheklanmaydi.</p>
      </section>
      <section className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
        <h2 className="text-lg font-semibold text-white">Rasmiy huquqiy manbalar</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">{laws.map(law => <li key={law.href}><a className="text-cyan-300 underline" href={law.href} target="_blank" rel="noreferrer">{law.title} — LexUZ</a></li>)}</ul>
        <p className="mt-3 text-xs leading-5 text-slate-400">Moddalar havolalari ma’lumot uchun keltirildi; sahifa huquqiy xulosa emas. Xizmat operatori qonunlarning amaldagi tahririni, haqiqiy ma’lumotlar oqimini va xizmat ko‘rsatuvchilar shartlarini tekshirishi shart.</p>
      </section>
    </div>
    <Link href="/" className="mt-8 inline-flex text-sm text-cyan-300 hover:underline">← Bosh sahifa</Link>
  </main>;
}

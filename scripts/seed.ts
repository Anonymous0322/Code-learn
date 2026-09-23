import { prisma } from '../apps/web/src/lib/db/client';

async function main() {
  console.log('🌱 Seeding database...');

  // Seed languages/courses
  const courses = await Promise.all([
    prisma.course.upsert({
      where: { language_code: 'html' },
      update: {},
      create: {
        title: 'HTML',
        language_code: 'html',
        description: 'Learn the foundation of the web',
        icon_url: '/images/logos/html.svg',
        difficulty: 'beginner',
        is_active: true,
      },
    }),
    prisma.course.upsert({
      where: { language_code: 'css' },
      update: {},
      create: {
        title: 'CSS',
        language_code: 'css',
        description: 'Style the web beautifully',
        icon_url: '/images/logos/css.svg',
        difficulty: 'beginner',
        is_active: true,
      },
    }),
    prisma.course.upsert({
      where: { language_code: 'javascript' },
      update: {},
      create: {
        title: 'JavaScript',
        language_code: 'javascript',
        description: 'Make the web alive',
        icon_url: '/images/logos/javascript.svg',
        difficulty: 'beginner',
        is_active: true,
      },
    }),
    prisma.course.upsert({
      where: { language_code: 'python' },
      update: {},
      create: {
        title: 'Python',
        language_code: 'python',
        description: 'General-purpose programming',
        icon_url: '/images/logos/python.svg',
        difficulty: 'beginner',
        is_active: true,
      },
    }),
  ]);

  console.log(`✅ Seeded ${courses.length} courses`);
  console.log('Database seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

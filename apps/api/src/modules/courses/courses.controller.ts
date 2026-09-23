import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { z } from 'zod';

const GetCoursesQuerySchema = z.object({
  page: z.string().optional(),
  search: z.string().optional(),
  language: z.string().optional(),
});

@Controller('courses')
export class CoursesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll(@Query(new ZodValidationPipe(GetCoursesQuerySchema)) query: z.infer<typeof GetCoursesQuerySchema>) {
    const { page = '1', search, language } = query as { page?: string; search?: string; language?: string };
    const skip = (parseInt(page) - 1) * 20;

    const where: Record<string, unknown> = { isActive: true };
    if (language) where.languageCode = language;
    if (search) where.slug = { contains: search, mode: 'insensitive' };

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        include: {
          translations: { where: { language: 'en' } },
          levels: { orderBy: { orderIndex: 'asc' }, take: 1 },
        },
        skip,
        take: 20,
        orderBy: { orderIndex: 'asc' },
      }),
      this.prisma.course.count({ where }),
    ]);

    return { success: true, data: courses, message: 'Courses retrieved', timestamp: new Date().toISOString() };
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      include: {
        translations: { orderBy: { language: 'asc' } },
        levels: { orderBy: { orderIndex: 'asc' }, include: { lessons: { orderBy: { orderIndex: 'asc' } } } },
      },
    });

    if (!course) return { success: false, data: null, message: 'Course not found', timestamp: new Date().toISOString() };

    return { success: true, data: course, message: 'Course retrieved', timestamp: new Date().toISOString() };
  }

  @Get(':slug/roadmap')
  async getRoadmap(@Param('slug') slug: string) {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      include: {
        levels: {
          orderBy: { orderIndex: 'asc' },
          include: {
            lessons: { orderBy: { orderIndex: 'asc' }, include: { translations: { where: { language: 'en' } } } },
          },
        },
      },
    });

    if (!course) return { success: false, data: null, message: 'Course not found', timestamp: new Date().toISOString() };

    const roadmap = course.levels.map((level: any) => ({
      levelIndex: level.levelIndex,
      title: level.title,
      description: level.description,
      lessons: level.lessons.map((lesson: any) => ({
        id: lesson.id,
        slug: lesson.slug,
        title: lesson.translations && lesson.translations[0] ? lesson.translations[0].title : (lesson as any).title || 'Untitled',
        orderIndex: lesson.orderIndex,
        estimatedTime: lesson.estimatedTime,
        isLocked: lesson.isLocked,
      })),
    }));

    return { success: true, data: { course: (course as any).title, roadmap }, message: 'Roadmap retrieved', timestamp: new Date().toISOString() };
  }

  @Get(':slug/levels')
  async getLevels(@Param('slug') slug: string) {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      include: { levels: { orderBy: { orderIndex: 'asc' } } },
    });

    if (!course) return { success: false, data: null, message: 'Course not found', timestamp: new Date().toISOString() };

    return { success: true, data: course.levels, message: 'Levels retrieved', timestamp: new Date().toISOString() };
  }
}

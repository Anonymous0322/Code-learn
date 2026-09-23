import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { z } from 'zod';

const CompleteLessonSchema = z.object({
  lessonId: z.string().uuid(),
});

@Controller('courses')
export class LessonsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':courseSlug/lessons/:lessonSlug')
  async findBySlug(@Param('courseSlug') courseSlug: string, @Param('lessonSlug') lessonSlug: string) {
    const course = await this.prisma.course.findUnique({
      where: { slug: courseSlug },
      include: { levels: { include: { lessons: true } } },
    });

    if (!course) return { success: false, data: null, message: 'Course not found', timestamp: new Date().toISOString() };

    const level = course.levels.find((l: any) => l.lessons.some((ls: any) => ls.slug === lessonSlug));
    if (!level) return { success: false, data: null, message: 'Lesson not found', timestamp: new Date().toISOString() };

    const lesson = level.lessons.find((ls: any) => ls.slug === lessonSlug);
    if (!lesson) return { success: false, data: null, message: 'Lesson not found', timestamp: new Date().toISOString() };

    const translations = await this.prisma.lessonTranslation.findMany({
      where: { lessonId: lesson.id },
    });

    const content = this.buildContent(lesson, translations);

    return { success: true, data: { ...lesson, content, translations }, message: 'Lesson retrieved', timestamp: new Date().toISOString() };
  }

  private buildContent(lesson: any, translations: any[]) {
    const translation = translations.find((t: any) => t.language === 'en') || translations[0];

    return {
      title: translation?.title || lesson.title,
      theory: translation?.theory || '',
      exampleCode: translation?.exampleCode || '',
      exampleExplanation: translation?.exampleExplanation || '',
      tryIt: translation?.tryIt || '',
      commonMistakes: translation?.commonMistakes || '',
      tips: translation?.tips || '',
      summary: translation?.summary || '',
      syntax: translation?.syntax || '',
      content: translation?.content || {},
    };
  }

  @Post('progress/complete-lesson')
  @UseGuards(JwtAuthGuard)
  async completeLesson(@Body(new ZodValidationPipe(CompleteLessonSchema)) body: z.infer<typeof CompleteLessonSchema>, @Req() req: { user?: { sub: string } }) {
    const { lessonId } = body;
    const userId = req.user?.sub || 'unknown';

    const progress = await this.prisma.userProgress.upsert({
      where: {
        userId_courseId_lessonId: {
          userId,
          courseId: '',
          lessonId,
        },
      },
      update: { isCompleted: true, completedAt: new Date() },
      create: {
        userId,
        courseId: '',
        lessonId,
        isCompleted: true,
        xpEarned: 10,
        completedAt: new Date(),
      },
    });

    return { success: true, data: progress, message: 'Lesson completed', timestamp: new Date().toISOString() };
  }
}

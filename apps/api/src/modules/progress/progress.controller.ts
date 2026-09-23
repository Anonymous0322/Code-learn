import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { UseGuards, Param, Req } from '@nestjs/common';

@Controller('progress')
export class ProgressController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':courseId')
  @UseGuards(JwtAuthGuard)
  async getCourseProgress(@Param('courseId') courseId: string, @Req() req: { user?: { sub: string } }) {
    const userId = req.user?.sub || 'unknown';

    const progress = await this.prisma.userProgress.findMany({
      where: { userId, courseId },
      include: { level: true, lesson: true },
    });

    const completedLessons = progress.filter((p: any) => p.isCompleted && p.lessonId).map((p: any) => p.lessonId);
    const completedLevels = [...new Set(progress.filter((p: any) => p.isCompleted && p.levelId).map((p: any) => p.levelId))];
    const totalLessons = await this.prisma.lesson.count({
      where: { level: { courseId } },
    });

    return {
      success: true,
      data: {
        courseId,
        completedLessons,
        completedLevels,
        totalLessons,
        xpEarned: progress.reduce((sum: number, p: any) => sum + p.xpEarned, 0),
      },
      message: 'Progress retrieved',
      timestamp: new Date().toISOString(),
    };
  }
}

import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('progress')
export class ProgressController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':courseId')
  @UseGuards(JwtAuthGuard)
  async getCourseProgress(@Param('courseId') courseId: string, @Req() req: any) {
    const userId = req.user.sub;

    const progress = await this.prisma.userProgress.findMany({
      where: { userId, courseId },
      include: { level: true, lesson: true },
    });

    const completedLessons = progress.filter((p) => p.isCompleted && p.lessonId).map((p) => p.lessonId);
    const completedLevels = [...new Set(progress.filter((p) => p.isCompleted && p.levelId).map((p) => p.levelId))];
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
        xpEarned: progress.reduce((sum, p) => sum + p.xpEarned, 0),
      },
      message: 'Progress retrieved',
      timestamp: new Date().toISOString(),
    };
  }
}

import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CoursesModule } from './modules/courses/courses.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { ProgressModule } from './modules/progress/progress.module';
import { ExecuteModule } from './modules/execute/execute.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CoursesModule,
    LessonsModule,
    ProgressModule,
    ExecuteModule,
  ],
})
export class AppModule {}

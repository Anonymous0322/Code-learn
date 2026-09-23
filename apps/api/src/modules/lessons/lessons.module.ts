import { Module } from '@nestjs/common';
import { LessonsController } from './lessons.controller';
import { ProgressController } from '../progress/progress.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [LessonsController, ProgressController],
  providers: [PrismaService],
})
export class LessonsModule {}

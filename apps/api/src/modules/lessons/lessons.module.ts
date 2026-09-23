import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LessonsController } from './lessons.controller';
import { ProgressController } from '../progress/progress.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [JwtModule],
  controllers: [LessonsController, ProgressController],
  providers: [PrismaService],
})
export class LessonsModule {}

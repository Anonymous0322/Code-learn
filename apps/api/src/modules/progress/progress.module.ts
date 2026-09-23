import { Module } from '@nestjs/common';
import { ProgressController } from './progress.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ProgressController],
  providers: [PrismaService],
})
export class ProgressModule {}

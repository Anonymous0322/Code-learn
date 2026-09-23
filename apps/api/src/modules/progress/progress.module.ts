import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ProgressController } from './progress.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [JwtModule],
  controllers: [ProgressController],
  providers: [PrismaService],
})
export class ProgressModule {}

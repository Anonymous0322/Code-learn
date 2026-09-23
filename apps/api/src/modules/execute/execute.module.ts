import { Module } from '@nestjs/common';
import { ExecuteController } from './execute.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ExecuteController],
  providers: [PrismaService],
})
export class ExecuteModule {}

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ExecuteController } from './execute.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [JwtModule],
  controllers: [ExecuteController],
  providers: [PrismaService],
})
export class ExecuteModule {}

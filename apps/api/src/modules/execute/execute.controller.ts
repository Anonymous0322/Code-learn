import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe';
import { z } from 'zod';

const ExecuteSchema = z.object({
  language: z.string(),
  code: z.string(),
  timeout: z.number().optional(),
});

@Controller('execute')
export class ExecuteController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async execute(@Body(new ZodValidationPipe(ExecuteSchema)) body: z.infer<typeof ExecuteSchema>) {
    return {
      success: true,
      data: {
        output: `// ${body.language} execution placeholder\n${body.code}`,
        error: null,
        executionTime: 0,
        memoryUsed: '0MB',
        status: 'success',
      },
      message: 'Code execution queued',
      timestamp: new Date().toISOString(),
    };
  }
}

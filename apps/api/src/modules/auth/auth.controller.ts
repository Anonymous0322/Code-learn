import { Controller, Post, Body } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { z } from 'zod';

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

@Controller('auth')
export class AuthController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('register')
  async register(@Body(ZodValidationPipe(RegisterSchema)) body: z.infer<typeof RegisterSchema>) {
    const { email, password, name } = body;

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, data: null, message: 'Email already exists', timestamp: new Date().toISOString() };
    }

    return { success: true, data: { email, name }, message: 'User created', timestamp: new Date().toISOString() };
  }

  @Post('login')
  async login(@Body(ZodValidationPipe(LoginSchema)) body: z.infer<typeof LoginSchema>) {
    const { email, password } = body;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { success: false, data: null, message: 'Invalid credentials', timestamp: new Date().toISOString() };
    }

    return { success: true, data: { email: user.email, name: user.name }, message: 'Logged in', timestamp: new Date().toISOString() };
  }
}

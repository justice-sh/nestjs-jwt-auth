import { BadRequestException, Body, Controller, Post, Req, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '@/pipes/zod-validation/zod-validation.pipe';
import { CreateUserSchema, VerifyEmailSchema } from '@/shared/schemas/user';
import { AuthService } from '@/auth/auth.service';
import { CreateUser } from '@/shared/types/user';
import { UsersService } from './users.service';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateUserSchema))
  async createUser(@Body() data: CreateUser) {
    const existingUser = await this.usersService.findByEmail(data.email);
    if (existingUser) throw new BadRequestException('Email already exists');

    const hashedPassword = await this.usersService.hashPassword(data.password);
    await this.usersService.save({ ...data, password: hashedPassword });

    return { message: 'User created successfully' };
  }

  @Post('verify-email')
  @UsePipes(new ZodValidationPipe(VerifyEmailSchema))
  async verifyEmail(@Req() request: Request, @Body() body: { email: string; code: string }) {
    let user = await this.usersService.findByEmail(body.email);
    if (!user) throw new BadRequestException('User not found');

    user = await this.usersService.update(user.id, { emailVerified: true });

    await this.authService.signIn(user, request);

    return { message: 'Email verified successfully' };
  }
}

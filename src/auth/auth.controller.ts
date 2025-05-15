import { ZodValidationPipe } from '@/pipes/zod-validation/zod-validation.pipe';
import { LoginSchema } from '@/shared/schemas/auth';
import { AuthUser } from '@/shared/types/user';
import { UsersService } from '@/users/users.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';
import { AuthService } from './auth.service';
import { AuthGuard } from '@/guards/auth/auth.guard';
import { Request } from 'express';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  @UsePipes(new ZodValidationPipe(LoginSchema))
  async login(@Body() data: z.infer<typeof LoginSchema>, @Req() request: Request) {
    const user = await this.usersService.findByEmail(data.email);
    if (!user) throw new BadRequestException('Invalid email or password');

    const isValid = await this.usersService.verifyPassword(data.password, user.password);
    if (!isValid) throw new BadRequestException('Invalid email or password');

    if (!user.emailVerified) throw new BadRequestException('Email not verified');

    await this.authService.signIn(user, request);

    return { message: 'Login successful' };
  }

  @Post('me')
  @UseGuards(AuthGuard)
  getUserInfo(@Req() request: { user: AuthUser }) {
    return {
      message: 'User info retrieved successfully',
      data: request.user,
    };
  }

  @Get('google')
  @UseGuards(PassportAuthGuard('google'))
  async googleAuth() {
    return 'Redirecting to Google...';
  }

  @Get('google/callback')
  @UseGuards(PassportAuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    const data = this.authService.getGoogleUser(req);

    let user = await this.usersService.findByEmail(data.email);

    if (!user) {
      user = await this.usersService.save({
        email: data.email,
        emailVerified: data.emailVerified,
        name: data.name,
        provider: data.provider,
        password: await this.usersService.hashPassword(`Pw#${Date.now()}1d`),
      });
    }

    if (!user.emailVerified) throw new BadRequestException('Email not verified');

    await this.authService.signIn(user, req);

    return { message: 'Authentication successful' };
  }
}

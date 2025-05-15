import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from '@/auth/auth.service';
import { JwtService } from '@/jwt/jwt.service';
import { ConfigService } from '@/config/config.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ConfigService, AuthService, JwtService],
  exports: [UsersService],
})
export class UsersModule {}

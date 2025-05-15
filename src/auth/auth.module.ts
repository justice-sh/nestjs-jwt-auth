import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '@/users/users.service';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtService } from '@/jwt/jwt.service';
import { ConfigService } from '@/config/config.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'google' })],
  providers: [AuthService, ConfigService, JwtService, UsersService, GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from './config/config.module';
import { JwtModule } from './jwt/jwt.module';

@Module({
  imports: [ConfigModule, AuthModule, UsersModule, JwtModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

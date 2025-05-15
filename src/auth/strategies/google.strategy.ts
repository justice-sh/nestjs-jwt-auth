import { ConfigService } from '@/config/config.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    const googleClient = configService.get('googleClient');

    super({
      clientID: googleClient.id,
      clientSecret: googleClient.secret,
      callbackURL: `${configService.get('app_url')}/auth/google/callback`,
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return {
      accessToken,
      profile,
    };
  }
}

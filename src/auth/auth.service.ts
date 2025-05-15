import { JwtService } from '@/jwt/jwt.service';
import { GoogleAuthUser } from '@/shared/types/user';
import { User } from '@/users/users.service';
import { Injectable, Req } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signIn(user: User, request: Request) {
    const token = this.generateToken(user);
    request.res?.setHeader('Authorization', `Bearer ${token}`);
    // request.res.setHeader('Access-Control-Expose-Headers', 'Authorization');
  }

  retriveToken(request: Request) {
    const authorization = request.headers['authorization'];
    return authorization?.split(' ')[1];
  }

  generateToken(user: User) {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string) {
    return this.jwtService.verify<{ email: string }>(token);
  }

  getGoogleUser(@Req() req) {
    const user = req.user as GoogleAuthUser;

    return {
      id: user.profile.id,
      email: user.profile._json.email,
      name: user.profile._json.name,
      emailVerified: user.profile._json.email_verified,
      provider: user.profile.provider,
      photo: user.profile.photos[0]?.value,
    };
  }
}

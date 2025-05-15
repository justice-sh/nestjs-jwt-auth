import { ConfigService } from '@/config/config.service';
import { StringValue } from '@/shared/types/jwt';
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private readonly options: { secret: string; expiresIn: StringValue };

  constructor(private readonly configService: ConfigService) {
    this.options = this.configService.get('jwt');
  }

  sign(payload: any): string {
    const { secret, expiresIn } = this.options;
    return jwt.sign(payload, secret as any, { expiresIn });
  }

  verify<T extends object>(token: string): jwt.JwtPayload & T {
    return jwt.verify(token, this.options.secret) as jwt.JwtPayload & T;
  }
}

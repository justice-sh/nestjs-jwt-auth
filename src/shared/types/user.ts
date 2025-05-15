import { CreateUserSchema } from '@/shared/schemas/user';
import { z } from 'zod';

export type CreateUser = z.infer<typeof CreateUserSchema>;

export type AuthUser = {
  id: string;
};

export interface GoogleAuthUser {
  accessToken: string;
  profile: {
    id: string;
    displayName: string;
    name: { familyName: string; givenName: string; middleName?: string };
    emails: { value: string; verified: boolean }[];
    photos: { value: string }[];
    provider: string;
    _raw: string;
    _json: {
      sub: string;
      name: string;
      given_name: string;
      family_name: string;
      email: string;
      email_verified: boolean;
    };
  };
}

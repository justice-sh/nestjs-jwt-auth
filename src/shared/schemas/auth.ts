import { z } from 'zod';
import { PasswordSchema } from './password';

export const LoginSchema = z.object(
  {
    email: z.string().email(),
    password: PasswordSchema(),
  },
  {
    required_error: 'email, and password are required',
  },
);

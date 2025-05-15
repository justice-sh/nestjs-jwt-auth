import { z } from 'zod';
import { PasswordSchema } from './password';

export const CreateUserSchema = z
  .object(
    {
      name: z.string().min(1),
      email: z.string().email(),
      password: PasswordSchema(),
      provider: z.string().optional().default(''),
      emailVerified: z.boolean().optional().default(false),
    },
    {
      required_error: 'name, email, and password are required',
    },
  )
  .transform((data, ctx) => {
    data.emailVerified = false;
    data.provider = '';

    return data;
  });

export const VerifyEmailSchema = z.object(
  {
    email: z.string().email(),
    code: z.string().length(6),
  },
  {
    required_error: 'email and code are required',
  },
);

import { checkPassword } from '@/shared/utils/password';
import { z } from 'zod';

export const PasswordSchema = () => {
  return z
    .string({ required_error: 'Password is required.' })
    .min(1, 'Password is required.')
    .superRefine((password, ctx) => {
      const { hasLowercase, hasNumber, hasSymbol, hasUppercase, isLong } = checkPassword(password);

      const errors = ['Password should have'];

      if (!hasLowercase) errors.push('a lowercase character');
      if (!hasUppercase) errors.push('an uppercase character');
      if (!hasNumber) errors.push('a number');
      if (!hasSymbol) errors.push('a special character');
      if (!isLong) errors.push('at least 8 characters');

      if (errors.length > 2) {
        const lastError = errors.splice(-1, 1).join('');
        errors.push(`and ${lastError}`);
      }

      if (errors.length > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: errors.join(', '),
          fatal: true,
        });
      }
    });
};

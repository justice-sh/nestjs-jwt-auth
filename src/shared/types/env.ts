import { EnvSchema } from '@/shared/schemas/env';
import { z } from 'zod';

export type EnvData = z.infer<typeof EnvSchema>;

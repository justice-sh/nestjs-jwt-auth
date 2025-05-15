import { EnvSchema } from '@/shared/schemas/env';
import { StringValue } from '@/shared/types/jwt';
import { NestedKeys, NestedValue } from '@/shared/types/nested-utility';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

@Injectable()
export class ConfigService {
  constructor() {
    dotenv.config();
    this.validate();
  }

  private validate() {
    const result = EnvSchema.safeParse(process.env);
    if (!result.success) throw new Error(fromZodError(result.error).message);
  }

  get<K extends NestedKeys<ConfigData>>(key: K) {
    const data = transformEnv();
    return key.split('.').reduce((acc, curr) => acc && acc[curr], data) as NestedValue<
      ConfigData,
      K
    >;
  }
}

function transformEnv(): ConfigData {
  const data = process.env as any as z.infer<typeof EnvSchema>;

  return {
    jwt: {
      secret: data.JWT_SECRET,
      expiresIn: '5m',
    },
    googleClient: {
      id: data.GOOGLE_CLIENT_ID,
      secret: data.GOOGLE_CLIENT_SECRET,
    },
    app_url: data.APP_URL,
  };
}

type ConfigData = {
  jwt: {
    secret: string;
    expiresIn: StringValue;
  };
  googleClient: {
    id: string;
    secret: string;
  };
  app_url: string;
};

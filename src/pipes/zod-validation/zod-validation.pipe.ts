import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';
import { fromZodError } from 'zod-validation-error';

type NonVoid<T> = T extends void ? never : T;

type PreProcess = <T>(data: T) => NonVoid<T>;

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(
    private schema: ZodSchema,
    private preprocess: PreProcess = (data: any) => data,
  ) {}

  transform(value: unknown) {
    const result = this.schema.safeParse(this.preprocess(value));

    if (result.success) return result.data;

    throw new BadRequestException(fromZodError(result.error).message);
  }
}

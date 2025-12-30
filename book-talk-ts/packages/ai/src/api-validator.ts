import { BadRequestException } from '@nestjs/common';
import type { z } from 'zod';

/** controller에서 요청 객체의 유효성 검증 수행 */
export const validate = <T extends z.ZodTypeAny>(schema: T, data: z.input<T>): z.output<T> => {
  try {
    return schema.parse(data);
  } catch (e: unknown) {
    throw new BadRequestException(e);
  }
};

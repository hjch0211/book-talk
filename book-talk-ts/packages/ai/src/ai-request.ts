import { z } from 'zod';

/**
 *  Global AI Request interface
 *
 *  @important 3rd party AI 요청 시, 반드시 구현할 것
 */
export const AiRequestBaseSchema = z.object({
  /** 명령어 */
  command: z.string(),
  /** data */
  data: z.unknown().optional(),
});

import { z } from 'zod';

/**
 *  Global AI Response interface
 *
 *  @important 3rd party AI 요청 시, 반드시 구현할 것
 */
export const AiResponseBaseSchema = z.object({
  /** 결과 상태 */
  status: z.enum(['SUCCESS', 'FAILED']),
  /** 메시지 (프롬프트 응답 디버깅용) */
  message: z.string(),
  /** data */
  data: z.unknown().optional(),
});

import { z } from 'zod';

/**
 *  Global AI Response interface
 *
 *  @important 3rd party AI 요청 시, 반드시 구현할 것
 */
export const AiResponseBaseSchema = z.object({
  /** 결과 상태 */
  status: z.enum(['SUCCESS', 'FAILED']),
  /** 메시지 타입 */
  type: z.enum([
    /** 일반 응답 */
    'PLAIN_ANSWER',
    /** Tool 호출 응답 */
    'TOOL_CALLING',
  ]),
  /** 응답 메시지 */
  message: z.string().optional(),
  /** 추론 과정 (프롬프트 응답 디버깅용) */
  reason: z.string(),
  /** data */
  data: z.unknown().optional(),
});

export type AiResponse = z.infer<typeof AiResponseBaseSchema>;

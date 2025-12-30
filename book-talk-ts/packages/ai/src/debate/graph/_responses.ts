import { AiResponseBaseSchema } from '@src/ai-response';
import { ResponseType } from '@src/debate/graph/debate.state';
import { z } from 'zod';

export const SupervisorNodeResponseSchema = AiResponseBaseSchema.extend({
  /** 결과 상태 */
  status: z.enum(['SUCCESS', 'FAILED']),
  /** 메시지 (프롬프트 응답 디버깅용) */
  message: z.string(),
  /** data */
  data: z.object({
    /** 하위 agent 호출이 필요할 경우 명령 */
    command: z.enum(['debate_start']).optional(),
    /** 하위 agent 호출이 필요 없을 경우 응답 */
    response: z.object({ content: z.string(), type: z.enum(['plain_answer']) }).optional(),
  }),
});

export const DebateStarterNodeResponseSchema = AiResponseBaseSchema.extend({
  /** 결과 상태 */
  status: z.enum(['SUCCESS', 'FAILED']),
  /** 메시지 (프롬프트 응답 디버깅용) */
  message: z.string(),
  /** data */
  data: z.object({
    /** 하위 agent 호출이 필요할 경우 명령 */
    command: z.enum(['get_debate_info']).optional(),
    /** 하위 agent 호출이 필요 없을 경우 응답 */
    response: z
      .object({ content: z.string(), type: z.enum([ResponseType.DEBATE_START_ANSWER]) })
      .optional(),
  }),
});

export type SupervisorNodeResponse = z.infer<typeof SupervisorNodeResponseSchema>;
export type DebateStarterNodeResponse = z.infer<typeof DebateStarterNodeResponseSchema>;

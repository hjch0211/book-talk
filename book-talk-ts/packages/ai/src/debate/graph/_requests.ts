import { AiRequestBaseSchema } from '@src/ai-request.js';
import { z } from 'zod';

export const SupervisorNodeRequestSchema = AiRequestBaseSchema.extend({
  /** 명령어(사회자 이기 때문에 대화 맥락의 자연어가 들어옴) */
  command: z.string(),
  /** data */
  data: z.object({
    /** 토론방 ID */
    debateId: z.string(),
  }),
});

export const DebateStarterNodeRequestSchema = AiRequestBaseSchema.extend({
  /** 명령어 */
  command: z.enum(['DEBATE_START']),
  /** data */
  data: z.object({
    /** 토론방 ID */
    debateId: z.string().optional(),
    /** 토론방 정보 */
    debateInfo: z.any().optional(),
  }),
});

export const GetDebateInfoToolNodeRequestSchema = AiRequestBaseSchema.extend({
  /** 명령어 */
  command: z.enum(['GET_DEBATE_INFO']),
  /** data */
  data: z.object({
    /** 토론방 ID */
    debateId: z.string().min(1, 'debateId는 필수입니다'),
  }),
});

export type SupervisorNodeRequest = z.infer<typeof SupervisorNodeRequestSchema>;
export type DebateStarterNodeRequest = z.infer<typeof DebateStarterNodeRequestSchema>;
export type GetDebateInfoToolNodeRequest = z.infer<typeof GetDebateInfoToolNodeRequestSchema>;

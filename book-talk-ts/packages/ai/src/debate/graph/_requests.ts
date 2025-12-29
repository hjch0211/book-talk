import { AiRequestBaseSchema } from '@src/ai-request';
import { z } from 'zod';

export const SupervisorNodeRequestSchema = AiRequestBaseSchema.extend({
  /** 명령어(사회자 이기 떄문에 대화 맥락의 자연어가 들어옴) */
  command: z.string(),
  /** data */
  data: z.object({
    /** 토론방 ID */
    debateId: z.string(),
  }),
});

export const DebateStarterNodeRequestSchema = AiRequestBaseSchema.extend({
  /** 명령어 */
  command: z.enum(['debate_start']),
  /** data */
  data: z.object({
    /** 토론방 ID */
    debateId: z.string().optional(),
    /** 토로방 정보 */
    debateInfo: z.any().optional(),
  }),
});

export const GetDebateInfoToolNodeRequestSchema = AiRequestBaseSchema.extend({
  /** 명령어 */
  command: z.enum(['get_debate_info']),
  /** data */
  data: z.object({
    /** 토론방 ID */
    debateId: z.string(),
  }),
});

export type SupervisorNodeRequest = z.infer<typeof SupervisorNodeRequestSchema>;
export type DebateStarterNodeRequest = z.infer<typeof DebateStarterNodeRequestSchema>;
export type GetDebateInfoToolNodeRequest = z.infer<typeof GetDebateInfoToolNodeRequestSchema>;

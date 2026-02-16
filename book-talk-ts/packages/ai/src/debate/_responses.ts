import { AiResponseBaseSchema } from '@src/ai-response.js';
import { z } from 'zod';

export const SupervisorAgentResponseSchema = AiResponseBaseSchema.extend({
  /** 결과 상태 */
  status: z.enum(['SUCCESS', 'FAILED']),
  /** 메시지 타입 */
  type: z.enum([
    /** 일반 응답 */
    'PLAIN_ANSWER',
    /** Tool 호출 응답 */
    'TOOL_CALLING',
  ]),
  /** 응답 메시지 (type이 PLAIN_ANSWER일 때만) */
  message: z.string().nullable(),
  /** 추론 과정 (프롬프트 응답 디버깅용) */
  reason: z.string(),
  /** data */
  data: z.object({
    /** 하위 agent 호출이 필요할 경우 명령 */
    command: z.enum(['DEBATE_START']).nullable(),
    /** 하위 agent 호출이 필요 없을 경우 응답 */
    response: z.object({ content: z.string(), type: z.enum(['PLAIN_ANSWER']) }).nullable(),
  }),
});

export const DebateStarterAgentResponseSchema = AiResponseBaseSchema.extend({
  /** 결과 상태 */
  status: z.enum(['SUCCESS', 'FAILED']),
  /** 메시지 타입 */
  type: z.enum([
    /** 일반 응답 */
    'PLAIN_ANSWER',
    /** Tool 호출 응답 */
    'TOOL_CALLING',
  ]),
  /** 응답 메시지 (type이 PLAIN_ANSWER일 때만) */
  message: z.string().nullable(),
  /** 추론 과정 (프롬프트 응답 디버깅용) */
  reason: z.string(),
  /** data */
  data: z.object({
    /** 하위 agent 호출이 필요할 경우 명령 */
    command: z.enum(['GET_DEBATE_INFO']).nullable(),
    /** 하위 agent 호출이 필요 없을 경우 응답 */
    response: z.object({ content: z.string(), type: z.enum(['DEBATE_START_ANSWER']) }).nullable(),
  }),
});

export const DebatePersonaAAgentResponseSchema = AiResponseBaseSchema.extend({
  /** 결과 상태 */
  status: z.enum(['SUCCESS', 'FAILED']),
  /** 메시지 타입 */
  type: z.enum([
    /** 일반 응답 */
    'PLAIN_ANSWER',
  ]),
  /** 응답 메시지 (type이 PLAIN_ANSWER일 때만) */
  message: z.string().nullable(),
  /** 추론 과정 (프롬프트 응답 디버깅용) */
  reason: z.string(),
  /** data */
  data: z.object({
    /** 토론 참여 응답 */
    response: z.object({ content: z.string(), type: z.enum(['DEBATE_ANSWER']) }),
  }),
});

export type SupervisorAgentResponse = z.infer<typeof SupervisorAgentResponseSchema>;
export type DebateStarterAgentResponse = z.infer<typeof DebateStarterAgentResponseSchema>;
export type DebatePersonaAAgentResponse = z.infer<typeof DebatePersonaAAgentResponseSchema>;

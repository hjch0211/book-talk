import { z } from 'zod';

export const SummarizeRequestSchema = z.object({
  /** 토론방 ID */
  debateId: z.string(),
});

export const ChatRequestSchema = z.object({
  /** 사용자 메시지 */
  message: z.string(),
  /** 채팅방 ID */
  chatId: z.string(),
  /** 역할 */
  role: z.enum(['user', 'assistant']),
});

export type SummarizeRequest = z.infer<typeof SummarizeRequestSchema>;
export type ChatRequest = z.infer<typeof ChatRequestSchema>;

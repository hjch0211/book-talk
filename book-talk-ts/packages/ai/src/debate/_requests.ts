import { z } from 'zod';

export const SummarizeRequestSchema = z.object({
  /** 토론방 ID */
  debateId: z.string(),
});

export const CreateRequestSchema = z.object({
  /** 토론방 ID */
  debateId: z.string(),
});

export const ChatRequestSchema = z.object({
  /** 사용자 메시지 */
  message: z.string(),
  /** 채팅방 ID */
  chatId: z.string(),
});

export type SummarizeRequest = z.infer<typeof SummarizeRequestSchema>;
export type CreateRequest = z.infer<typeof CreateRequestSchema>;
export type ChatRequest = z.infer<typeof ChatRequestSchema>;

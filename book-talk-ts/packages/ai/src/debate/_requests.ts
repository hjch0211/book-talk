import { z } from 'zod';

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

export type CreateRequest = z.infer<typeof CreateRequestSchema>;
export type ChatRequest = z.infer<typeof ChatRequestSchema>;

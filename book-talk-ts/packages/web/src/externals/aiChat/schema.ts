import { z } from 'zod/v4';

export const CreateAiChatRequestSchema = z.object({
  debateId: z.string().min(1, '토론 ID를 입력해주세요'),
  persona: z.string().min(1, '페르소나를 입력해주세요'),
});

export const CreateAiChatResponseSchema = z.object({
  chatId: z.string(),
});

export enum AiChatMessageStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export const AiChatMessageInfoSchema = z.object({
  id: z.string(),
  role: z.string(),
  content: z.string(),
  status: z.enum([AiChatMessageStatus.PENDING, AiChatMessageStatus.COMPLETED, AiChatMessageStatus.FAILED]),
  createdAt: z.string(),
});

export const AiChatMemberInfoSchema = z.object({
  accountId: z.string(),
  accountName: z.string(),
});

export const FindOneAiChatResponseSchema = z.object({
  chatId: z.string(),
  debateId: z.string(),
  persona: z.string(),
  member: AiChatMemberInfoSchema,
  messages: z.array(AiChatMessageInfoSchema),
  createdAt: z.string(),
});

export type CreateAiChatRequest = z.infer<typeof CreateAiChatRequestSchema>;
export type CreateAiChatResponse = z.infer<typeof CreateAiChatResponseSchema>;
export type AiChatMemberInfo = z.infer<typeof AiChatMemberInfoSchema>;
export type AiChatMessageInfo = z.infer<typeof AiChatMessageInfoSchema>;
export type FindOneAiChatResponse = z.infer<typeof FindOneAiChatResponseSchema>;

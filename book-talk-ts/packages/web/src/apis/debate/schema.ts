import { z } from 'zod';

export const CreateDebateRequestSchema = z.object({
  bookTitle: z.string().min(1, '책 제목을 입력해주세요'),
  bookISBN: z.string().min(1, '책 ISBN을 입력해주세요'),
  bookAuthor: z.string().min(1, '책 저자를 입력해주세요'),
  bookDescription: z.string().nullable().optional(),
  bookImageUrl: z.string().nullable().optional(),
  topic: z
    .string()
    .min(1, '토론 주제를 입력해주세요')
    .max(200, '토론 주제는 200자 이내로 입력해주세요'),
  description: z.string().max(500, '토론 설명은 500자 이내로 입력해주세요').nullable().optional(),
});

export const JoinDebateRequestSchema = z.object({
  debateId: z.string().min(1, '토론 ID를 입력해주세요'),
});

export const UpdateDebateRequestSchema = z.object({
  debateId: z.string().min(1, '토론 ID를 입력해주세요'),
  roundType: z.enum(['PREPARATION', 'PRESENTATION', 'FREE']),
  ended: z.boolean(),
});

export const MemberInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.enum(['HOST', 'MEMBER']),
});

export const PresentationInfoSchema = z.object({
  id: z.string(),
  accountId: z.string(),
});

export const RoundInfoSchema = z.object({
  id: z.number(),
  type: z.enum(['PRESENTATION', 'FREE']),
  currentSpeakerId: z.number().nullable().optional(),
  currentSpeakerAccountId: z.string().nullable().optional(),
  nextSpeakerAccountId: z.string().nullable().optional(),
  currentSpeakerEndedAt: z.string().nullable().optional(),
  createdAt: z.string(),
  endedAt: z.string().nullable().optional(),
});

export const BookInfoSchema = z.object({
  title: z.string(),
  author: z.string(),
  description: z.string(),
  imageUrl: z.string(),
});

export const FindOneDebateResponseSchema = z.object({
  id: z.string(),
  members: z.array(MemberInfoSchema),
  presentations: z.array(PresentationInfoSchema),
  currentRound: RoundInfoSchema.nullable().optional(),
  bookInfo: BookInfoSchema,
  topic: z.string(),
  description: z.string().nullable().optional(),
  closedAt: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  archivedAt: z.string().nullable().optional(),
});

export const CreateRoundRequestSchema = z.object({
  debateId: z.string().min(1, '토론 ID를 입력해주세요'),
  type: z.enum(['PRESENTATION', 'FREE']),
});

export const CreateRoundResponseSchema = z.object({
  id: z.number(),
});

export const PatchRoundRequestSchema = z.object({
  debateRoundId: z.number(),
  nextSpeakerId: z.string().nullable().optional(),
  ended: z.boolean().nullable().optional(),
});

export const CreateRoundSpeakerRequestSchema = z.object({
  debateRoundId: z.number(),
  nextSpeakerId: z.string().min(1, '다음 발언자 ID를 입력해주세요'),
});

export const PatchRoundSpeakerRequestSchema = z.object({
  debateRoundSpeakerId: z.number(),
  extension: z.boolean().nullable().optional(),
  ended: z.boolean().nullable().optional(),
});

export const CreateChatRequestSchema = z.object({
  debateId: z.string().min(1, '토론 ID를 입력해주세요'),
  content: z.string().min(1, '채팅 내용을 입력해주세요'),
});

export const CreateChatResponseSchema = z.object({
  id: z.number(),
  debateId: z.string(),
  accountId: z.string(),
  accountName: z.string(),
  content: z.string(),
  createdAt: z.string(),
});

export const ChatResponseSchema = z.object({
  id: z.number(),
  debateId: z.string(),
  accountId: z.string(),
  accountName: z.string(),
  content: z.string(),
  createdAt: z.string(),
});

export type CreateDebateRequest = z.infer<typeof CreateDebateRequestSchema>;
export type JoinDebateRequest = z.infer<typeof JoinDebateRequestSchema>;
export type UpdateDebateRequest = z.infer<typeof UpdateDebateRequestSchema>;
export type FindOneDebateResponse = z.infer<typeof FindOneDebateResponseSchema>;
export type BookInfo = z.infer<typeof BookInfoSchema>;
export type MemberInfo = z.infer<typeof MemberInfoSchema>;
export type PresentationInfo = z.infer<typeof PresentationInfoSchema>;
export type RoundInfo = z.infer<typeof RoundInfoSchema>;
export type CreateRoundRequest = z.infer<typeof CreateRoundRequestSchema>;
export type CreateRoundResponse = z.infer<typeof CreateRoundResponseSchema>;
export type PatchRoundRequest = z.infer<typeof PatchRoundRequestSchema>;
export type CreateRoundSpeakerRequest = z.infer<typeof CreateRoundSpeakerRequestSchema>;
export type PatchRoundSpeakerRequest = z.infer<typeof PatchRoundSpeakerRequestSchema>;
export type CreateChatRequest = z.infer<typeof CreateChatRequestSchema>;
export type CreateChatResponse = z.infer<typeof CreateChatResponseSchema>;
export type ChatResponse = z.infer<typeof ChatResponseSchema>;

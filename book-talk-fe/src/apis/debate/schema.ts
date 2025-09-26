import {z} from 'zod';


export const CreateDebateRequestSchema = z.object({
    bookImageUrl: z.string()
        .min(1, '책 이미지 URL을 입력해주세요'),
    topic: z.string()
        .min(1, '토론 주제를 입력해주세요')
        .max(200, '토론 주제는 200자 이내로 입력해주세요'),
    description: z.string()
        .max(500, '토론 설명은 500자 이내로 입력해주세요')
        .nullable()
        .optional(),
});

export const JoinDebateRequestSchema = z.object({
    debateId: z.string()
        .min(1, '토론 ID를 입력해주세요'),
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
    currentSpeakerId: z.string(),
    nextSpeakerId: z.string().nullable().optional(),
    currentSpeakerEndedAt: z.string().nullable().optional(),
    createdAt: z.string(),
    endedAt: z.string().nullable().optional(),
});

export const FindOneDebateResponseSchema = z.object({
    id: z.string(),
    members: z.array(MemberInfoSchema),
    presentations: z.array(PresentationInfoSchema),
    currentRound: RoundInfoSchema.nullable().optional(),
    bookImageUrl: z.string(),
    topic: z.string(),
    description: z.string().nullable().optional(),
    closedAt: z.string().nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    archivedAt: z.string().nullable().optional(),
});

export const CreateRoundRequestSchema = z.object({
    debateId: z.string()
        .min(1, '토론 ID를 입력해주세요'),
    type: z.enum(['PRESENTATION', 'FREE']),
    nextSpeakerId: z.string()
        .min(1, '다음 발언자 ID를 입력해주세요'),
});

export const PatchRoundRequestSchema = z.object({
    debateRoundId: z.number(),
    nextSpeakerId: z.string().nullable().optional(),
    ended: z.boolean().nullable().optional(),
});

export const CreateRoundSpeakerRequestSchema = z.object({
    debateRoundId: z.number(),
    nextSpeakerId: z.string()
        .min(1, '다음 발언자 ID를 입력해주세요'),
});

export const PatchRoundSpeakerRequestSchema = z.object({
    debateRoundSpeakerId: z.number(),
    extension: z.boolean().nullable().optional(),
    ended: z.boolean().nullable().optional(),
});

export type CreateDebateRequest = z.infer<typeof CreateDebateRequestSchema>;
export type JoinDebateRequest = z.infer<typeof JoinDebateRequestSchema>;
export type FindOneDebateResponse = z.infer<typeof FindOneDebateResponseSchema>;
export type MemberInfo = z.infer<typeof MemberInfoSchema>;
export type PresentationInfo = z.infer<typeof PresentationInfoSchema>;
export type RoundInfo = z.infer<typeof RoundInfoSchema>;
export type CreateRoundRequest = z.infer<typeof CreateRoundRequestSchema>;
export type PatchRoundRequest = z.infer<typeof PatchRoundRequestSchema>;
export type CreateRoundSpeakerRequest = z.infer<typeof CreateRoundSpeakerRequestSchema>;
export type PatchRoundSpeakerRequest = z.infer<typeof PatchRoundSpeakerRequestSchema>;
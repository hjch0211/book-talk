import { z } from 'zod';

export const CreateDebateRequestSchema = z.object({
  bookTitle: z.string().min(1, { message: '책 제목을 입력해주세요' }),
  bookISBN: z.string().min(1, { message: '책 ISBN을 입력해주세요' }),
  bookAuthor: z.string().min(1, { message: '책 저자를 입력해주세요' }),
  bookDescription: z.string().nullish(),
  detailUrl: z.string().min(1, { message: '책 상세 URL을 입력해주세요' }),
  bookImageUrl: z.string().nullish(),
  topic: z
    .string()
    .min(1, { message: '토론 주제를 입력해주세요' })
    .max(200, { message: '토론 주제는 200자 이내로 입력해주세요' }),
  description: z.string().max(500, { message: '토론 설명은 500자 이내로 입력해주세요' }).nullish(),
  maxMemberCount: z
    .number()
    .int()
    .min(2, { message: '참여자 수는 최소 2명입니다' })
    .max(4, { message: '참여자 수는 최대 4명입니다' }),
  startAt: z
    .string()
    .min(1, { message: '토론 일정을 선택해주세요' })
    .refine(
      (val) => !Number.isNaN(new Date(val).getTime()) && new Date(val) > new Date(),
      '토론 일정은 현재 시각 이후여야 합니다'
    ),
});

export const DebateFormSchema = z
  .object({
    topic: z
      .string()
      .min(1, { message: '토론 주제를 입력해주세요' })
      .max(60, { message: '토론 주제는 60자 이내로 입력해주세요' }),

    description: z
      .string()
      .max(300, { message: '토론 설명은 300자 이내로 입력해주세요' })
      .optional(),

    bookISBN: z.string().min(1, { message: '책을 선택해주세요' }),

    scheduledDate: z.string().min(1, { message: '토론 일자를 선택해주세요' }),

    scheduledTime: z.string().min(1, { message: '토론 시간을 선택해주세요' }),

    participantCount: z.number().min(2).max(10),
  })
  .superRefine((data, ctx) => {
    if (!data.scheduledDate || !data.scheduledTime) return;

    const startAt = new Date(`${data.scheduledDate}T${data.scheduledTime}`);

    if (startAt <= new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '토론 일정은 현재 시각 이후여야 합니다',
        path: ['scheduledTime'],
      });
    }
  });

export const DebateModificationFormSchema = z
  .object({
    topic: z
      .string()
      .min(1, { message: '토론 주제를 입력해주세요' })
      .max(60, { message: '토론 주제는 60자 이내로 입력해주세요' }),

    description: z
      .string()
      .max(300, { message: '토론 설명은 300자 이내로 입력해주세요' })
      .optional(),

    scheduledDate: z.string().min(1, { message: '토론 일자를 선택해주세요' }),

    scheduledTime: z.string().min(1, { message: '토론 시간을 선택해주세요' }),

    participantCount: z.number().min(2).max(4),
  })
  .superRefine((data, ctx) => {
    if (!data.scheduledDate || !data.scheduledTime) return;

    const startAt = new Date(`${data.scheduledDate}T${data.scheduledTime}`);

    if (startAt <= new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '토론 일정은 현재 시각 이후여야 합니다',
        path: ['scheduledTime'],
      });
    }
  });

export const JoinDebateRequestSchema = z.object({
  debateId: z.string().min(1, { message: '토론 ID를 입력해주세요' }),
});

export const UpdateDebateRequestSchema = z.object({
  debateId: z.string().min(1, { message: '토론 ID를 입력해주세요' }),
  roundType: z.enum(['PREPARATION', 'PRESENTATION', 'FREE']),
  ended: z.boolean(),
  topic: z.string().min(1).max(200),
  description: z.string().max(500).nullish(),
  maxMemberCount: z.number().int().min(2).max(4),
  startAt: z.string(),
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
  type: z.enum(['PREPARATION', 'PRESENTATION', 'FREE']),
  currentSpeakerId: z.number().nullish(),
  currentSpeakerAccountId: z.string().nullish(),
  nextSpeakerAccountId: z.string().nullish(),
  currentSpeakerEndedAt: z.string().nullish(),
  createdAt: z.string(),
  endedAt: z.string().nullish(),
});

export const BookInfoSchema = z.object({
  title: z.string(),
  author: z.string(),
  description: z.string().nullish(),
  imageUrl: z.string().nullish(),
  detailUrl: z.string(),
});

export const FindOneDebateResponseSchema = z.object({
  id: z.string(),
  members: z.array(MemberInfoSchema),
  presentations: z.array(PresentationInfoSchema),
  currentRound: RoundInfoSchema.nullish(),
  bookInfo: BookInfoSchema,
  topic: z.string(),
  maxMemberCount: z.number(),
  description: z.string().nullish(),
  aiSummarized: z.string().nullish(),
  startAt: z.string(),
  closedAt: z.string().nullish(),
  createdAt: z.string(),
  updatedAt: z.string(),
  archivedAt: z.string().nullish(),
});

export const CreateRoundRequestSchema = z.object({
  debateId: z.string().min(1, { message: '토론 ID를 입력해주세요' }),
  type: z.enum(['PRESENTATION', 'FREE']),
});

export const CreateRoundResponseSchema = z.object({
  id: z.number(),
});

export const PatchRoundRequestSchema = z.object({
  debateRoundId: z.number(),
  nextSpeakerId: z.string().nullish(),
  ended: z.boolean().nullish(),
});

export const CreateRoundSpeakerRequestSchema = z.object({
  debateRoundId: z.number(),
  nextSpeakerId: z.string().min(1, { message: '다음 발언자 ID를 입력해주세요' }),
});

export const PatchRoundSpeakerRequestSchema = z.object({
  debateRoundSpeakerId: z.number(),
  extension: z.boolean().nullish(),
  ended: z.boolean().nullish(),
});

export const CreateChatRequestSchema = z.object({
  debateId: z.string().min(1, { message: '토론 ID를 입력해주세요' }),
  content: z.string().min(1, { message: '채팅 내용을 입력해주세요' }),
});

export const CreateChatResponseSchema = z.object({
  id: z.number(),
  debateId: z.string(),
  accountId: z.string(),
  accountName: z.string(),
  content: z.string(),
  createdAt: z.string(),
});

export const ChatItemSchema = z.object({
  id: z.number(),
  debateId: z.string(),
  accountId: z.string(),
  accountName: z.string(),
  content: z.string(),
  createdAt: z.string(),
});

export const ChatResponseSchema = z.array(ChatItemSchema);

export const FindAllDebateBookInfoSchema = z.object({
  title: z.string(),
  author: z.string(),
  description: z.string().nullish(),
  imageUrl: z.string().nullish(),
  detailUrl: z.string(),
});

export const FindAllDebateInfoSchema = z.object({
  id: z.string(),
  bookInfo: FindAllDebateBookInfoSchema,
  topic: z.string(),
  currentRound: z.enum(['PREPARATION', 'PRESENTATION', 'FREE']).nullish(),
  description: z.string().nullish(),
  maxMemberCount: z.number(),
  members: z.array(MemberInfoSchema),
  closedAt: z.string().nullish(),
  startAt: z.string(),
  createdAt: z.string(),
});

export const PageSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    content: z.array(itemSchema),
    totalElements: z.number(),
    totalPages: z.number(),
    number: z.number(),
    size: z.number(),
  });

export const FindAllDebateResponseSchema = z.object({
  page: PageSchema(FindAllDebateInfoSchema),
});

export type FindAllDebateInfo = z.infer<typeof FindAllDebateInfoSchema>;
export type FindAllDebateResponse = z.infer<typeof FindAllDebateResponseSchema>;

export type CreateDebateRequest = z.infer<typeof CreateDebateRequestSchema>;
export type DebateForm = z.infer<typeof DebateFormSchema>;
export type DebateModificationForm = z.infer<typeof DebateModificationFormSchema>;

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
export type ChatItem = z.infer<typeof ChatItemSchema>;
export type ChatResponse = z.infer<typeof ChatResponseSchema>;

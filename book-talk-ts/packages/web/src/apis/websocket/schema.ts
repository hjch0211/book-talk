import {z} from 'zod';

export enum WS_TYPE {
  /** Client → Server */
  C_JOIN_DEBATE = 'C_JOIN_DEBATE',
  C_TOGGLE_HAND = 'C_TOGGLE_HAND',
  C_CHAT = 'C_CHAT',
  C_VOICE_JOIN = 'C_VOICE_JOIN',
  C_VOICE_OFFER = 'C_VOICE_OFFER',
  C_VOICE_ANSWER = 'C_VOICE_ANSWER',
  C_VOICE_ICE_CANDIDATE = 'C_VOICE_ICE_CANDIDATE',
  /** Server → Client */
  S_JOIN_SUCCESS = 'S_JOIN_SUCCESS',
  S_JOIN_ERROR = 'S_JOIN_ERROR',
  S_DEBATE_ONLINE_ACCOUNTS_UPDATE = 'S_DEBATE_ONLINE_ACCOUNTS_UPDATE',
  S_HAND_RAISE_UPDATE = 'S_HAND_RAISE_UPDATE',
  S_CHAT = 'S_CHAT',
  S_SPEAKER_UPDATE = 'S_SPEAKER_UPDATE',
  S_DEBATE_ROUND_UPDATE = 'S_DEBATE_ROUND_UPDATE',
  S_VOICE_JOIN = 'S_VOICE_JOIN',
  S_VOICE_OFFER = 'S_VOICE_OFFER',
  S_VOICE_ANSWER = 'S_VOICE_ANSWER',
  S_VOICE_ICE_CANDIDATE = 'S_VOICE_ICE_CANDIDATE',
}

export const WS_JoinDebateRequestSchema = z.object({
  type: z.literal(WS_TYPE.C_JOIN_DEBATE),
  payload: z.object({
    debateId: z.string(),
    accountId: z.string(),
  }),
});

export const WS_ToggleHandRequestSchema = z.object({
  type: z.literal(WS_TYPE.C_TOGGLE_HAND),
  payload: z.object({
    debateId: z.string(),
    accountId: z.string(),
  }),
});

export const WS_ChatRequestSchema = z.object({
  type: z.literal(WS_TYPE.C_CHAT),
  payload: z.object({
    debateId: z.string(),
    chatId: z.number(),
  }),
});

export const WS_JoinSuccessResponseSchema = z.object({
  type: z.literal(WS_TYPE.S_JOIN_SUCCESS),
  debateId: z.string(),
  accountId: z.string(),
});

export const WS_JoinErrorResponseSchema = z.object({
  type: z.literal(WS_TYPE.S_JOIN_ERROR),
  debateId: z.string(),
  accountId: z.string(),
  reason: z.string(),
});

export const WS_DebateOnlineAccountsUpdateResponseSchema = z.object({
  type: z.literal(WS_TYPE.S_DEBATE_ONLINE_ACCOUNTS_UPDATE),
  payload: z.object({
    onlineAccountIds: z.array(z.string()),
  }),
});

export const RaisedHandInfoSchema = z.object({
  accountId: z.string(),
  raisedAt: z.string(),
});

export const WS_HandRaiseUpdateResponseSchema = z.object({
  type: z.literal(WS_TYPE.S_HAND_RAISE_UPDATE),
  payload: z.object({
    raisedHandInfoList: z.array(RaisedHandInfoSchema),
  }),
});

export const WS_ChatResponseSchema = z.object({
  type: z.literal(WS_TYPE.S_CHAT),
  payload: z.object({
    debateId: z.string(),
    chatId: z.number(),
  }),
});

export const CurrentSpeakerInfoSchema = z.object({
  accountId: z.string().nullable(),
  accountName: z.string().nullable(),
  endedAt: z.number().nullable(),
});

export const NextSpeakerInfoSchema = z.object({
  accountId: z.string(),
  accountName: z.string(),
});

export const WS_SpeakerUpdateResponseSchema = z.object({
  type: z.literal(WS_TYPE.S_SPEAKER_UPDATE),
  debateId: z.string(),
  currentSpeaker: CurrentSpeakerInfoSchema.nullable(),
  nextSpeaker: NextSpeakerInfoSchema.nullable(),
});

export const RoundInfoSchema = z.object({
  id: z.number(),
  type: z.string(),
  nextSpeakerId: z.string().nullable(),
  nextSpeakerName: z.string().nullable(),
  createdAt: z.number(),
  endedAt: z.number().nullable(),
});

export const WS_DebateRoundUpdateResponseSchema = z.object({
  type: z.literal(WS_TYPE.S_DEBATE_ROUND_UPDATE),
  debateId: z.string(),
  round: RoundInfoSchema,
  currentSpeaker: CurrentSpeakerInfoSchema,
});

export const WS_VoiceJoinRequestSchema = z.object({
  type: z.literal(WS_TYPE.C_VOICE_JOIN),
  debateId: z.string(),
  accountId: z.string(),
});

export const WS_VoiceOfferRequestSchema = z.object({
  type: z.literal(WS_TYPE.C_VOICE_OFFER),
  debateId: z.string(),
  fromId: z.string(),
  toId: z.string(),
  offer: z.custom<RTCSessionDescriptionInit>(),
});

export const WS_VoiceAnswerRequestSchema = z.object({
  type: z.literal(WS_TYPE.C_VOICE_ANSWER),
  debateId: z.string(),
  fromId: z.string(),
  toId: z.string(),
  answer: z.custom<RTCSessionDescriptionInit>(),
});

export const WS_VoiceIceCandidateRequestSchema = z.object({
  type: z.literal(WS_TYPE.C_VOICE_ICE_CANDIDATE),
  debateId: z.string(),
  fromId: z.string(),
  toId: z.string(),
  candidate: z.custom<RTCIceCandidateInit>(),
});

export const WS_VoiceJoinResponseSchema = z.object({
  type: z.literal(WS_TYPE.S_VOICE_JOIN),
  debateId: z.string(),
  fromId: z.string(),
});

export const WS_VoiceOfferResponseSchema = z.object({
  type: z.literal(WS_TYPE.S_VOICE_OFFER),
  debateId: z.string(),
  fromId: z.string(),
  toId: z.string(),
  offer: z.custom<RTCSessionDescriptionInit>(),
});

export const WS_VoiceAnswerResponseSchema = z.object({
  type: z.literal(WS_TYPE.S_VOICE_ANSWER),
  debateId: z.string(),
  fromId: z.string(),
  toId: z.string(),
  answer: z.custom<RTCSessionDescriptionInit>(),
});

export const WS_VoiceIceCandidateResponseSchema = z.object({
  type: z.literal(WS_TYPE.S_VOICE_ICE_CANDIDATE),
  debateId: z.string(),
  fromId: z.string(),
  toId: z.string(),
  candidate: z.custom<RTCIceCandidateInit>(),
});

export const WebSocketMessageSchema = z.discriminatedUnion('type', [
  // Client messages
  WS_JoinDebateRequestSchema,
  WS_ToggleHandRequestSchema,
  WS_ChatRequestSchema,
  // Server messages
  WS_JoinSuccessResponseSchema,
  WS_JoinErrorResponseSchema,
  WS_DebateOnlineAccountsUpdateResponseSchema,
  WS_HandRaiseUpdateResponseSchema,
  WS_ChatResponseSchema,
  WS_SpeakerUpdateResponseSchema,
  WS_DebateRoundUpdateResponseSchema,
  // Voice - Client
  WS_VoiceJoinRequestSchema,
  WS_VoiceOfferRequestSchema,
  WS_VoiceAnswerRequestSchema,
  WS_VoiceIceCandidateRequestSchema,
  // Voice - Server
  WS_VoiceJoinResponseSchema,
  WS_VoiceOfferResponseSchema,
  WS_VoiceAnswerResponseSchema,
  WS_VoiceIceCandidateResponseSchema,
]);

export type WS_JoinDebateRequest = z.infer<typeof WS_JoinDebateRequestSchema>;
export type WS_ToggleHandRequest = z.infer<typeof WS_ToggleHandRequestSchema>;
export type WS_ChatRequest = z.infer<typeof WS_ChatRequestSchema>;

export type WS_JoinSuccessResponse = z.infer<typeof WS_JoinSuccessResponseSchema>;
export type WS_JoinErrorResponse = z.infer<typeof WS_JoinErrorResponseSchema>;
export type WS_DebateOnlineAccountsUpdateResponse = z.infer<
    typeof WS_DebateOnlineAccountsUpdateResponseSchema
>;
export type WS_HandRaiseUpdateResponse = z.infer<typeof WS_HandRaiseUpdateResponseSchema>;
export type WS_ChatResponse = z.infer<typeof WS_ChatResponseSchema>;
export type WS_SpeakerUpdateResponse = z.infer<typeof WS_SpeakerUpdateResponseSchema>;
export type WS_DebateRoundUpdateResponse = z.infer<typeof WS_DebateRoundUpdateResponseSchema>;

// Voice - Client types
export type WS_VoiceJoinRequest = z.infer<typeof WS_VoiceJoinRequestSchema>;
export type WS_VoiceOfferRequest = z.infer<typeof WS_VoiceOfferRequestSchema>;
export type WS_VoiceAnswerRequest = z.infer<typeof WS_VoiceAnswerRequestSchema>;
export type WS_VoiceIceCandidateRequest = z.infer<typeof WS_VoiceIceCandidateRequestSchema>;

/** 음성 메시지 페이로드 (debateId 제외 - 클라이언트가 자동 추가) */
export type VoiceMessagePayload =
  | Omit<WS_VoiceJoinRequest, 'debateId'>
  | Omit<WS_VoiceOfferRequest, 'debateId'>
  | Omit<WS_VoiceAnswerRequest, 'debateId'>
  | Omit<WS_VoiceIceCandidateRequest, 'debateId'>;

// Voice - Server types
export type WS_VoiceJoinResponse = z.infer<typeof WS_VoiceJoinResponseSchema>;
export type WS_VoiceOfferResponse = z.infer<typeof WS_VoiceOfferResponseSchema>;
export type WS_VoiceAnswerResponse = z.infer<typeof WS_VoiceAnswerResponseSchema>;
export type WS_VoiceIceCandidateResponse = z.infer<typeof WS_VoiceIceCandidateResponseSchema>;

export type WebSocketMessage = z.infer<typeof WebSocketMessageSchema>;

export type RaisedHandInfo = z.infer<typeof RaisedHandInfoSchema>;
export type CurrentSpeakerInfo = z.infer<typeof CurrentSpeakerInfoSchema>;
export type NextSpeakerInfo = z.infer<typeof NextSpeakerInfoSchema>;
export type RoundInfo = z.infer<typeof RoundInfoSchema>;

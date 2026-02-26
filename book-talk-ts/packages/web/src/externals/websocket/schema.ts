import { z } from 'zod';

// Message Type Enums
export enum WSRequestMessageType {
  C_JOIN_DEBATE = 'C_JOIN_DEBATE',
  C_LEAVE_DEBATE = 'C_LEAVE_DEBATE',
  C_HEARTBEAT = 'C_HEARTBEAT',
  C_TOGGLE_HAND = 'C_TOGGLE_HAND',
  C_CHAT_MESSAGE = 'C_CHAT_MESSAGE',
  C_VOICE_JOIN = 'C_VOICE_JOIN',
  C_VOICE_OFFER = 'C_VOICE_OFFER',
  C_VOICE_ANSWER = 'C_VOICE_ANSWER',
  C_VOICE_ICE_CANDIDATE = 'C_VOICE_ICE_CANDIDATE',
}

export enum WSResponseMessageType {
  S_JOIN_SUCCESS = 'S_JOIN_SUCCESS',
  S_HEARTBEAT_ACK = 'S_HEARTBEAT_ACK',
  S_DEBATE_ONLINE_ACCOUNTS_UPDATE = 'S_DEBATE_ONLINE_ACCOUNTS_UPDATE',
  S_HAND_RAISE_UPDATE = 'S_HAND_RAISE_UPDATE',
  S_CHAT_MESSAGE = 'S_CHAT_MESSAGE',
  S_SPEAKER_UPDATE = 'S_SPEAKER_UPDATE',
  S_DEBATE_ROUND_UPDATE = 'S_DEBATE_ROUND_UPDATE',
  S_AI_SUMMARY_COMPLETED = 'S_AI_SUMMARY_COMPLETED',
  S_VOICE_JOIN = 'S_VOICE_JOIN',
  S_VOICE_OFFER = 'S_VOICE_OFFER',
  S_VOICE_ANSWER = 'S_VOICE_ANSWER',
  S_VOICE_ICE_CANDIDATE = 'S_VOICE_ICE_CANDIDATE',
  S_AI_CHAT_COMPLETED = 'S_AI_CHAT_COMPLETED',
  S_USER_MESSAGE_SAVED = 'S_USER_MESSAGE_SAVED',
}

// ============ Request Payload Schemas ============

export const JoinDebatePayloadSchema = z.object({
  debateId: z.string(),
  accountId: z.string(),
  accountName: z.string(),
  voiceEnabled: z.boolean().default(true),
});

export const LeaveDebatePayloadSchema = z.object({
  debateId: z.string(),
  accountId: z.string(),
});

export const HeartbeatPayloadSchema = z.object({
  accountId: z.string().optional(),
});

export const ToggleHandPayloadSchema = z.object({
  debateId: z.string(),
  accountId: z.string(),
  accountName: z.string(),
});

export const ChatMessagePayloadSchema = z.object({
  debateId: z.string(),
  chatId: z.number(),
});

export const VoiceJoinPayloadSchema = z.object({
  debateId: z.string(),
  accountId: z.string(),
});

export const VoiceOfferPayloadSchema = z.object({
  debateId: z.string(),
  fromId: z.string(),
  toId: z.string(),
  offer: z.custom<RTCSessionDescriptionInit>(),
});

export const VoiceAnswerPayloadSchema = z.object({
  debateId: z.string(),
  fromId: z.string(),
  toId: z.string(),
  answer: z.custom<RTCSessionDescriptionInit>(),
});

export const VoiceIceCandidatePayloadSchema = z.object({
  debateId: z.string(),
  fromId: z.string(),
  toId: z.string(),
  candidate: z.custom<RTCIceCandidateInit>(),
});

// ============ Request Schemas ============

export const JoinDebateRequestSchema = z.object({
  type: z.literal(WSRequestMessageType.C_JOIN_DEBATE),
  payload: JoinDebatePayloadSchema,
});

export const LeaveDebateRequestSchema = z.object({
  type: z.literal(WSRequestMessageType.C_LEAVE_DEBATE),
  payload: LeaveDebatePayloadSchema,
});

export const HeartbeatRequestSchema = z.object({
  type: z.literal(WSRequestMessageType.C_HEARTBEAT),
  payload: HeartbeatPayloadSchema,
});

export const ToggleHandRequestSchema = z.object({
  type: z.literal(WSRequestMessageType.C_TOGGLE_HAND),
  payload: ToggleHandPayloadSchema,
});

export const ChatMessageRequestSchema = z.object({
  type: z.literal(WSRequestMessageType.C_CHAT_MESSAGE),
  payload: ChatMessagePayloadSchema,
});

export const VoiceJoinRequestSchema = z.object({
  type: z.literal(WSRequestMessageType.C_VOICE_JOIN),
  payload: VoiceJoinPayloadSchema,
});

export const VoiceOfferRequestSchema = z.object({
  type: z.literal(WSRequestMessageType.C_VOICE_OFFER),
  payload: VoiceOfferPayloadSchema,
});

export const VoiceAnswerRequestSchema = z.object({
  type: z.literal(WSRequestMessageType.C_VOICE_ANSWER),
  payload: VoiceAnswerPayloadSchema,
});

export const VoiceIceCandidateRequestSchema = z.object({
  type: z.literal(WSRequestMessageType.C_VOICE_ICE_CANDIDATE),
  payload: VoiceIceCandidatePayloadSchema,
});

// ============ Response Payload Schemas ============

export const JoinSuccessPayloadSchema = z.object({
  debateId: z.string(),
  accountId: z.string(),
});

export const JoinErrorPayloadSchema = z.object({
  debateId: z.string(),
  accountId: z.string(),
  reason: z.string(),
});

export const HeartbeatAckPayloadSchema = z.object({
  timestamp: z.number(),
});

export const DebateOnlineAccountsUpdatePayloadSchema = z.object({
  debateId: z.string(),
  onlineAccounts: z.array(z.string()),
});

export const RaisedHandInfoSchema = z.object({
  accountId: z.string(),
  raisedAt: z.number(),
});

export const HandRaiseUpdatePayloadSchema = z.object({
  debateId: z.string(),
  raisedHands: z.array(RaisedHandInfoSchema),
});

export const ChatMessageResponsePayloadSchema = z.object({
  debateId: z.string(),
  chatId: z.number(),
});

export const CurrentSpeakerInfoSchema = z.object({
  accountId: z.string().nullable(),
  accountName: z.string().nullable(),
  endedAt: z.number(),
});

export const NextSpeakerInfoSchema = z.object({
  accountId: z.string(),
  accountName: z.string(),
});

export const SpeakerUpdatePayloadSchema = z.object({
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

export const DebateRoundUpdatePayloadSchema = z.object({
  debateId: z.string(),
  round: RoundInfoSchema,
  currentSpeaker: CurrentSpeakerInfoSchema,
});

export const AiSummaryCompletedPayloadSchema = z.object({
  debateId: z.string(),
});

export const AiChatCompletedPayloadSchema = z.object({
  chatId: z.string(),
});

export const UserMessageSavedPayloadSchema = z.object({
  chatId: z.string(),
});

export const VoiceJoinResponsePayloadSchema = z.object({
  debateId: z.string(),
  fromId: z.string(),
});

export const VoiceOfferResponsePayloadSchema = z.object({
  debateId: z.string(),
  fromId: z.string(),
  toId: z.string(),
  offer: z.custom<RTCSessionDescriptionInit>(),
});

export const VoiceAnswerResponsePayloadSchema = z.object({
  debateId: z.string(),
  fromId: z.string(),
  toId: z.string(),
  answer: z.custom<RTCSessionDescriptionInit>(),
});

export const VoiceIceCandidateResponsePayloadSchema = z.object({
  debateId: z.string(),
  fromId: z.string(),
  toId: z.string(),
  candidate: z.custom<RTCIceCandidateInit>(),
});

// ============ Response Schemas ============

export const JoinSuccessResponseSchema = z.object({
  type: z.literal(WSResponseMessageType.S_JOIN_SUCCESS),
  payload: JoinSuccessPayloadSchema,
});

export const HeartbeatAckResponseSchema = z.object({
  type: z.literal(WSResponseMessageType.S_HEARTBEAT_ACK),
  payload: HeartbeatAckPayloadSchema,
});

export const DebateOnlineAccountsUpdateResponseSchema = z.object({
  type: z.literal(WSResponseMessageType.S_DEBATE_ONLINE_ACCOUNTS_UPDATE),
  payload: DebateOnlineAccountsUpdatePayloadSchema,
});

export const HandRaiseUpdateResponseSchema = z.object({
  type: z.literal(WSResponseMessageType.S_HAND_RAISE_UPDATE),
  payload: HandRaiseUpdatePayloadSchema,
});

export const ChatMessageResponseSchema = z.object({
  type: z.literal(WSResponseMessageType.S_CHAT_MESSAGE),
  payload: ChatMessageResponsePayloadSchema,
});

export const SpeakerUpdateResponseSchema = z.object({
  type: z.literal(WSResponseMessageType.S_SPEAKER_UPDATE),
  payload: SpeakerUpdatePayloadSchema,
});

export const DebateRoundUpdateResponseSchema = z.object({
  type: z.literal(WSResponseMessageType.S_DEBATE_ROUND_UPDATE),
  payload: DebateRoundUpdatePayloadSchema,
});

export const AiSummaryCompletedResponseSchema = z.object({
  type: z.literal(WSResponseMessageType.S_AI_SUMMARY_COMPLETED),
  payload: AiSummaryCompletedPayloadSchema,
});

export const AiChatCompletedResponseSchema = z.object({
  type: z.literal(WSResponseMessageType.S_AI_CHAT_COMPLETED),
  payload: AiChatCompletedPayloadSchema,
});

export const UserMessageSavedResponseSchema = z.object({
  type: z.literal(WSResponseMessageType.S_USER_MESSAGE_SAVED),
  payload: UserMessageSavedPayloadSchema,
});

export const VoiceJoinResponseSchema = z.object({
  type: z.literal(WSResponseMessageType.S_VOICE_JOIN),
  payload: VoiceJoinResponsePayloadSchema,
});

export const VoiceOfferResponseSchema = z.object({
  type: z.literal(WSResponseMessageType.S_VOICE_OFFER),
  payload: VoiceOfferResponsePayloadSchema,
});

export const VoiceAnswerResponseSchema = z.object({
  type: z.literal(WSResponseMessageType.S_VOICE_ANSWER),
  payload: VoiceAnswerResponsePayloadSchema,
});

export const VoiceIceCandidateResponseSchema = z.object({
  type: z.literal(WSResponseMessageType.S_VOICE_ICE_CANDIDATE),
  payload: VoiceIceCandidateResponsePayloadSchema,
});

// ============ Discriminated Union ============

export const WebSocketMessageSchema = z.discriminatedUnion('type', [
  // Client messages
  JoinDebateRequestSchema,
  LeaveDebateRequestSchema,
  HeartbeatRequestSchema,
  ToggleHandRequestSchema,
  ChatMessageRequestSchema,
  VoiceJoinRequestSchema,
  VoiceOfferRequestSchema,
  VoiceAnswerRequestSchema,
  VoiceIceCandidateRequestSchema,
  // Server messages
  JoinSuccessResponseSchema,
  HeartbeatAckResponseSchema,
  DebateOnlineAccountsUpdateResponseSchema,
  HandRaiseUpdateResponseSchema,
  ChatMessageResponseSchema,
  SpeakerUpdateResponseSchema,
  DebateRoundUpdateResponseSchema,
  AiSummaryCompletedResponseSchema,
  AiChatCompletedResponseSchema,
  VoiceJoinResponseSchema,
  VoiceOfferResponseSchema,
  VoiceAnswerResponseSchema,
  VoiceIceCandidateResponseSchema,
]);

// ============ Type Exports ============

// Request types
export type JoinDebateRequest = z.infer<typeof JoinDebateRequestSchema>;
export type LeaveDebateRequest = z.infer<typeof LeaveDebateRequestSchema>;
export type HeartbeatRequest = z.infer<typeof HeartbeatRequestSchema>;
export type ToggleHandRequest = z.infer<typeof ToggleHandRequestSchema>;
export type ChatMessageRequest = z.infer<typeof ChatMessageRequestSchema>;
export type VoiceJoinRequest = z.infer<typeof VoiceJoinRequestSchema>;
export type VoiceOfferRequest = z.infer<typeof VoiceOfferRequestSchema>;
export type VoiceAnswerRequest = z.infer<typeof VoiceAnswerRequestSchema>;
export type VoiceIceCandidateRequest = z.infer<typeof VoiceIceCandidateRequestSchema>;

// Response types
export type JoinSuccessResponse = z.infer<typeof JoinSuccessResponseSchema>;
export type HeartbeatAckResponse = z.infer<typeof HeartbeatAckResponseSchema>;
export type DebateOnlineAccountsUpdateResponse = z.infer<
  typeof DebateOnlineAccountsUpdateResponseSchema
>;
export type HandRaiseUpdateResponse = z.infer<typeof HandRaiseUpdateResponseSchema>;
export type ChatMessageResponse = z.infer<typeof ChatMessageResponseSchema>;
export type SpeakerUpdateResponse = z.infer<typeof SpeakerUpdateResponseSchema>;
export type DebateRoundUpdateResponse = z.infer<typeof DebateRoundUpdateResponseSchema>;
export type AiSummaryCompletedResponse = z.infer<typeof AiSummaryCompletedResponseSchema>;
export type AiChatCompletedResponse = z.infer<typeof AiChatCompletedResponseSchema>;
export type VoiceJoinResponse = z.infer<typeof VoiceJoinResponseSchema>;
export type VoiceOfferResponse = z.infer<typeof VoiceOfferResponseSchema>;
export type VoiceAnswerResponse = z.infer<typeof VoiceAnswerResponseSchema>;
export type VoiceIceCandidateResponse = z.infer<typeof VoiceIceCandidateResponseSchema>;

// Payload types
export type JoinDebatePayload = z.infer<typeof JoinDebatePayloadSchema>;
export type LeaveDebatePayload = z.infer<typeof LeaveDebatePayloadSchema>;
export type HeartbeatPayload = z.infer<typeof HeartbeatPayloadSchema>;
export type ToggleHandPayload = z.infer<typeof ToggleHandPayloadSchema>;
export type ChatMessagePayload = z.infer<typeof ChatMessagePayloadSchema>;
export type VoiceJoinPayload = z.infer<typeof VoiceJoinPayloadSchema>;
export type VoiceOfferPayload = z.infer<typeof VoiceOfferPayloadSchema>;
export type VoiceAnswerPayload = z.infer<typeof VoiceAnswerPayloadSchema>;
export type VoiceIceCandidatePayload = z.infer<typeof VoiceIceCandidatePayloadSchema>;

// Nested types
export type RaisedHandInfo = z.infer<typeof RaisedHandInfoSchema>;
export type CurrentSpeakerInfo = z.infer<typeof CurrentSpeakerInfoSchema>;
export type NextSpeakerInfo = z.infer<typeof NextSpeakerInfoSchema>;
export type RoundInfo = z.infer<typeof RoundInfoSchema>;

// Main message type
export type WebSocketMessage = z.infer<typeof WebSocketMessageSchema>;

/** 음성 메시지 (debateId 제외 - 클라이언트가 자동 추가) */
export type VoiceMessagePayload =
  | { type: WSRequestMessageType.C_VOICE_JOIN; payload: Omit<VoiceJoinPayload, 'debateId'> }
  | { type: WSRequestMessageType.C_VOICE_OFFER; payload: Omit<VoiceOfferPayload, 'debateId'> }
  | { type: WSRequestMessageType.C_VOICE_ANSWER; payload: Omit<VoiceAnswerPayload, 'debateId'> }
  | {
      type: WSRequestMessageType.C_VOICE_ICE_CANDIDATE;
      payload: Omit<VoiceIceCandidatePayload, 'debateId'>;
    };

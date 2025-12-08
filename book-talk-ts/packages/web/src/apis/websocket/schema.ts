import { z } from 'zod';

export const WS_JoinDebateRequestSchema = z.object({
  type: z.literal('C_JOIN_DEBATE'),
  provider: z.literal('CLIENT'),
  debateId: z.string(),
  accountId: z.string(),
  accountName: z.string(),
});

export const WS_LeaveDebateRequestSchema = z.object({
  type: z.literal('C_LEAVE_DEBATE'),
  provider: z.literal('CLIENT'),
  debateId: z.string(),
  accountId: z.string(),
});

export const WS_HeartbeatRequestSchema = z.object({
  type: z.literal('C_HEARTBEAT'),
  provider: z.literal('CLIENT'),
  accountId: z.string().optional(),
});

export const WS_ToggleHandRequestSchema = z.object({
  type: z.literal('C_TOGGLE_HAND'),
  provider: z.literal('CLIENT'),
  debateId: z.string(),
  accountId: z.string(),
  accountName: z.string(),
});

export const WS_ChatMessageRequestSchema = z.object({
  type: z.literal('C_CHAT_MESSAGE'),
  provider: z.literal('CLIENT'),
  debateId: z.string(),
  chatId: z.number(),
});

export const WS_JoinSuccessResponseSchema = z.object({
  type: z.literal('S_JOIN_SUCCESS'),
  provider: z.literal('API'),
  debateId: z.string(),
  accountId: z.string(),
});

export const WS_JoinErrorResponseSchema = z.object({
  type: z.literal('S_JOIN_ERROR'),
  provider: z.literal('API'),
  debateId: z.string(),
  accountId: z.string(),
  reason: z.string(),
});

export const WS_HeartbeatAckResponseSchema = z.object({
  type: z.literal('S_HEARTBEAT_ACK'),
  provider: z.literal('API'),
  timestamp: z.number(),
});

export const AccountPresenceInfoSchema = z.object({
  accountId: z.string(),
  accountName: z.string(),
  status: z.string(),
  lastHeartbeat: z.number(),
});

export const WS_PresenceUpdateResponseSchema = z.object({
  type: z.literal('S_PRESENCE_UPDATE'),
  provider: z.literal('API'),
  debateId: z.string(),
  onlineAccounts: z.array(AccountPresenceInfoSchema),
});

export const RaisedHandInfoSchema = z.object({
  accountId: z.string(),
  accountName: z.string(),
  raisedAt: z.number(),
});

export const WS_HandRaiseUpdateResponseSchema = z.object({
  type: z.literal('S_HAND_RAISE_UPDATE'),
  provider: z.literal('API'),
  debateId: z.string(),
  raisedHands: z.array(RaisedHandInfoSchema),
});

export const WS_ChatMessageResponseSchema = z.object({
  type: z.literal('S_CHAT_MESSAGE'),
  provider: z.literal('API'),
  debateId: z.string(),
  chatId: z.number(),
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
  type: z.literal('S_SPEAKER_UPDATE'),
  provider: z.literal('API'),
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
  type: z.literal('S_DEBATE_ROUND_UPDATE'),
  provider: z.literal('API'),
  debateId: z.string(),
  round: RoundInfoSchema,
  currentSpeaker: CurrentSpeakerInfoSchema,
});

// Voice - Client sends
export const WS_VoiceJoinRequestSchema = z.object({
  type: z.literal('C_VOICE_JOIN'),
  provider: z.literal('CLIENT'),
  accountId: z.string(),
});

export const WS_VoiceOfferRequestSchema = z.object({
  type: z.literal('C_VOICE_OFFER'),
  provider: z.literal('CLIENT'),
  fromId: z.string(),
  toId: z.string(),
  offer: z.custom<RTCSessionDescriptionInit>(),
});

export const WS_VoiceAnswerRequestSchema = z.object({
  type: z.literal('C_VOICE_ANSWER'),
  provider: z.literal('CLIENT'),
  fromId: z.string(),
  toId: z.string(),
  answer: z.custom<RTCSessionDescriptionInit>(),
});

export const WS_VoiceIceRequestSchema = z.object({
  type: z.literal('C_VOICE_ICE'),
  provider: z.literal('CLIENT'),
  fromId: z.string(),
  toId: z.string(),
  iceCandidate: z.custom<RTCIceCandidateInit>(),
});

// Voice - Server broadcasts/relays
export const WS_VoiceJoinResponseSchema = z.object({
  type: z.literal('S_VOICE_JOIN'),
  provider: z.literal('API'),
  debateId: z.string(),
  fromId: z.string(),
});

export const WS_VoiceOfferResponseSchema = z.object({
  type: z.literal('S_VOICE_OFFER'),
  provider: z.literal('API'),
  debateId: z.string(),
  fromId: z.string(),
  toId: z.string(),
  offer: z.custom<RTCSessionDescriptionInit>(),
});

export const WS_VoiceAnswerResponseSchema = z.object({
  type: z.literal('S_VOICE_ANSWER'),
  provider: z.literal('API'),
  debateId: z.string(),
  fromId: z.string(),
  toId: z.string(),
  answer: z.custom<RTCSessionDescriptionInit>(),
});

export const WS_VoiceIceResponseSchema = z.object({
  type: z.literal('S_VOICE_ICE'),
  provider: z.literal('API'),
  debateId: z.string(),
  fromId: z.string(),
  toId: z.string(),
  iceCandidate: z.custom<RTCIceCandidateInit>(),
});

export const WebSocketMessageSchema = z.discriminatedUnion('type', [
  // Client messages
  WS_JoinDebateRequestSchema,
  WS_LeaveDebateRequestSchema,
  WS_HeartbeatRequestSchema,
  WS_ToggleHandRequestSchema,
  WS_ChatMessageRequestSchema,
  // Server messages
  WS_JoinSuccessResponseSchema,
  WS_JoinErrorResponseSchema,
  WS_HeartbeatAckResponseSchema,
  WS_PresenceUpdateResponseSchema,
  WS_HandRaiseUpdateResponseSchema,
  WS_ChatMessageResponseSchema,
  WS_SpeakerUpdateResponseSchema,
  WS_DebateRoundUpdateResponseSchema,
  // Voice - Client
  WS_VoiceJoinRequestSchema,
  WS_VoiceOfferRequestSchema,
  WS_VoiceAnswerRequestSchema,
  WS_VoiceIceRequestSchema,
  // Voice - Server
  WS_VoiceJoinResponseSchema,
  WS_VoiceOfferResponseSchema,
  WS_VoiceAnswerResponseSchema,
  WS_VoiceIceResponseSchema,
]);

export type WS_JoinDebateRequest = z.infer<typeof WS_JoinDebateRequestSchema>;
export type WS_LeaveDebateRequest = z.infer<typeof WS_LeaveDebateRequestSchema>;
export type WS_HeartbeatRequest = z.infer<typeof WS_HeartbeatRequestSchema>;
export type WS_ToggleHandRequest = z.infer<typeof WS_ToggleHandRequestSchema>;
export type WS_ChatMessageRequest = z.infer<typeof WS_ChatMessageRequestSchema>;

export type WS_JoinSuccessResponse = z.infer<typeof WS_JoinSuccessResponseSchema>;
export type WS_JoinErrorResponse = z.infer<typeof WS_JoinErrorResponseSchema>;
export type WS_HeartbeatAckResponse = z.infer<typeof WS_HeartbeatAckResponseSchema>;
export type WS_PresenceUpdateResponse = z.infer<typeof WS_PresenceUpdateResponseSchema>;
export type WS_HandRaiseUpdateResponse = z.infer<typeof WS_HandRaiseUpdateResponseSchema>;
export type WS_ChatMessageResponse = z.infer<typeof WS_ChatMessageResponseSchema>;
export type WS_SpeakerUpdateResponse = z.infer<typeof WS_SpeakerUpdateResponseSchema>;
export type WS_DebateRoundUpdateResponse = z.infer<typeof WS_DebateRoundUpdateResponseSchema>;

// Voice - Client types
export type WS_VoiceJoinRequest = z.infer<typeof WS_VoiceJoinRequestSchema>;
export type WS_VoiceOfferRequest = z.infer<typeof WS_VoiceOfferRequestSchema>;
export type WS_VoiceAnswerRequest = z.infer<typeof WS_VoiceAnswerRequestSchema>;
export type WS_VoiceIceRequest = z.infer<typeof WS_VoiceIceRequestSchema>;

// Voice - Server types
export type WS_VoiceJoinResponse = z.infer<typeof WS_VoiceJoinResponseSchema>;
export type WS_VoiceOfferResponse = z.infer<typeof WS_VoiceOfferResponseSchema>;
export type WS_VoiceAnswerResponse = z.infer<typeof WS_VoiceAnswerResponseSchema>;
export type WS_VoiceIceResponse = z.infer<typeof WS_VoiceIceResponseSchema>;

export type WebSocketMessage = z.infer<typeof WebSocketMessageSchema>;

export type AccountPresenceInfo = z.infer<typeof AccountPresenceInfoSchema>;
export type RaisedHandInfo = z.infer<typeof RaisedHandInfoSchema>;
export type CurrentSpeakerInfo = z.infer<typeof CurrentSpeakerInfoSchema>;
export type NextSpeakerInfo = z.infer<typeof NextSpeakerInfoSchema>;
export type RoundInfo = z.infer<typeof RoundInfoSchema>;

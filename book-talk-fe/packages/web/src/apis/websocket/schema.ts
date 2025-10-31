import {z} from 'zod';

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

export const WS_VoiceJoinMessageSchema = z.object({
    type: z.literal('VOICE_JOIN'),
    provider: z.string().optional(),  // CLIENT when sending, API when receiving broadcast
    debateId: z.string().optional(),
    accountId: z.string(),
    fromId: z.string().optional(),  // Present in broadcast messages from server
});

export const WS_VoiceLeaveMessageSchema = z.object({
    type: z.literal('VOICE_LEAVE'),
    provider: z.string().optional(),  // CLIENT when sending, API when receiving broadcast
    debateId: z.string().optional(),
    accountId: z.string(),
    fromId: z.string().optional(),  // Present in broadcast messages from server
});

export const WS_VoiceOfferMessageSchema = z.object({
    type: z.literal('VOICE_OFFER'),
    provider: z.string().optional(),  // CLIENT when sending, API when receiving relay
    debateId: z.string(),
    fromId: z.string(),
    toId: z.string(),
    offer: z.custom<RTCSessionDescriptionInit>(),
});

export const WS_VoiceAnswerMessageSchema = z.object({
    type: z.literal('VOICE_ANSWER'),
    provider: z.string().optional(),  // CLIENT when sending, API when receiving relay
    debateId: z.string(),
    fromId: z.string(),
    toId: z.string(),
    answer: z.custom<RTCSessionDescriptionInit>(),
});

export const WS_VoiceIceMessageSchema = z.object({
    type: z.literal('VOICE_ICE'),
    provider: z.string().optional(),  // CLIENT when sending, API when receiving relay
    debateId: z.string(),
    fromId: z.string(),
    toId: z.string(),
    iceCandidate: z.custom<RTCIceCandidateInit>(),
});

export const WS_VoiceStateMessageSchema = z.object({
    type: z.literal('VOICE_STATE'),
    provider: z.string().optional(),  // CLIENT when sending, API when receiving broadcast
    debateId: z.string().optional(),
    accountId: z.string(),
    fromId: z.string().optional(),  // Present in broadcast messages from server
    isMuted: z.boolean().optional(),
});

export const WebSocketMessageSchema = z.discriminatedUnion('type', [
    // Client messages
    WS_JoinDebateRequestSchema,
    WS_LeaveDebateRequestSchema,
    WS_HeartbeatRequestSchema,
    WS_ToggleHandRequestSchema,
    WS_ChatMessageRequestSchema,
    // Server messages
    WS_JoinErrorResponseSchema,
    WS_HeartbeatAckResponseSchema,
    WS_PresenceUpdateResponseSchema,
    WS_HandRaiseUpdateResponseSchema,
    WS_ChatMessageResponseSchema,
    WS_SpeakerUpdateResponseSchema,
    WS_DebateRoundUpdateResponseSchema,
    // Voice messages
    WS_VoiceJoinMessageSchema,
    WS_VoiceLeaveMessageSchema,
    WS_VoiceOfferMessageSchema,
    WS_VoiceAnswerMessageSchema,
    WS_VoiceIceMessageSchema,
    WS_VoiceStateMessageSchema,
]);

export type WS_JoinDebateRequest = z.infer<typeof WS_JoinDebateRequestSchema>;
export type WS_LeaveDebateRequest = z.infer<typeof WS_LeaveDebateRequestSchema>;
export type WS_HeartbeatRequest = z.infer<typeof WS_HeartbeatRequestSchema>;
export type WS_ToggleHandRequest = z.infer<typeof WS_ToggleHandRequestSchema>;
export type WS_ChatMessageRequest = z.infer<typeof WS_ChatMessageRequestSchema>;

export type WS_JoinErrorResponse = z.infer<typeof WS_JoinErrorResponseSchema>;
export type WS_HeartbeatAckResponse = z.infer<typeof WS_HeartbeatAckResponseSchema>;
export type WS_PresenceUpdateResponse = z.infer<typeof WS_PresenceUpdateResponseSchema>;
export type WS_HandRaiseUpdateResponse = z.infer<typeof WS_HandRaiseUpdateResponseSchema>;
export type WS_ChatMessageResponse = z.infer<typeof WS_ChatMessageResponseSchema>;
export type WS_SpeakerUpdateResponse = z.infer<typeof WS_SpeakerUpdateResponseSchema>;
export type WS_DebateRoundUpdateResponse = z.infer<typeof WS_DebateRoundUpdateResponseSchema>;

export type WS_VoiceJoinMessage = z.infer<typeof WS_VoiceJoinMessageSchema>;
export type WS_VoiceLeaveMessage = z.infer<typeof WS_VoiceLeaveMessageSchema>;
export type WS_VoiceOfferMessage = z.infer<typeof WS_VoiceOfferMessageSchema>;
export type WS_VoiceAnswerMessage = z.infer<typeof WS_VoiceAnswerMessageSchema>;
export type WS_VoiceIceMessage = z.infer<typeof WS_VoiceIceMessageSchema>;
export type WS_VoiceStateMessage = z.infer<typeof WS_VoiceStateMessageSchema>;

export type WebSocketMessage = z.infer<typeof WebSocketMessageSchema>;

export type AccountPresenceInfo = z.infer<typeof AccountPresenceInfoSchema>;
export type RaisedHandInfo = z.infer<typeof RaisedHandInfoSchema>;
export type CurrentSpeakerInfo = z.infer<typeof CurrentSpeakerInfoSchema>;
export type NextSpeakerInfo = z.infer<typeof NextSpeakerInfoSchema>;
export type RoundInfo = z.infer<typeof RoundInfoSchema>;

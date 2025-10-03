import {z} from 'zod';
import {authApiClient} from '../client';
import {
    type ChatResponse,
    ChatResponseSchema,
    type CreateChatRequest,
    type CreateChatResponse,
    CreateChatRequestSchema,
    CreateChatResponseSchema,
    type CreateDebateRequest,
    CreateDebateRequestSchema,
    type CreateRoundRequest,
    CreateRoundRequestSchema,
    type CreateRoundResponse,
    CreateRoundResponseSchema,
    type CreateRoundSpeakerRequest,
    CreateRoundSpeakerRequestSchema,
    type FindOneDebateResponse,
    FindOneDebateResponseSchema,
    type JoinDebateRequest,
    JoinDebateRequestSchema,
    type PatchRoundRequest,
    PatchRoundRequestSchema,
    type PatchRoundSpeakerRequest,
    PatchRoundSpeakerRequestSchema,
} from './schema';

/** 토론 생성 */
export const createDebate = async (request: CreateDebateRequest): Promise<{ id: string }> => {
    const validatedData = CreateDebateRequestSchema.parse(request);
    const response = await authApiClient.post('/debates', validatedData)
    return response.data.data
};

/** 토론 단건 조회 */
export const findOneDebate = async (id: string): Promise<FindOneDebateResponse> => {
    const response = await authApiClient.get(`/debates/${id}`);
    return FindOneDebateResponseSchema.parse(response.data.data);
};

/** 토론 참여 */
export const joinDebate = async (request: JoinDebateRequest): Promise<void> => {
    const validatedData = JoinDebateRequestSchema.parse(request);
    await authApiClient.post('/debates/participants', validatedData);
};

/** 토론 라운드 생성(시작) */
export const createRound = async (request: CreateRoundRequest): Promise<CreateRoundResponse> => {
    const validatedData = CreateRoundRequestSchema.parse(request);
    const response = await authApiClient.post('/debates/round', validatedData);
    return CreateRoundResponseSchema.parse(response.data.data);
};

/** 토론 라운드 변경 */
export const patchRound = async (request: PatchRoundRequest): Promise<void> => {
    const validatedData = PatchRoundRequestSchema.parse(request);
    await authApiClient.patch('/debates/round', validatedData);
};

/** 발언자 생성 */
export const createRoundSpeaker = async (request: CreateRoundSpeakerRequest): Promise<void> => {
    const validatedData = CreateRoundSpeakerRequestSchema.parse(request);
    await authApiClient.post('/debates/round/speakers', validatedData);
};

/** 발언자 업데이트 */
export const patchRoundSpeaker = async (request: PatchRoundSpeakerRequest): Promise<void> => {
    const validatedData = PatchRoundSpeakerRequestSchema.parse(request);
    await authApiClient.patch('/debates/round/speakers', validatedData);
};

/** 채팅 생성 */
export const createChat = async (request: CreateChatRequest): Promise<CreateChatResponse> => {
    const validatedData = CreateChatRequestSchema.parse(request);
    const response = await authApiClient.post('/debates/round/chats', validatedData);
    return CreateChatResponseSchema.parse(response.data.data);
};

/** 토론 채팅 조회 */
export const getChats = async (debateId: string): Promise<ChatResponse[]> => {
    const response = await authApiClient.get(`/debates/${debateId}/chats`);
    return z.array(ChatResponseSchema).parse(response.data.data);
};
import {apiClient} from '../client';
import {
    type CreateDebateRequest,
    CreateDebateRequestSchema,
    type CreateDebateResponse,
    CreateDebateResponseSchema,
    type CreateRoundRequest,
    CreateRoundRequestSchema,
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
export const createDebate = async (request: CreateDebateRequest): Promise<CreateDebateResponse> => {
    const validatedData = CreateDebateRequestSchema.parse(request);
    const response = await apiClient.post('/debates', validatedData);
    return CreateDebateResponseSchema.parse(response.data.data);
};

/** 토론 단건 조회 */
export const findOneDebate = async (id: string): Promise<FindOneDebateResponse> => {
    const response = await apiClient.get(`/debates/${id}`);
    return FindOneDebateResponseSchema.parse(response.data.data);
};

/** 토론 참여 */
export const joinDebate = async (request: JoinDebateRequest): Promise<void> => {
    const validatedData = JoinDebateRequestSchema.parse(request);
    await apiClient.post('/debates/participants', validatedData);
};

/** 토론 라운드 생성(시작) */
export const createRound = async (request: CreateRoundRequest): Promise<void> => {
    const validatedData = CreateRoundRequestSchema.parse(request);
    await apiClient.post('/debates/round', validatedData);
};

/** 토론 라운드 변경 */
export const patchRound = async (request: PatchRoundRequest): Promise<void> => {
    const validatedData = PatchRoundRequestSchema.parse(request);
    await apiClient.patch('/debates/round', validatedData);
};

/** 발언자 생성 */
export const createRoundSpeaker = async (request: CreateRoundSpeakerRequest): Promise<void> => {
    const validatedData = CreateRoundSpeakerRequestSchema.parse(request);
    await apiClient.post('/debates/round/speakers', validatedData);
};

/** 발언자 업데이트 */
export const patchRoundSpeaker = async (request: PatchRoundSpeakerRequest): Promise<void> => {
    const validatedData = PatchRoundSpeakerRequestSchema.parse(request);
    await apiClient.patch('/debates/round/speakers', validatedData);
};
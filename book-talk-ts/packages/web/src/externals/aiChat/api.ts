import { authApiClient } from '../client';
import {
  type CreateAiChatRequest,
  CreateAiChatRequestSchema,
  type CreateAiChatResponse,
  CreateAiChatResponseSchema,
  type FindOneAiChatResponse,
  FindOneAiChatResponseSchema,
} from './schema';

/** AI 채팅방 생성 */
export const createAiChat = async (request: CreateAiChatRequest): Promise<CreateAiChatResponse> => {
  const validatedData = CreateAiChatRequestSchema.parse(request);
  const response = await authApiClient.post('/ai/chats', validatedData);
  return CreateAiChatResponseSchema.parse(response.data.data);
};

/** AI 채팅방 조회 */
export const findOneAiChat = async (chatId: string): Promise<FindOneAiChatResponse> => {
  const response = await authApiClient.get(`/ai/chats/${chatId}`);
  return FindOneAiChatResponseSchema.parse(response.data.data);
};

/** AI 채팅방 삭제 */
export const removeAiChat = async (chatId: string): Promise<void> => {
  await authApiClient.delete(`/ai/chats/${chatId}`);
};

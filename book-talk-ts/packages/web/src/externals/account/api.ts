import { authApiClient } from '../client';
import { type FindMyResponse, FindMyResponseSchema, type PatchMyRequest } from './schema';

/** 내 계정 정보 조회 */
export const getMyAccount = async (): Promise<FindMyResponse> => {
  const response = await authApiClient.get('/accounts/me');
  return FindMyResponseSchema.parse(response.data.data);
};

/** 내 계정 정보 업데이트 */
export const patchMyAccount = async (request: PatchMyRequest): Promise<void> => {
  await authApiClient.patch('/accounts/me', request);
};

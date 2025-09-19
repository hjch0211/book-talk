import {authApiClient} from '../client';
import {type FindMyResponse, FindMyResponseSchema,} from './schema';

/** 내 계정 정보 조회 */
export const getMyAccount = async (): Promise<FindMyResponse> => {
    const response = await authApiClient.get('/accounts/me');
    return FindMyResponseSchema.parse(response.data.data);
};
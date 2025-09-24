import {authApiClient} from '../client';
import {type FindOnePresentationResponse, FindOnePresentationResponseSchema, type PatchContentRequest,} from './schema';

/** 발표 페이지 단건 조회 */
export const findOnePresentation = async (id: string): Promise<FindOnePresentationResponse> => {
    const response = await authApiClient.get(`/presentations/${id}`);
    return FindOnePresentationResponseSchema.parse(response.data.data);
};

/** 발표 페이지 내용 수정 */
export const patchPresentationContent = async (id: string, patch: PatchContentRequest[]): Promise<void> => {
    await authApiClient.patch(`/presentations/${id}/content`, patch, {
        headers: {
            'Content-Type': 'application/json-patch+json'
        }
    });
};
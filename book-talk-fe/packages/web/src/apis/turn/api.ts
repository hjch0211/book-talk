import {cloudflareApiClient} from '../client';
import {type PostGenerateIceServersResponse, PostGenerateIceServersResponseSchema} from './schema';

const TTL_SECONDS = 24 * 60 * 60; // 1day

/** Cached */
let cachedResponse: PostGenerateIceServersResponse | null = null;
let expiresAt = 0;

/** Cloudflare ICE server 목록 생성 (캐싱 적용) */
export const postGenerateIceServers = async (): Promise<PostGenerateIceServersResponse> => {
    const now = Date.now();

    // 캐시가 유효하면 재사용
    if (cachedResponse && expiresAt > now) {
        return cachedResponse;
    }

    const response = await cloudflareApiClient.post('/credentials/generate-ice-servers', {ttl: TTL_SECONDS});
    cachedResponse = PostGenerateIceServersResponseSchema.parse(response.data);
    expiresAt = now + (TTL_SECONDS * 1000) - 1000;

    return cachedResponse;
};
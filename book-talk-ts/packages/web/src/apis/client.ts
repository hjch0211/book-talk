import { refreshAccessToken } from '@src/apis/auth';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios, { type AxiosError } from 'axios';
import { env } from '../configs/env.ts';

/** 백엔드 ApiResult와 매칭되는 API 응답 래퍼 */
export interface ApiResult<T> {
  data: T;
  error?: {
    message: string;
    code?: string;
  };
}

/** API 에러 처리를 위한 커스텀 에러 클래스 */
export class ApiError extends Error {
  code?: string;
  status?: number;

  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

const TIMEOUT = 10 * 1000; // 10초

/** 기본 API 클라이언트 (인증 불필요) */
export const apiClient: AxiosInstance = axios.create({
  baseURL: env.BASE_URL,
  timeout: TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

/** 인증이 필요한 API 클라이언트 */
export const authApiClient: AxiosInstance = axios.create({
  baseURL: env.BASE_URL,
  timeout: TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

/** Cloudflare TURN API 클라이언트 */
export const cloudflareApiClient: AxiosInstance = axios.create({
  baseURL: env.CLOUDFLARE_TURN_URL,
  timeout: TIMEOUT,
  headers: {
    Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

/** 토큰 저장 */
export const saveTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

/** 토큰 제거 */
export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

/** 인증 실패 처리 (토큰 제거 및 로그인 페이지 이동) */
const handleAuthFailure = () => {
  clearTokens();
  window.location.replace('/?auth=false');
};

/** 공통 에러 처리 (401 제외) */
const handleCommonError = (error: AxiosError): never => {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data as
      | {
          error?: { message?: string; code?: string };
          message?: string;
        }
      | undefined;

    throw new ApiError(
      data?.error?.message || data?.message || '오류가 발생했습니다',
      data?.error?.code || 'UNKNOWN_ERROR',
      status
    );
  } else if (error.request) {
    throw new ApiError('네트워크 오류입니다. 연결을 확인해주세요.', 'NETWORK_ERROR');
  } else {
    throw new ApiError(error.message || '예기치 않은 오류가 발생했습니다', 'UNKNOWN_ERROR');
  }
};

/** 인증 불필요 API 에러 핸들러 */
const handleNonAuthErrorResponse = async (error: AxiosError): Promise<never> => {
  return handleCommonError(error);
};

/** 인증 필요 API 에러 핸들러 (401 토큰 갱신 포함) */
const handleAuthErrorResponse = async (error: AxiosError): Promise<never> => {
  if (error.response?.status === 401) {
    const config = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (config._retry) {
      handleAuthFailure();
      throw new ApiError('인증이 만료되었습니다. 다시 로그인해주세요.', 'TOKEN_EXPIRED', 401);
    }

    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        handleAuthFailure();
        throw new ApiError('인증이 만료되었습니다. 다시 로그인해주세요.', 'TOKEN_EXPIRED', 401);
      }

      const tokens = await refreshAccessToken({ refreshToken });
      saveTokens(tokens.accessToken, tokens.refreshToken);
      config._retry = true;

      if (config.headers) {
        config.headers.Authorization = `Bearer ${tokens.accessToken}`;
      }

      return await authApiClient.request(config);
    } catch (refreshError) {
      // 토큰 갱신 실패 시 로그아웃
      handleAuthFailure();
      throw new ApiError('인증이 만료되었습니다. 다시 로그인해주세요.', 'TOKEN_EXPIRED', 401);
    }
  }

  return handleCommonError(error);
};

/** 응답 데이터 처리 공통 함수 */
const handleResponse = (response: AxiosResponse) => {
  const apiResult = response.data as ApiResult<unknown>;
  if (apiResult.error) {
    throw new ApiError(apiResult.error.message, apiResult.error.code, response.status);
  }
  return response;
};

apiClient.interceptors.response.use(handleResponse, handleNonAuthErrorResponse);

authApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

authApiClient.interceptors.response.use(handleResponse, handleAuthErrorResponse);

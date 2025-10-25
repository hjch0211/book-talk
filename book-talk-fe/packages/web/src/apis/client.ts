import type {AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import axios, {AxiosError} from 'axios';

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

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const TIMEOUT = 10000;

/** 기본 API 클라이언트 (인증 불필요) */
export const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT,
    headers: {'Content-Type': 'application/json'},
});

/** 인증이 필요한 API 클라이언트 */
export const authApiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT,
    headers: {'Content-Type': 'application/json'},
});

/** 에러 응답 처리 공통 함수 */
const handleErrorResponse = (error: AxiosError): Promise<never> => {
    if (error.response) {
        const status = error.response.status;
        const data = error.response.data as {
            error?: { message?: string; code?: string };
            message?: string
        } | undefined;

        // 401 Unauthorized - 토큰 만료 처리
        if (status === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.replace('/?auth=false');
        }

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

/** 응답 데이터 처리 공통 함수 */
const handleResponse = (response: AxiosResponse) => {
    const apiResult = response.data as ApiResult<unknown>;
    if (apiResult.error) {
        throw new ApiError(
            apiResult.error.message,
            apiResult.error.code,
            response.status
        );
    }
    return response;
};

apiClient.interceptors.response.use(handleResponse, handleErrorResponse);
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

authApiClient.interceptors.response.use(handleResponse, handleErrorResponse);
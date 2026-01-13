import { ApiError, apiClient } from '../client';
import {
  type CreateTokensResponse,
  CreateTokensResponseSchema,
  type RefreshRequest,
  RefreshRequestSchema,
  type SignInRequest,
  SignInRequestSchema,
  type SignUpRequest,
  SignUpRequestSchema,
} from './schema';

/** 회원가입 */
export const signUp = async (request: SignUpRequest): Promise<CreateTokensResponse> => {
  const validatedData = SignUpRequestSchema.parse(request);
  const response = await apiClient.post('/auth/sign-up', validatedData);
  return CreateTokensResponseSchema.parse(response.data.data);
};

/** 로그인 */
export const signIn = async (request: SignInRequest): Promise<CreateTokensResponse> => {
  const validatedData = SignInRequestSchema.parse(request);
  const response = await apiClient.post('/auth/sign-in', validatedData);
  return CreateTokensResponseSchema.parse(response.data.data);
};

/** 토큰 갱신 */
export const refreshAccessToken = async (
  request: RefreshRequest
): Promise<CreateTokensResponse> => {
  const refreshToken = request?.refreshToken || localStorage.getItem('refreshToken');

  if (!refreshToken) {
    throw new ApiError('No refresh token available', 'NO_REFRESH_TOKEN');
  }

  const validatedData = RefreshRequestSchema.parse({ refreshToken });
  const response = await apiClient.post('/auth/refresh', validatedData);
  const validatedTokens = CreateTokensResponseSchema.parse(response.data.data);

  localStorage.setItem('accessToken', validatedTokens.accessToken);
  localStorage.setItem('refreshToken', validatedTokens.refreshToken);

  return validatedTokens;
};

/** 로그아웃 */
export const signOut = async (): Promise<void> => {
  try {
    await apiClient.post('/auth/sign-out');
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

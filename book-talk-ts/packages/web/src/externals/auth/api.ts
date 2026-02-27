import { env } from '@src/configs/env';
import { apiClient } from '../client';
import {
  type CreateTokensResponse,
  CreateTokensResponseSchema,
  type RefreshRequest,
  RefreshRequestSchema,
  type SendEmailCodeRequest,
  SendEmailCodeRequestSchema,
  type SignInRequest,
  SignInRequestSchema,
  type SignUpRequest,
  SignUpRequestSchema,
  type VerifyEmailCodeRequest,
  VerifyEmailCodeRequestSchema,
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

/** 이메일 인증 코드 발급 */
export const sendEmailCode = async (request: SendEmailCodeRequest): Promise<void> => {
  const validatedData = SendEmailCodeRequestSchema.parse(request);
  await apiClient.post('/auth/email/code', validatedData);
};

/** 이메일 인증 코드 확인 */
export const verifyEmailCode = async (request: VerifyEmailCodeRequest): Promise<void> => {
  const validatedData = VerifyEmailCodeRequestSchema.parse(request);
  await apiClient.post('/auth/email/verify', validatedData);
};

/** 토큰 갱신 */
export const refreshAccessToken = async (
  request: RefreshRequest
): Promise<CreateTokensResponse> => {
  const validatedData = RefreshRequestSchema.parse(request);
  const response = await apiClient.post('/auth/refresh', validatedData);
  return CreateTokensResponseSchema.parse(response.data.data);
};

/** 로그아웃 */
export const signOut = async (): Promise<void> => {
  await apiClient.post('/auth/sign-out');
};

/** Google OAuth 로그인 - 백엔드 /auth/google 로 브라우저 리다이렉트 */
export const googleLogin = () => {
  window.location.href = `${env.BASE_URL}/auth/google`;
};

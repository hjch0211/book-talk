import { env } from '@src/configs/env';
import { apiClient, authApiClient } from '../client';
import {
  type CreateTokensResponse,
  CreateTokensResponseSchema,
  type RefreshRequest,
  RefreshRequestSchema,
  type ResetPasswordRequest,
  ResetPasswordRequestSchema,
  type SendPasswordResetOtpRequest,
  SendPasswordResetOtpRequestSchema,
  type SendSignUpOtpRequest,
  SendSignUpOtpRequestSchema,
  type SignInRequest,
  SignInRequestSchema,
  type SignUpRequest,
  SignUpRequestSchema,
  type VerifyPasswordResetOtpRequest,
  VerifyPasswordResetOtpRequestSchema,
  type VerifySignUpOtpRequest,
  VerifySignUpOtpRequestSchema,
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

/** OTP 발급 - 회원가입 */
export const sendSignUpOtp = async (request: SendSignUpOtpRequest): Promise<void> => {
  const validatedData = SendSignUpOtpRequestSchema.parse(request);
  await apiClient.post('/auth/email/code', validatedData);
};

/** OTP 인증 - 회원가입 */
export const verifySignUpOtp = async (request: VerifySignUpOtpRequest): Promise<void> => {
  const validatedData = VerifySignUpOtpRequestSchema.parse(request);
  await apiClient.post('/auth/email/verify', validatedData);
};

/** OTP 발급 - 비밀번호 재설정 */
export const sendPasswordResetOtp = async (request: SendPasswordResetOtpRequest): Promise<void> => {
  const validatedData = SendPasswordResetOtpRequestSchema.parse(request);
  await apiClient.post('/auth/password/reset/code', validatedData);
};

/** OTP 인증 - 비밀번호 재설정 */
export const verifyPasswordResetOtp = async (
  request: VerifyPasswordResetOtpRequest
): Promise<void> => {
  const validatedData = VerifyPasswordResetOtpRequestSchema.parse(request);
  await apiClient.post('/auth/password/reset/verify', validatedData);
};

/** 비밀번호 재설정 */
export const resetPassword = async (request: ResetPasswordRequest): Promise<void> => {
  const validatedData = ResetPasswordRequestSchema.parse(request);
  await apiClient.post('/auth/password/reset', validatedData);
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

/** 비밀번호 검증 */
export const verifyPassword = async (password: string): Promise<void> => {
  await authApiClient.post('/auth/verify-password', { password });
};

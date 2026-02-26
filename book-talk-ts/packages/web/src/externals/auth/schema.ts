import { z } from 'zod';

export const SignUpRequestSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  name: z
    .string()
    .min(1, '이름을 입력해주세요')
    .max(50, '이름은 50자 이내로 입력해주세요')
    .regex(
      /^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s_-]+$/,
      '이름은 한글, 영문, 숫자, 공백, -, _ 만 사용 가능합니다'
    ),
  password: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 합니다')
    .regex(/[a-zA-Z]/, '비밀번호에 영문자를 포함해야 합니다')
    .regex(/[0-9]/, '비밀번호에 숫자를 포함해야 합니다')
    .regex(/[!@#$%^&*()-_=+[\]{}|;:'",.<>?/~`]/, '비밀번호에 특수문자를 포함해야 합니다'),
});

export const SignInRequestSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

export const SendEmailCodeRequestSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
});

export const VerifyEmailCodeRequestSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  code: z.string().length(6, '인증 코드는 6자리입니다'),
});

export const RefreshRequestSchema = z.object({
  refreshToken: z.string().min(1, '리프레시 토큰이 필요합니다.'),
});

export const CreateTokensResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type SignUpRequest = z.infer<typeof SignUpRequestSchema>;
export type SignInRequest = z.infer<typeof SignInRequestSchema>;
export type SendEmailCodeRequest = z.infer<typeof SendEmailCodeRequestSchema>;
export type VerifyEmailCodeRequest = z.infer<typeof VerifyEmailCodeRequestSchema>;
export type RefreshRequest = z.infer<typeof RefreshRequestSchema>;
export type CreateTokensResponse = z.infer<typeof CreateTokensResponseSchema>;

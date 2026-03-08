import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, { message: '비밀번호는 8자 이상이어야 합니다' })
  .regex(/[a-zA-Z]/, { message: '비밀번호에 영문자를 포함해야 합니다' })
  .regex(/[0-9]/, { message: '비밀번호에 숫자를 포함해야 합니다' })
  .regex(/[!@#$%^&*()\-_=+[\]{}|;:'",.<>?/~`]/, {
    message: '비밀번호에 특수문자를 포함해야 합니다',
  });

export const SignUpRequestSchema = z.object({
  email: z.email({ message: '올바른 이메일 형식이 아닙니다' }),
  name: z
    .string()
    .min(1, { message: '이름을 입력해주세요' })
    .max(10, { message: '닉네임은 10자 이내로 입력해주세요' })
    .regex(/^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s_-]+$/, {
      message: '이름은 한글, 영문, 숫자, 공백, -, _ 만 사용 가능합니다',
    }),
  password: passwordSchema,
});

export const SignInRequestSchema = z.object({
  email: z.email({ message: '올바른 이메일 형식이 아닙니다' }),
  password: z.string().min(1, { message: '비밀번호를 입력해주세요' }),
});

export const SendSignUpOtpRequestSchema = z.object({
  email: z.email({ message: '올바른 이메일 형식이 아닙니다' }),
});

export const VerifySignUpOtpRequestSchema = z.object({
  email: z.email({ message: '올바른 이메일 형식이 아닙니다' }),
  code: z.string().length(6, { message: '인증 코드는 6자리입니다' }),
});

export const SendPasswordResetOtpRequestSchema = z.object({
  email: z.email({ message: '올바른 이메일 형식이 아닙니다' }),
});

export const VerifyPasswordResetOtpRequestSchema = z.object({
  email: z.email({ message: '올바른 이메일 형식이 아닙니다' }),
  code: z.string().length(6, { message: '인증 코드는 6자리입니다' }),
});

export const ResetPasswordRequestSchema = z.object({
  email: z.email({ message: '올바른 이메일 형식이 아닙니다' }),
  newPassword: passwordSchema,
});

export const SignUpFormSchema = SignUpRequestSchema.extend({
  emailCode: z.string().length(6, { message: '인증 코드는 6자리입니다' }),
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['passwordConfirm'],
});

export const ForgotPasswordStep1FormSchema = z.object({
  email: z.email({ message: '올바른 이메일 형식이 아닙니다' }),
  emailCode: z.string().length(6, { message: '인증 코드는 6자리입니다' }),
});

export const ForgotPasswordStep2FormSchema = z
  .object({
    newPassword: passwordSchema,
    newPasswordConfirm: z.string(),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['newPasswordConfirm'],
  });

export const RefreshRequestSchema = z.object({
  refreshToken: z.string().min(1, { message: '리프레시 토큰이 필요합니다.' }),
});

export const CreateTokensResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type SignUpRequest = z.infer<typeof SignUpRequestSchema>;
export type SignInRequest = z.infer<typeof SignInRequestSchema>;
export type SendSignUpOtpRequest = z.infer<typeof SendSignUpOtpRequestSchema>;
export type VerifySignUpOtpRequest = z.infer<typeof VerifySignUpOtpRequestSchema>;
export type SendPasswordResetOtpRequest = z.infer<typeof SendPasswordResetOtpRequestSchema>;
export type VerifyPasswordResetOtpRequest = z.infer<typeof VerifyPasswordResetOtpRequestSchema>;
export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;
export type SignUpFormValues = z.infer<typeof SignUpFormSchema>;
export type ForgotPasswordStep1FormValues = z.infer<typeof ForgotPasswordStep1FormSchema>;
export type ForgotPasswordStep2FormValues = z.infer<typeof ForgotPasswordStep2FormSchema>;
export type RefreshRequest = z.infer<typeof RefreshRequestSchema>;
export type CreateTokensResponse = z.infer<typeof CreateTokensResponseSchema>;

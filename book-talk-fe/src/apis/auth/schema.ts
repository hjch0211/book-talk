import {z} from 'zod';

export const SignUpRequestSchema = z.object({
    name: z.string()
        .min(1, '이름을 입력해주세요')
        .max(50, '이름은 50자 이내로 입력해주세요')
        .regex(/^[a-zA-Z0-9가-힣_-]+$/, '이름은 한글, 영문, 숫자, -, _ 만 사용 가능합니다'),
});

export const SignInRequestSchema = z.object({
    name: z.string()
        .min(1, '이름을 입력해주세요'),
});

export const RefreshRequestSchema = z.object({
    refreshToken: z.string()
        .min(1, '리프레시 토큰이 필요합니다.'),
});

export const CreateTokensResponseSchema = z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
});

export type SignUpRequest = z.infer<typeof SignUpRequestSchema>;
export type SignInRequest = z.infer<typeof SignInRequestSchema>;
export type RefreshRequest = z.infer<typeof RefreshRequestSchema>;
export type CreateTokensResponse = z.infer<typeof CreateTokensResponseSchema>;
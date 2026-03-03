import { z } from 'zod';

export const FindMyResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullable(),
  createdAt: z.string(),
});

export type FindMyResponse = z.infer<typeof FindMyResponseSchema>;

export const PatchMyRequestSchema = z.object({
  name: z
    .string()
    .min(1, { message: '이름이 필요합니다' })
    .max(50, { message: '이름은 50자 이내여야 합니다' }),
});

export type PatchMyRequest = z.infer<typeof PatchMyRequestSchema>;

export const PatchMyPasswordRequestSchema = z.object({
  currentPassword: z.string().min(1, { message: '현재 비밀번호를 입력해주세요' }),
  newPassword: z.string().min(8, { message: '비밀번호는 8자 이상이어야 합니다' }),
});

export type PatchMyPasswordRequest = z.infer<typeof PatchMyPasswordRequestSchema>;

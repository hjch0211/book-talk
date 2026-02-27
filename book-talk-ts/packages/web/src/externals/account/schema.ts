import { z } from 'zod';

export const FindMyResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullable(),
  createdAt: z.string(),
});

export type FindMyResponse = z.infer<typeof FindMyResponseSchema>;

export const PatchMyRequestSchema = z.object({
  name: z.string().min(1, '이름이 필요합니다').max(50, '이름은 50자 이내여야 합니다'),
});

export type PatchMyRequest = z.infer<typeof PatchMyRequestSchema>;

import {z} from 'zod';

export const FindMyResponseSchema = z.object({
    id: z.string('유효하지 않은 ID 형식입니다'),
    name: z.string()
        .min(1, '이름이 필요합니다')
        .max(50, '이름은 50자 이내여야 합니다'),
    createdAt: z.string('유효하지 않은 날짜 형식입니다'),
});

export type FindMyResponse = z.infer<typeof FindMyResponseSchema>;
import {z} from 'zod';

export const FindOnePresentationResponseSchema = z.object({
    id: z.string(),
    accountId: z.string(),
    debateId: z.string(),
    content: z.string(),
    lastUpdatedAt: z.string(),
});

export const PatchContentRequestSchema = z.object({
    op: z.string(),
    path: z.string(),
    value: z.any().optional(),
    from: z.string().optional(),
});

export type FindOnePresentationResponse = z.infer<typeof FindOnePresentationResponseSchema>;
export type PatchContentRequest = z.infer<typeof PatchContentRequestSchema>;
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

export const FetchOpenGraphResponseSchema = z.object({
    url: z.string(),
    title: z.string().nullable(),
    description: z.string().nullable(),
    image: z.string().nullable(),
    siteName: z.string().nullable(),
    type: z.string().nullable(),
});

export type FindOnePresentationResponse = z.infer<typeof FindOnePresentationResponseSchema>;
export type PatchContentRequest = z.infer<typeof PatchContentRequestSchema>;
export type FetchOpenGraphResponse = z.infer<typeof FetchOpenGraphResponseSchema>;
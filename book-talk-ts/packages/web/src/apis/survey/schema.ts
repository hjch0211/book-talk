import { z } from 'zod';

export const CreateSurveyRequestSchema = z.object({
  rate: z.number().int().min(1, '평가는 1 이상이어야 합니다').max(10, '평가는 10 이하여야 합니다'),
});

export const CreateSurveyResponseSchema = z.object({
  id: z.number(),
});

export type CreateSurveyRequest = z.infer<typeof CreateSurveyRequestSchema>;
export type CreateSurveyResponse = z.infer<typeof CreateSurveyResponseSchema>;

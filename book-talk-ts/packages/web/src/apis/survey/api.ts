import { authApiClient } from '../client';
import {
  type CreateSurveyRequest,
  CreateSurveyRequestSchema,
  type CreateSurveyResponse,
  CreateSurveyResponseSchema,
} from './schema';

/** 설문조사 생성 */
export const createSurvey = async (request: CreateSurveyRequest): Promise<CreateSurveyResponse> => {
  const validatedData = CreateSurveyRequestSchema.parse(request);
  const response = await authApiClient.post('/surveys', validatedData);
  return CreateSurveyResponseSchema.parse(response.data.data);
};

import { authApiClient } from '../client';
import {
  type SearchBookRequest,
  SearchBookRequestSchema,
  type SearchBookResponse,
  SearchBookResponseSchema,
} from './schema';

/** 책 검색 */
export const searchBooks = async (request: SearchBookRequest): Promise<SearchBookResponse> => {
  const validatedData = SearchBookRequestSchema.parse(request);
  const params = new URLSearchParams({
    query: validatedData.query,
    ...(validatedData.page && { page: validatedData.page.toString() }),
    ...(validatedData.size && { size: validatedData.size.toString() }),
  });

  const response = await authApiClient.get(`/books?${params.toString()}`);
  return SearchBookResponseSchema.parse(response.data.data);
};

import { z } from 'zod';

export const SearchBookRequestSchema = z.object({
  query: z.string().min(1, '검색어를 입력해주세요'),
  page: z.number().int().positive().optional().default(1),
  size: z.number().int().positive().optional().default(10),
});

export const BookDataSchema = z.object({
  isbn: z.string().optional().default(''),
  title: z.string(),
  author: z.string(),
  publisher: z.string(),
  description: z.string().optional().default(''),
  imageUrl: z.string(),
});

export const SearchBookResponseSchema = z.object({
  content: z.array(BookDataSchema),
  page: z.number(),
  size: z.number(),
  total: z.number(),
  isLastPage: z.boolean(),
});

export type SearchBookRequest = z.infer<typeof SearchBookRequestSchema>;
export type SearchBookResponse = z.infer<typeof SearchBookResponseSchema>;
export type BookData = z.infer<typeof BookDataSchema>;

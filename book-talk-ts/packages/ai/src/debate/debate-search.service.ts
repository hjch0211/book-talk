import { Inject, Injectable } from '@nestjs/common';
import {
  AI_SEARCH_CLIENT,
  type AiSearchClient,
  type SearchResult,
} from '@src/client/ai-search.client.js';
import type { SearchWithAiRequest } from '@src/debate/_requests.js';

export const DEBATE_SEARCH_SERVICE = Symbol.for('DEBATE_SEARCH_SERVICE');

export interface SearchWithAiResult {
  news: SearchResult[];
  blog: SearchResult[];
}

@Injectable()
export class DebateSearchService {
  constructor(
    @Inject(AI_SEARCH_CLIENT)
    private readonly aiSearchClient: AiSearchClient
  ) {}

  async search(request: SearchWithAiRequest): Promise<SearchWithAiResult> {
    const query = `${request.bookTitle} ${request.topic}`;
    const options = request.includeDomains?.length
      ? { includeDomains: request.includeDomains }
      : undefined;

    const [newsResult, blogResult] = await Promise.allSettled([
      this.aiSearchClient.searchNews(query, options),
      this.aiSearchClient.searchGeneral(query, options),
    ]);

    return {
      news: newsResult.status === 'fulfilled' ? newsResult.value : [],
      blog: blogResult.status === 'fulfilled' ? blogResult.value : [],
    };
  }
}
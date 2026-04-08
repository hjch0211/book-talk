import { Inject, Injectable } from '@nestjs/common';
import {
  AI_SEARCH_CLIENT,
  type AiSearchClient,
  type SearchOptions,
  type SearchResult,
} from '@src/client/ai-search.client.js';
import type { SearchWithAiRequest } from '@src/debate/_requests.js';

export const DEBATE_SEARCH_SERVICE = Symbol.for('DEBATE_SEARCH_SERVICE');

@Injectable()
export class DebateSearchService {
  constructor(
    @Inject(AI_SEARCH_CLIENT)
    private readonly aiSearchClient: AiSearchClient
  ) {}

  async search(request: SearchWithAiRequest): Promise<SearchResult[]> {
    const query = `${request.bookTitle} ${request.topic}`;
    const options: SearchOptions | undefined = request.includeDomains?.length
      ? { includeDomains: request.includeDomains }
      : undefined;

    return this.aiSearchClient.searchGeneral(query, options);
  }
}
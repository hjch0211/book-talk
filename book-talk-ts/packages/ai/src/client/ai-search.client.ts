import axios from 'axios';
import { Logger } from '@nestjs/common';

export const AI_SEARCH_CLIENT = Symbol.for('AI_SEARCH_CLIENT');

export interface SearchResult {
  title: string;
  url: string;
  content: string;
}

/** Tavily Search API 클라이언트 인터페이스 */
export interface SearchOptions {
  includeDomains?: string[];
}

export interface AiSearchClient {
  searchNews(query: string, options?: SearchOptions): Promise<SearchResult[]>;
  searchGeneral(query: string, options?: SearchOptions): Promise<SearchResult[]>;
}

interface TavilySearchResponse {
  answer?: string;
  results: {
    title: string;
    url: string;
    content: string;
    score: number;
  }[];
}

export class TavilySearchClient implements AiSearchClient {
  private readonly baseUrl = 'https://api.tavily.com';
  private readonly logger = new Logger(TavilySearchClient.name);

  constructor(private readonly apiKey: string) {}

  private async search(
    query: string,
    topic: 'news' | 'general',
    options?: SearchOptions
  ): Promise<SearchResult[]> {
    const { data } = await axios.post<TavilySearchResponse>(
      `${this.baseUrl}/search`,
      {
        query,
        topic,
        max_results: 10,
        include_answer: 'advanced',
        ...(options?.includeDomains?.length ? { include_domains: options.includeDomains } : {}),
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );

    return data.results.map((r) => ({
      title: r.title,
      url: r.url,
      content: r.content,
    }));
  }

  async searchNews(query: string, options?: SearchOptions): Promise<SearchResult[]> {
    try {
      return await this.search(query, 'news', options);
    } catch (e) {
      this.logger.error(`[searchNews] failed - query: ${query}, error: ${e}`);
      throw e;
    }
  }

  async searchGeneral(query: string, options?: SearchOptions): Promise<SearchResult[]> {
    try {
      return await this.search(query, 'general', options);
    } catch (e) {
      this.logger.error(`[searchGeneral] failed - query: ${query}, error: ${e}`);
      throw e;
    }
  }
}

export class NoOpAiSearchClient implements AiSearchClient {
  async searchNews(_query: string, _options?: SearchOptions): Promise<SearchResult[]> {
    return [];
  }

  async searchGeneral(_query: string, _options?: SearchOptions): Promise<SearchResult[]> {
    return [];
  }
}

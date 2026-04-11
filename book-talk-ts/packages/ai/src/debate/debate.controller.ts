import { Body, Controller, Inject, Post } from '@nestjs/common';
import { type ApiResult, toResult } from '@src/api-result.js';
import { validate } from '@src/api-validator.js';
import type { SearchResult } from '@src/client/ai-search.client.js';
import {
  type ChatRequest,
  ChatRequestSchema,
  type SearchWithAiRequest,
  SearchWithAiRequestSchema,
  type SummarizeRequest,
} from '@src/debate/_requests.js';
import { DEBATE_SERVICE, type DebateService } from '@src/debate/debate.service.js';
import { DEBATE_CHAT_SERVICE, type DebateChatService } from '@src/debate/debate-chat.service.js';
import {
  DEBATE_SEARCH_SERVICE,
  type DebateSearchService,
} from '@src/debate/debate-search.service.js';

@Controller()
export class DebateController {
  constructor(
    @Inject(DEBATE_SERVICE)
    private readonly debateService: DebateService,
    @Inject(DEBATE_CHAT_SERVICE)
    private readonly debateChatService: DebateChatService,
    @Inject(DEBATE_SEARCH_SERVICE)
    private readonly debateSearchService: DebateSearchService
  ) {}

  /** 토론 요약 */
  @Post('debates/summarization')
  summarize(@Body() request: SummarizeRequest): ApiResult<null> {
    void this.debateService.summarize(request);
    return toResult(null);
  }

  /** AI 토론 */
  @Post('debates/chats/messages')
  chat(@Body() request: ChatRequest): ApiResult<null> {
    const validated = validate(ChatRequestSchema, request);
    void this.debateChatService.chat(validated);
    return toResult(null);
  }

  /** AI 검색 */
  @Post('debates/search')
  async searchWithAi(@Body() request: SearchWithAiRequest): Promise<ApiResult<SearchResult[]>> {
    const validated = validate(SearchWithAiRequestSchema, request);
    const result = await this.debateSearchService.search(validated);
    return toResult(result);
  }
}

import { Body, Controller, Inject, Post } from '@nestjs/common';
import { type ApiResult, toResult } from '@src/api-result.js';
import { validate } from '@src/api-validator.js';
import {
  type ChatRequest,
  ChatRequestSchema,
  type SummarizeRequest,
} from '@src/debate/_requests.js';
import { DEBATE_SERVICE, type DebateService } from '@src/debate/debate.service.js';
import { DEBATE_CHAT_SERVICE, type DebateChatService } from '@src/debate/debate-chat.service.js';

@Controller()
export class DebateController {
  constructor(
    @Inject(DEBATE_SERVICE)
    private readonly debateService: DebateService,
    @Inject(DEBATE_CHAT_SERVICE)
    private readonly debateChatService: DebateChatService
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
}

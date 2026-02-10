import { Body, Controller, Delete, Inject, Param, Post } from '@nestjs/common';
import { type ApiResult, toResult } from '@src/api-result.js';
import { validate } from '@src/api-validator.js';
import {
  type ChatRequest,
  ChatRequestSchema,
  type CreateChatRequest,
  CreateChatRequestSchema,
  type SummarizeRequest,
} from '@src/debate/_requests.js';
import type { CreateChatResponse } from '@src/debate/_responses.js';
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

  /** AI 토론 채팅방 생성 */
  @Post('debates/chats')
  async createChat(@Body() request: CreateChatRequest): Promise<ApiResult<CreateChatResponse>> {
    const validated = validate(CreateChatRequestSchema, request);
    const response = await this.debateChatService.create(validated);
    return toResult(response);
  }

  @Post('debates/chats/messages')
  chat(@Body() request: ChatRequest): ApiResult<null> {
    const validated = validate(ChatRequestSchema, request);
    void this.debateChatService.chat(validated);
    return toResult(null);
  }

  /** 채팅방 삭제 */
  @Delete('debates/chats/:chatId')
  async removeChat(@Param('chatId') chatId: string): Promise<ApiResult<null>> {
    await this.debateChatService.remove(chatId);
    return toResult(null);
  }
}

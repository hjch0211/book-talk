import { Body, Controller, Delete, Inject, Param, Post } from '@nestjs/common';
import { validate } from '@src/api-validator';
import { type ApiResult, toResult } from '../api-result';
import {
  type ChatRequest,
  ChatRequestSchema,
  type CreateRequest,
  CreateRequestSchema,
} from './_requests';
import type { ChatResponse } from './_responses';
import { DEBATE_SERVICE, type DebateService } from './debate.service';

@Controller('debate')
export class DebateController {
  constructor(
    @Inject(DEBATE_SERVICE)
    private readonly debateService: DebateService
  ) {}

  /** 새 채팅방 생성 */
  @Post()
  async create(@Body() request: CreateRequest): Promise<ApiResult<{ chatId: string }>> {
    const validated = validate(CreateRequestSchema, request);
    const response = await this.debateService.create(validated);
    return toResult(response);
  }

  /** 토론 대화 */
  @Post('chat')
  async chat(@Body() request: ChatRequest): Promise<ApiResult<ChatResponse>> {
    const validated = validate(ChatRequestSchema, request);
    const response = await this.debateService.chat(validated);
    return toResult(response);
  }

  /** 채팅방 삭제 */
  @Delete(':chatId')
  async remove(@Param('chatId') chatId: string): Promise<ApiResult<null>> {
    await this.debateService.remove(chatId);
    return toResult(null);
  }
}

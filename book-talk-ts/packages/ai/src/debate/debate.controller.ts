import { Body, Controller, Delete, Inject, Param, Post } from '@nestjs/common';
import { type ApiResult, toResult } from '../api-result';
import type { ChatRequest, CreateRequest } from './_requests';
import type { ChatResponse } from './_responses';
import { DEBATE_SERVICE, type DebateService } from './debate.service';

@Controller('debate')
export class DebateController {
  constructor(
    @Inject(DEBATE_SERVICE)
    private readonly debateService: DebateService,
  ) {}

  /** 새 채팅방 생성 */
  @Post()
  async create(@Body() request: CreateRequest): Promise<ApiResult<{ chatId: string }>> {
    const response = await this.debateService.create(request);
    return toResult(response);
  }

  /** 토론 대화 */
  @Post('chat')
  async chat(@Body() request: ChatRequest): Promise<ApiResult<ChatResponse>> {
    const response = await this.debateService.chat(request);
    return toResult(response);
  }

  /** 채팅방 삭제 */
  @Delete(':chatId')
  async remove(@Param('chatId') chatId: string): Promise<ApiResult<null>> {
    await this.debateService.remove(chatId);
    return toResult(null);
  }
}

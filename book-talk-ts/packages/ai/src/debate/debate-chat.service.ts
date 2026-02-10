import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  AI_CHAT_MESSAGE_REPOSITORY,
  AI_CHAT_REPOSITORY,
  type AiChatMessageRepository,
  type AiChatRepository,
} from '@src/data/data.module.js';
import type { AiChatMessageEntity } from '@src/data/entity/ai-chat-message.entity.js';
import type { ChatRequest, CreateChatRequest } from '@src/debate/_requests.js';
import { DEBATE_GRAPH, type DebateGraph } from '@src/debate/graph/debate.graph.js';

export const DEBATE_CHAT_SERVICE = Symbol.for('DEBATE_CHAT_SERVICE');

@Injectable()
export class DebateChatService {
  constructor(
    @Inject(DEBATE_GRAPH)
    private readonly debateGraph: DebateGraph,
    @Inject(AI_CHAT_REPOSITORY)
    private readonly chatRepository: AiChatRepository,
    @Inject(AI_CHAT_MESSAGE_REPOSITORY)
    private readonly messageRepository: AiChatMessageRepository
  ) {}

  async create(request: CreateChatRequest): Promise<{ chatId: string }> {
    const { debateId } = request;

    const chat = await this.chatRepository.save({ debateId });

    return { chatId: chat.id };
  }

  // TODO: stream 응답, 토큰 초과 시, 메시지 요약, retry 전략
  async chat(request: ChatRequest): Promise<void> {
    const { message, chatId } = request;

    const chat = await this.chatRepository.findOneBy({ id: chatId });
    if (!chat || !chat?.debateId) {
      throw new BadRequestException(`Chat not found: ${chatId}`);
    }

    await this.messageRepository.save({ chatId, role: 'user', content: message });

    void this.debateGraph.runAiDebate(
      chat.messages?.map((e: AiChatMessageEntity) => ({ role: e.role, content: e.content })) || [],
      message,
      chat.debateId
    );
  }

  /** 채팅방 삭제 */
  async remove(chatId: string): Promise<void> {
    await this.chatRepository.delete({ id: chatId });
  }
}

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DEBATE_CLIENT, type DebateClient } from '@src/client/debate.client.js';
import {
  AI_CHAT_MESSAGE_REPOSITORY,
  AI_CHAT_REPOSITORY,
  type AiChatMessageRepository,
  type AiChatRepository,
} from '@src/data/data.module.js';
import type { AiChatMessageEntity } from '@src/data/entity/ai-chat-message.entity.js';
import type { ChatRequest } from '@src/debate/_requests.js';
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
    private readonly messageRepository: AiChatMessageRepository,
    @Inject(DEBATE_CLIENT)
    private readonly debateClient: DebateClient
  ) {}

  // TODO: stream 응답, 토큰 초과 시, 메시지 요약, retry 전략
  async chat(request: ChatRequest): Promise<void> {
    const { message, chatId } = request;

    const chat = await this.chatRepository.findOne({ where: { id: chatId }, relations: ['messages'] });
    if (!chat || !chat.debateId) {
      throw new BadRequestException(`Chat not found: ${chatId}`);
    }

    await this.messageRepository.save({ chat, role: 'user', content: message });

    const response = await this.debateGraph.runAiDebate(
      chat.messages?.map((e: AiChatMessageEntity) => ({ role: e.role, content: e.content })) || [],
      message,
      chat.debateId
    );
    await this.messageRepository.save({ chat, role: 'assistant', content: response.message });
    await this.debateClient.notifyChatCompleted(chatId);
  }
}

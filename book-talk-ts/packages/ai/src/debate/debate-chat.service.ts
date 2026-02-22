import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DEBATE_CLIENT, type DebateClient } from '@src/client/debate.client.js';
import {
  AI_CHAT_MESSAGE_REPOSITORY,
  AI_CHAT_REPOSITORY,
  type AiChatMessageRepository,
  type AiChatRepository,
} from '@src/data/data.module.js';
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

    const chat = await this.chatRepository.findOneBy({ id: chatId });
    if (!chat) {
      throw new BadRequestException(`Chat not found: ${chatId}`);
    }

    const messages = await this.messageRepository.find({
      where: { chat: { id: chatId } },
      order: { createdAt: 'ASC' },
    });

    await this.messageRepository.save({
      chat: { id: chatId },
      role: 'user',
      content: message,
      status: 'COMPLETED',
    });

    const pendingMessage = await this.messageRepository.save({
      chat: { id: chatId },
      role: 'assistant',
      content: '',
      status: 'PENDING',
    });
    void this.debateClient.notifyUserMessageSaved(chatId);

    try {
      const response = await this.debateGraph.runAiDebate(
        messages.map((e) => ({ role: e.role, content: e.content })),
        message,
        chat.debateId
      );

      await this.messageRepository.update(pendingMessage.id, {
        content: response.message || '',
        status: 'COMPLETED',
      });
    } catch (error) {
      await this.messageRepository.update(pendingMessage.id, {
        status: 'FAILED',
      });
      throw error;
    }

    await this.debateClient.notifyChatCompleted(chatId);
  }
}

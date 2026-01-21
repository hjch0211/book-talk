import { Inject, Injectable } from '@nestjs/common';
import { PROMPT_STUDIO_AGENT, type PromptStudioAgent } from '@src/client/prompt-studio.agent.js';
import {
  AI_CHAT_MESSAGE_REPOSITORY,
  AI_CHAT_REPOSITORY,
  type AiChatMessageRepository,
  type AiChatRepository,
  DEBATE_SUMMARIZATION_REPOSITORY,
} from '@src/data/data.module.js';
import type { AiChatMessageEntity } from '@src/data/entity/ai-chat-message.entity.js';
import type { DebateSummarizationRepository } from '@src/data/entity/debate-summarization.entity.js';
import type { ChatRequest, CreateRequest, SummarizeRequest } from '@src/debate/_requests.js';
import type { ChatResponse } from '@src/debate/_responses.js';
import { DEBATE_GRAPH, type DebateGraph } from '@src/debate/graph/debate.graph.js';

export const DEBATE_SERVICE = Symbol.for('DEBATE_SERVICE');

@Injectable()
export class DebateService {
  constructor(
    @Inject(PROMPT_STUDIO_AGENT)
    private readonly promptStudioAgent: PromptStudioAgent,
    @Inject(DEBATE_GRAPH)
    private readonly debateGraph: DebateGraph,
    @Inject(AI_CHAT_REPOSITORY)
    private readonly chatRepository: AiChatRepository,
    @Inject(AI_CHAT_MESSAGE_REPOSITORY)
    private readonly messageRepository: AiChatMessageRepository,
    @Inject(DEBATE_SUMMARIZATION_REPOSITORY)
    private readonly debateSummarizationRepository: DebateSummarizationRepository
  ) {}

  /** 토론 요약 */
  async summarize(request: SummarizeRequest): Promise<void> {
    const { debateId } = request;

    const response = await this.debateGraph.run(
      [],
      '토론 시작',
      debateId,
      this.promptStudioAgent.createCallbackHandler()
    );
    void this.debateSummarizationRepository.save({ debateId, content: response.content });
  }

  /** 새 토론 세션 생성 */
  async create(request: CreateRequest): Promise<{ chatId: string }> {
    const { debateId } = request;

    const chat = await this.chatRepository.save({ debateId });

    return { chatId: chat.id };
  }

  // TODO: stream 응답, 토큰 초과 시, 메시지 요약, retry 전략
  async chat(request: ChatRequest): Promise<ChatResponse> {
    const { message, chatId } = request;

    const chat = await this.chatRepository.findOneBy({ id: chatId });
    if (!chat || !chat?.debateId) {
      throw new Error(`Chat not found: ${chatId}`);
    }

    await this.messageRepository.save({ chatId, role: 'user', content: message });

    const response = await this.debateGraph.run(
      chat.messages?.map((e: AiChatMessageEntity) => ({ role: e.role, content: e.content })) || [],
      message,
      chat.debateId,
      this.promptStudioAgent.createCallbackHandler()
    );

    // TODO: response 타입을 나누어야 함
    await this.messageRepository.save({
      chatId,
      role: 'assistant',
      content: JSON.stringify(response),
    });

    return { response, chatId };
  }

  /** 채팅방 삭제 */
  async remove(chatId: string): Promise<void> {
    await this.chatRepository.delete({ id: chatId });
  }
}

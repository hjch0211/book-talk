import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { END } from '@langchain/langgraph';
import { Logger } from '@nestjs/common';
import type { DebateState } from '@src/debate/graph/debate.state.js';
import type { LangGraphNode } from '@src/lang-graph-node.js';
import { type SupervisorNodeRequest, SupervisorNodeRequestSchema } from './_requests.js';
import { type SupervisorNodeResponse, SupervisorNodeResponseSchema } from './_responses.js';
import { DEBATE_STARTER_NODE } from './debate-starter.node.js';
import { UNKNOWN_HANDLER_NODE } from './unknown-handler.node.js';

export const SUPERVISOR_NODE = Symbol.for('SUPERVISOR_NODE');

export class SupervisorNode implements LangGraphNode<DebateState> {
  constructor(
    private readonly model: BaseChatModel,
    private readonly prompt: string
  ) {}

  async process(state: DebateState): Promise<Partial<DebateState>> {
    const { request, debateId, chatHistory, debateInfo } = state;

    /** 요청 검증 */
    let parsedRequest: SupervisorNodeRequest;
    try {
      parsedRequest = SupervisorNodeRequestSchema.parse({ command: request, data: { debateId } });
    } catch (e) {
      Logger.warn('[SupervisorNode] request validation failed', e);
      return { next: { node: UNKNOWN_HANDLER_NODE.description! } };
    }

    /** LLM 호출: 기존 메시지 + 현재 요청 포함 */
    let llmResponseText: string;
    try {
      const llmResponse = await this.model.invoke([
        new SystemMessage(this.prompt),
        ...chatHistory.map((m) =>
          m.role === 'user' ? new HumanMessage(m.content) : new AIMessage(m.content)
        ),
        new HumanMessage(JSON.stringify(parsedRequest)),
      ]);
      llmResponseText = llmResponse.text.trim();
    } catch (e) {
      Logger.error('[SupervisorNode] LLM invoke failed', e);
      return {
        next: { node: UNKNOWN_HANDLER_NODE.description! },
      };
    }

    /** 응답 검증 */
    let parsedResponse: SupervisorNodeResponse;
    try {
      parsedResponse = SupervisorNodeResponseSchema.parse(JSON.parse(llmResponseText));
    } catch (e) {
      Logger.error('[SupervisorNode] response validation failed', e);
      return { next: { node: UNKNOWN_HANDLER_NODE.description! } };
    }

    /** 하위 agent 호출 */
    if (parsedResponse.data?.command) {
      return {
        next: {
          node:
            parsedResponse.data.command === 'debate_start'
              ? DEBATE_STARTER_NODE.description!
              : UNKNOWN_HANDLER_NODE.description!,
          request: { command: 'debate_start', data: { debateId, debateInfo } },
        },
        debateId: parsedRequest.data.debateId,
      };
    }

    /** 호출 없이 즉시 종료 */
    if (parsedResponse.data?.response) {
      return {
        next: { node: END },
        response: parsedResponse.data.response,
      };
    }

    return {
      next: { node: UNKNOWN_HANDLER_NODE.description! },
    };
  }
}

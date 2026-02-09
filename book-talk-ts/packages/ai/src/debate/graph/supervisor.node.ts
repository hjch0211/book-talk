import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { Logger } from '@nestjs/common';
import type { DebateState } from '@src/debate/graph/debate.state.js';
import type { LangGraphNode } from '@src/lang-graph-node.js';
import { type SupervisorNodeRequest, SupervisorNodeRequestSchema } from './_requests.js';
import { type SupervisorNodeResponse, SupervisorNodeResponseSchema } from './_responses.js';

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
      return { errorMessage: '[SupervisorNode] request validation failed' };
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
      return { errorMessage: '[SupervisorNode] LLM invoke failed' };
    }

    /** 응답 검증 */
    let parsedResponse: SupervisorNodeResponse;
    try {
      parsedResponse = SupervisorNodeResponseSchema.parse(JSON.parse(llmResponseText));
    } catch (e) {
      Logger.error('[SupervisorNode] response validation failed', e);
      return { errorMessage: '[SupervisorNode] response validation failed' };
    }

    /** 하위 agent 호출 */
    if (parsedResponse.data?.command === 'debate_start') {
      return {
        nodeRequest: { command: 'debate_start' as const, data: { debateId, debateInfo } },
        debateId: parsedRequest.data.debateId,
      };
    }

    /** 호출 없이 즉시 종료 */
    if (parsedResponse.data?.response) {
      return { response: parsedResponse.data.response };
    }

    return { errorMessage: '[SupervisorNode] unexpected response' };
  }
}

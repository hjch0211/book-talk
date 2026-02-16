import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { Logger } from '@nestjs/common';
import type { DebateState } from '@src/debate/graph/debate.state.js';
import type { LangGraphNode } from '@src/lang-graph-node.js';
import type { ReactAgent } from 'langchain';

export const SUPERVISOR_NODE = Symbol.for('SUPERVISOR_NODE');

export class SupervisorNode implements LangGraphNode<DebateState> {
  constructor(private readonly agent: ReactAgent) {}

  async process(state: DebateState): Promise<Partial<DebateState>> {
    const { request, debateId, chatHistory } = state;

    /** LLM 호출: 기존 메시지 + 현재 요청 포함 */
    try {
      const response = await this.agent.invoke({
        messages: [
          ...chatHistory.map((m) =>
            m.role === 'user' ? new HumanMessage(m.content) : new AIMessage(m.content)
          ),
          new HumanMessage(request),
        ],
      });

      /** 하위 agent 호출 */
      if (response.structuredResponse.data?.command === 'DEBATE_START') {
        return { call: 'DEBATE_START', debateId };
      }

      /** 호출 없이 즉시 종료 */
      if (response.structuredResponse.data?.response) {
        return {
          response: {
            status: response.structuredResponse.status,
            type: response.structuredResponse.type,
            message: response.structuredResponse.message,
            reason: response.structuredResponse.reason,
            data: response.structuredResponse.data.response,
          },
        };
      }

      return { errorMessage: '[SupervisorNode] unexpected response' };
    } catch (e) {
      Logger.error(`[SupervisorNode] LLM invoke failed - request: ${request}`, e);
      return { errorMessage: '[SupervisorNode] LLM invoke failed' };
    }
  }
}

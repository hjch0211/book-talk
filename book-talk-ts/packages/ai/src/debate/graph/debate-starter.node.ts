import { HumanMessage } from '@langchain/core/messages';
import { Logger } from '@nestjs/common';
import type { DebateState } from '@src/debate/graph/debate.state.js';
import type { LangGraphNode } from '@src/lang-graph-node.js';
import type { ReactAgent } from 'langchain';

export const DEBATE_STARTER_NODE = Symbol.for('DEBATE_STARTER_NODE');

export class DebateStarterNode implements LangGraphNode<DebateState> {
  constructor(private readonly agent: ReactAgent) {}

  async process(state: DebateState): Promise<Partial<DebateState>> {
    const { debateId, debateInfo } = state;

    /** debateInfo가 없으면 GetDebateInfoTool 호출 */
    if (!debateInfo) {
      return { call: 'GET_DEBATE_INFO' };
    }

    /** LLM 호출 */
    try {
      const llmRequest = {
        command: 'DEBATE_START',
        data: { debateId, debateInfo },
      };

      const response = await this.agent.invoke({
        messages: [new HumanMessage(JSON.stringify(llmRequest))],
      });

      /** 최종 응답 */
      return {
        response: {
          status: response.structuredResponse.status,
          type: response.structuredResponse.type,
          message: response.structuredResponse.message,
          reason: response.structuredResponse.reason,
          data: response.structuredResponse.data.response,
        },
        call: null,
      };
    } catch (e) {
      Logger.error('[DebateStarterNode] LLM invoke failed', e);
      return { errorMessage: '[DebateStarterNode] LLM invoke failed' };
    }
  }
}

import { HumanMessage } from '@langchain/core/messages';
import { Logger } from '@nestjs/common';
import type { DebateState } from '@src/debate/graph/debate.state.js';
import type { LangGraphNode } from '@src/lang-graph-node.js';
import type { ReactAgent } from 'langchain';
import {
  type DebateStarterAgentResponse,
  DebateStarterAgentResponseSchema,
} from '../_responses.js';

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
    let llmResponseText: string;
    try {
      const llmRequest = {
        command: 'DEBATE_START',
        data: { debateId: debateId, debateInfo: debateInfo },
      };

      const llmResponse = await this.agent.invoke({
        messages: [new HumanMessage(JSON.stringify(llmRequest))],
      });
      llmResponseText = JSON.stringify(llmResponse.structuredResponse);
    } catch (e) {
      Logger.error('[DebateStarterNode] LLM invoke failed', e);
      return { errorMessage: '[DebateStarterNode] LLM invoke failed' };
    }

    /** 응답 검증 */
    let parsedResponse: DebateStarterAgentResponse;
    try {
      parsedResponse = DebateStarterAgentResponseSchema.parse(JSON.parse(llmResponseText));
    } catch (e) {
      Logger.error('[DebateStarterNode] response validation failed', e);
      return { errorMessage: '[DebateStarterNode] response validation failed' };
    }

    /** 최종 응답 */
    return {
      response: {
        status: parsedResponse.status,
        type: parsedResponse.type,
        message: parsedResponse.message,
        reason: parsedResponse.reason,
        data: parsedResponse.data.response,
      },
      call: null,
    };
  }
}

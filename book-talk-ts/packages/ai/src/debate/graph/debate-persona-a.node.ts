import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { Logger } from '@nestjs/common';
import type { DebateState } from '@src/debate/graph/debate.state.js';
import type { LangGraphNode } from '@src/lang-graph-node.js';
import type { ReactAgent } from 'langchain';
import {
  type DebatePersonaAAgentResponse,
  DebatePersonaAAgentResponseSchema,
} from '../_responses.js';

export const DEBATE_PERSONA_A_NODE = Symbol.for('DEBATE_PERSONA_A_NODE');

export class DebatePersonaANode implements LangGraphNode<DebateState> {
  constructor(private readonly agent: ReactAgent) {}

  async process(state: DebateState): Promise<Partial<DebateState>> {
    const { request, debateInfo, chatHistory } = state;

    /** debateInfo가 없으면 GetDebateInfoTool 호출 */
    if (!debateInfo) {
      return { call: 'GET_DEBATE_INFO' };
    }

    /** LLM 호출 */
    let llmResponseText: string;
    try {
      const llmRequest = { request, debateInfo };
      const llmResponse = await this.agent.invoke({
        messages: [
          ...chatHistory.map((m) =>
            m.role === 'user' ? new HumanMessage(m.content) : new AIMessage(m.content)
          ),
          new HumanMessage(JSON.stringify(llmRequest)),
        ],
      });
      llmResponseText = JSON.stringify(llmResponse.structuredResponse);
    } catch (e) {
      Logger.error('[DebatePersonaANode] LLM invoke failed', e);
      return { errorMessage: '[DebatePersonaANode] LLM invoke failed' };
    }

    /** 응답 검증 */
    let parsedResponse: DebatePersonaAAgentResponse;
    try {
      parsedResponse = DebatePersonaAAgentResponseSchema.parse(JSON.parse(llmResponseText));
    } catch (e) {
      Logger.error('[DebatePersonaANode] response validation failed', e);
      return { errorMessage: '[DebatePersonaANode] response validation failed' };
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

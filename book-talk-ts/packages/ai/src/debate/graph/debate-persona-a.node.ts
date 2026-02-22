import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { Logger } from '@nestjs/common';
import type { DebateState } from '@src/debate/graph/debate.state.js';
import type { LangGraphNode } from '@src/lang-graph-node.js';
import type { ReactAgent } from 'langchain';

export const DEBATE_PERSONA_A_NODE = Symbol.for('DEBATE_PERSONA_A_NODE');

export class DebatePersonaANode implements LangGraphNode<DebateState> {
  constructor(private readonly agent: ReactAgent) {}

  async process(state: DebateState): Promise<Partial<DebateState>> {
    const { request, debateInfo, chatHistory } = state;
    console.log(request, debateInfo, chatHistory);

    /** debateInfo가 없으면 GetDebateInfoTool 호출 */
    if (!debateInfo) {
      return { call: 'GET_DEBATE_INFO' };
    }

    /** LLM 호출 */
    try {
      const llmRequest = { request, debateInfo };
      const response = await this.agent.invoke({
        messages: [
          ...chatHistory.map((m) =>
            m.role === 'user' ? new HumanMessage(m.content) : new AIMessage(m.content)
          ),
          new HumanMessage(JSON.stringify(llmRequest)),
        ],
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
      Logger.error(`[DebatePersonaANode] LLM invoke failed - request: ${request}`, e);
      return { errorMessage: '[DebatePersonaANode] LLM invoke failed' };
    }
  }
}

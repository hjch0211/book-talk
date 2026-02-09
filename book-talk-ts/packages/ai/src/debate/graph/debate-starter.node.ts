import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { Logger } from '@nestjs/common';
import {
  type DebateStarterNodeRequest,
  DebateStarterNodeRequestSchema,
  type GetDebateInfoToolNodeRequest,
} from '@src/debate/graph/_requests.js';
import type { DebateState } from '@src/debate/graph/debate.state.js';
import type { LangGraphNode } from '@src/lang-graph-node.js';
import { type DebateStarterNodeResponse, DebateStarterNodeResponseSchema } from './_responses.js';

export const DEBATE_STARTER_NODE = Symbol.for('DEBATE_STARTER_NODE');

export class DebateStarterNode implements LangGraphNode<DebateState> {
  constructor(
    private readonly model: BaseChatModel,
    private readonly prompt: string
  ) {}

  async process(state: DebateState): Promise<Partial<DebateState>> {
    const { debateId, debateInfo, nodeRequest } = state;

    /** 요청 검증 */
    let parsedRequest: DebateStarterNodeRequest;
    try {
      parsedRequest = DebateStarterNodeRequestSchema.parse(nodeRequest);
    } catch (e) {
      Logger.warn('[DebateStarterNode] request validation failed', e);
      return { errorMessage: '[DebateStarterNode] request validation failed' };
    }

    /** debateInfo가 없으면 GetDebateInfoTool 호출 */
    if (!debateInfo) {
      const toolRequest: GetDebateInfoToolNodeRequest = {
        command: 'GET_DEBATE_INFO',
        data: { debateId },
      };
      return { nodeRequest: toolRequest };
    }

    /** LLM 호출 */
    let llmResponseText: string;
    try {
      const llmResponse = await this.model.invoke([
        new SystemMessage(this.prompt),
        new HumanMessage(JSON.stringify(parsedRequest)),
      ]);
      llmResponseText = llmResponse.text.trim();
    } catch (e) {
      Logger.error('[DebateStarterNode] LLM invoke failed', e);
      return { errorMessage: '[DebateStarterNode] LLM invoke failed' };
    }

    /** 응답 검증 */
    let parsedResponse: DebateStarterNodeResponse;
    try {
      parsedResponse = DebateStarterNodeResponseSchema.parse(JSON.parse(llmResponseText));
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
      nodeRequest: null,
    };
  }
}

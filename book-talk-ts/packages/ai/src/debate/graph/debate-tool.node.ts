import { Inject, Logger } from '@nestjs/common';
import { DEBATE_CLIENT, type DebateClient } from '@src/client/debate.client.js';
import type { DebateState } from '@src/debate/graph/debate.state.js';
import {
  type GetDebateInfoToolNodeRequest,
  GetDebateInfoToolNodeRequestSchema,
} from './_requests.js';

export const DEBATE_TOOL_NODE = Symbol.for('DEBATE_TOOL_NODE');

export class DebateToolNode {
  constructor(
    @Inject(DEBATE_CLIENT)
    private readonly debateClient: DebateClient
  ) {}

  async getDebateStarterTool(state: DebateState): Promise<Partial<DebateState>> {
    const { nodeRequest } = state;

    /** 요청 검증 */
    let parsedRequest: GetDebateInfoToolNodeRequest;
    try {
      parsedRequest = GetDebateInfoToolNodeRequestSchema.parse(nodeRequest);
    } catch (e) {
      Logger.warn('[DebateToolNode] request validation failed', e);
      return { errorMessage: '[DebateToolNode] request validation failed' };
    }

    /** 올바른 GET_DEBATE_INFO 요청 처리 */
    if (parsedRequest.command === 'GET_DEBATE_INFO') {
      try {
        const debateInfo = await this.debateClient.findOne(parsedRequest.data.debateId);
        return { debateInfo };
      } catch (e) {
        Logger.error('[DebateToolNode] API call failed', e);
        return { errorMessage: '[DebateToolNode] API call failed' };
      }
    }

    /** 요청 command가 GET_DEBATE_INFO가 아닌 경우 */
    return { errorMessage: '[DebateToolNode] unexpected command' };
  }
}

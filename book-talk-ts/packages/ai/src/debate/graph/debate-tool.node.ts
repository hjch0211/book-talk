import { Inject, Logger } from '@nestjs/common';
import { DEBATE_CLIENT, type DebateClient } from '@src/client/debate.client.js';
import type { DebateState } from '@src/debate/graph/debate.state.js';
import {
  type GetDebateInfoToolNodeRequest,
  GetDebateInfoToolNodeRequestSchema,
} from './_requests.js';
import { DEBATE_STARTER_NODE } from './debate-starter.node.js';
import { UNKNOWN_HANDLER_NODE } from './unknown-handler.node.js';

export const DEBATE_TOOL_NODE = Symbol.for('DEBATE_TOOL_NODE');

export class DebateToolNode {
  constructor(
    @Inject(DEBATE_CLIENT)
    private readonly debateClient: DebateClient
  ) {}

  async getDebateStarterTool(state: DebateState): Promise<Partial<DebateState>> {
    const { next } = state;

    /** 요청 검증 */
    let parsedRequest: GetDebateInfoToolNodeRequest;
    try {
      parsedRequest = GetDebateInfoToolNodeRequestSchema.parse(next.request);
    } catch (e) {
      Logger.warn('[DebateToolNode] request validation failed', e);
      return { next: { node: UNKNOWN_HANDLER_NODE.description! } };
    }

    /** 올바른 get_debate_info 요청 처리 */
    if (parsedRequest.command === 'get_debate_info') {
      try {
        const debateInfo = await this.debateClient.findOne(parsedRequest.data.debateId);
        return {
          next: {
            node: DEBATE_STARTER_NODE.description!,
            request: {
              command: 'debate_start',
              data: { debateId: parsedRequest.data.debateId, debateInfo },
            },
          },
          debateId: parsedRequest.data.debateId,
          debateInfo,
        };
      } catch (e) {
        Logger.error('[DebateToolNode] API call failed', e);
        return { next: { node: UNKNOWN_HANDLER_NODE.description! } };
      }
    }

    /** 요청 command가 get_debate_info가 아닌 경우 */
    return { next: { node: UNKNOWN_HANDLER_NODE.description! } };
  }
}

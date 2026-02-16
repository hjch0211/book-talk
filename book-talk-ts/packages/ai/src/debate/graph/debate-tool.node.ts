import { Inject, Logger } from '@nestjs/common';
import { DEBATE_CLIENT, type DebateClient } from '@src/client/debate.client.js';
import type { DebateState } from '@src/debate/graph/debate.state.js';

export const DEBATE_TOOL_NODE = Symbol.for('DEBATE_TOOL_NODE');

export class DebateToolNode {
  constructor(
    @Inject(DEBATE_CLIENT)
    private readonly debateClient: DebateClient
  ) {}

  async getDebateStarterTool(state: DebateState): Promise<Partial<DebateState>> {
    const { debateId } = state;

    /** 올바른 GET_DEBATE_INFO 요청 처리 */
    try {
      const debateInfo = await this.debateClient.findOne(debateId);
      return { debateInfo, call: null };
    } catch (e) {
      Logger.error('[DebateToolNode] API call failed', e);
      return { errorMessage: '[DebateToolNode] API call failed' };
    }
  }
}

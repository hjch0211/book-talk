import type { DebateState } from '@src/debate/graph/debate.state.js';
import type { LangGraphNode } from '@src/lang-graph-node.js';

export const UNKNOWN_HANDLER_NODE = Symbol.for('UNKNOWN_HANDLER_NODE');

export class UnknownHandlerNode implements LangGraphNode<DebateState> {
  process(state: DebateState): Partial<DebateState> {
    return {
      response: {
        status: 'FAILED',
        type: 'PLAIN_ANSWER',
        message: '요청을 이해하지 못했습니다.',
        reason: state.errorMessage ?? 'Unknown error in graph execution.',
      },
      errorMessage: null,
    };
  }
}

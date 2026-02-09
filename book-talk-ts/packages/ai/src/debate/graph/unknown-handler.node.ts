import { type DebateState, ResponseType } from '@src/debate/graph/debate.state.js';
import type { LangGraphNode } from '@src/lang-graph-node.js';

export const UNKNOWN_HANDLER_NODE = Symbol.for('UNKNOWN_HANDLER_NODE');

export class UnknownHandlerNode implements LangGraphNode<DebateState> {
  process(_: DebateState): Partial<DebateState> {
    return {
      response: {
        type: ResponseType.PLAIN_ANSWER,
        content:
          '죄송합니다. 요청을 이해하지 못했습니다.',
      },
      errorMessage: null,
    };
  }
}

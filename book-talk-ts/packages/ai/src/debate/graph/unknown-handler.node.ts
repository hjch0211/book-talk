import { END } from '@langchain/langgraph';
import type { LangGraphNode } from '@src/lang-graph-node';
import { type DebateState, ResponseType } from './debate.state';

export const UNKNOWN_HANDLER_NODE = Symbol.for('UNKNOWN_HANDLER_NODE');

export class UnknownHandlerNode implements LangGraphNode<DebateState> {
  process(_: DebateState): Partial<DebateState> {
    return {
      response: {
        type: ResponseType.PLAIN_ANSWER,
        content:
          '죄송합니다. 요청을 이해하지 못했습니다. 토론 시작이나 토론 주제 추천을 요청해 주세요.',
      },
      next: { node: END },
    };
  }
}

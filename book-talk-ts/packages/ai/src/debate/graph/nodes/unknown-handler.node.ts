import { END } from '@langchain/langgraph';
import type { DebateState } from '../debate.state';

export const unknownHandlerNode = (_: DebateState): Partial<DebateState> => ({
  response: '죄송합니다. 요청을 이해하지 못했습니다. 토론 시작이나 토론 주제 추천을 요청해 주세요.',
  next: END,
});

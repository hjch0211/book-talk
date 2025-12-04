import type { BaseMessage } from '@langchain/core/messages';
import { Annotation, END, messagesStateReducer } from '@langchain/langgraph';
import type { DebateInfo } from '@src/client';
import type {
  RECOMMEND_TOPIC,
  START_DEBATE,
  SUPERVISOR,
  UNKNOWN_HANDLER,
} from '../graph/constants';

/** 노드 키 타입 */
export type NodeKey =
  | typeof SUPERVISOR
  | typeof START_DEBATE
  | typeof RECOMMEND_TOPIC
  | typeof UNKNOWN_HANDLER;

/** 다음 노드 타입 */
export type NextNode = NodeKey | typeof END;

export const DebateStateAnnotation = Annotation.Root({
  /** 사용자 입력 메시지 (누적) */
  messages: Annotation<BaseMessage[]>({
    reducer: messagesStateReducer,
    default: () => [],
  }),

  /** 토론방 ID (불변) */
  debateId: Annotation<string>({
    reducer: (current, update) => current || update,
    default: () => '',
  }),

  /** 토론방 정보 */
  debateInfo: Annotation<DebateInfo | null>({
    reducer: (_, update) => update,
    default: () => null,
  }),

  /** 최종 응답 */
  response: Annotation<string>({
    reducer: (_, update) => update,
    default: () => '',
  }),

  /** 다음 노드 (라우팅용) */
  next: Annotation<NextNode>({
    reducer: (_, update) => update,
    default: () => END,
  }),
});

export type DebateState = typeof DebateStateAnnotation.State;

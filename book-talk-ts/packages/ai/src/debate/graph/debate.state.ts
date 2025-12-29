import { Annotation, END } from '@langchain/langgraph';
import type { DebateInfo } from '@src/client';
import type {
  DebateStarterNodeRequest,
  GetDebateInfoToolNodeRequest,
} from '@src/debate/graph/_requests';

export type ChatHistory = { role: 'assistant' | 'user'; content: string };
export type Next = {
  /** 다음 노드 */
  node: string;
  /** 다음 노드에 전달할 요청 데이터 */
  request?: DebateStarterNodeRequest | GetDebateInfoToolNodeRequest;
};

export const DebateStateAnnotation = Annotation.Root({
  /** 지난 채팅 이력 (불변) */
  chatHistory: Annotation<ChatHistory[]>({
    reducer: (current, update) => current || update,
    default: () => [],
  }),

  /** 사용자 요청 메시지 (불변) */
  request: Annotation<string>({
    reducer: (current, update) => current || update,
    default: () => '',
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
  next: Annotation<Next>({
    reducer: (_, update) => update,
    default: () => ({ node: END }),
  }),
});

export type DebateState = typeof DebateStateAnnotation.State;

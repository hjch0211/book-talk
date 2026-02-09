import { Annotation } from '@langchain/langgraph';
import type { DebateInfo } from '@src/client/debate.client.js';
import type { DebateStarterNodeRequest, GetDebateInfoToolNodeRequest } from './_requests.js';

export type ChatHistory = { role: 'assistant' | 'user'; content: string };
export type NodeRequest = DebateStarterNodeRequest | GetDebateInfoToolNodeRequest | null;
export enum ResponseType {
  /** 일반 텍스트 */
  PLAIN_ANSWER = 'plain_answer',
  /** 토론 시작 응답 */
  DEBATE_START_ANSWER = 'debate_start_answer',
}
export type Response = {
  /** 응답 타입 */
  type: ResponseType;
  /** 응답 내용 */
  content: string;
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
  response: Annotation<Response>({
    reducer: (_, update) => update,
    default: () => ({ type: ResponseType.PLAIN_ANSWER, content: '' }),
  }),

  /** 노드 간 요청 데이터 전달용 */
  nodeRequest: Annotation<NodeRequest>({
    reducer: (_, update) => update,
    default: () => null,
  }),

  /** 에러 메시지 (edge에서 라우팅 판단용) */
  errorMessage: Annotation<string | null>({
    reducer: (_, update) => update,
    default: () => null,
  }),
});

export type DebateState = typeof DebateStateAnnotation.State;

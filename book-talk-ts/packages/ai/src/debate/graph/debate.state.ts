import { Annotation } from '@langchain/langgraph';
import type { AiResponse } from '@src/ai-response.js';
import type { DebateInfo } from '@src/client/debate.client.js';

export type ChatHistory = { role: 'assistant' | 'user'; content: string };
export type Call = 'DEBATE_START' | 'GET_DEBATE_INFO' | null;

export const DebateStateAnnotation = Annotation.Root({
  /** 지난 채팅 이력 */
  chatHistory: Annotation<ChatHistory[]>({
    reducer: (_, update) => update,
    default: () => [],
  }),

  /** 사용자 요청 메시지 */
  request: Annotation<string>({
    reducer: (_, update) => update,
    default: () => '',
  }),

  /** 토론방 ID */
  debateId: Annotation<string>({
    reducer: (_, update) => update,
    default: () => '',
  }),

  /** 토론방 정보 */
  debateInfo: Annotation<DebateInfo | null>({
    reducer: (_, update) => update,
    default: () => null,
  }),

  /** 최종 응답 */
  response: Annotation<AiResponse>({
    reducer: (_, update) => update,
    default: () => ({
      status: 'SUCCESS',
      type: 'PLAIN_ANSWER',
      message: '기본 응답',
      reason: '기본 응답',
    }),
  }),

  /** 다른 노드 호출 */
  call: Annotation<Call>({
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

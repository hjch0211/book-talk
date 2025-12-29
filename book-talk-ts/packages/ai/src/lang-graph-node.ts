/**
 * LangGraph node interface
 *
 * LangGraph node는 반드시 이 인터페이스를 구현해야합니다.
 */
export interface LangGraphNode<T> {
  /** 노드 작업(graph 등록용) */
  process(state: T): Promise<Partial<T>> | Partial<T>;
}

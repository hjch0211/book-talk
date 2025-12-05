export interface CreateRequest {
  /** 토론방 ID */
  debateId: string;
}

export interface ChatRequest {
  /** 사용자 메시지 */
  message: string;
  /** 채팅방 ID */
  chatId: string;
}
import type { AiResponse } from '@src/ai-response.js';

export interface ChatResponse {
  response: AiResponse;
  chatId: string;
}

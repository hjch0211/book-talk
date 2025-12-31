import type { Response } from '@src/debate/graph/debate.state.js';

export interface ChatResponse {
  response: Response;
  chatId: string;
}

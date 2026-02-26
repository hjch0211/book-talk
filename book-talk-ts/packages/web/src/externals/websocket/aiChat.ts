import {
  AiChatCompletedPayloadSchema,
  UserMessageSavedPayloadSchema,
  WSResponseMessageType,
} from './schema';

export class AiChatWebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 2;
  private reconnectDelay = 3000;
  private handlers: AiChatWebSocketHandlers = {};

  connect(handlers: AiChatWebSocketHandlers) {
    this.handlers = handlers;
    this.establishConnection();
  }

  sendHeartbeat() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'C_HEARTBEAT', payload: {} }));
    }
  }

  disconnect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.close();
      this.ws = null;
    }
    this.handlers = {};
    this.reconnectAttempts = 0;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  sendAiChat(chatId: string, message: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: 'C_AI_CHAT',
          payload: { chatId, message },
        })
      );
    }
  }

  private establishConnection() {
    const wsUrl = this.getWebSocketUrl();
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.handlers.onConnectionStatus?.(true);
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('Failed to parse AI chat WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      this.handlers.onConnectionStatus?.(false);
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('AI chat WebSocket error:', error);
    };
  }

  private getWebSocketUrl(): string {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    const wsUrl = baseUrl.replace(/^http/, 'ws');
    const token = localStorage.getItem('accessToken');
    return `${wsUrl}/ws/ai-chat?token=${encodeURIComponent(token || '')}`;
  }

  private handleMessage(message: { type: string; payload?: unknown }) {
    switch (message.type) {
      case WSResponseMessageType.S_HEARTBEAT_ACK:
        break;
      case WSResponseMessageType.S_AI_CHAT_COMPLETED: {
        const parsed = AiChatCompletedPayloadSchema.safeParse(message.payload);
        if (parsed.success && this.handlers.onAiChatCompleted) {
          this.handlers.onAiChatCompleted(parsed.data.chatId);
        }
        break;
      }
      case WSResponseMessageType.S_USER_MESSAGE_SAVED: {
        const parsed = UserMessageSavedPayloadSchema.safeParse(message.payload);
        if (parsed.success && this.handlers.onUserMessageSaved) {
          this.handlers.onUserMessageSaved(parsed.data.chatId);
        }
        break;
      }
      default:
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.establishConnection();
      }, this.reconnectDelay);
    } else {
      console.error('AI chat WebSocket max reconnection attempts reached');
    }
  }
}

export interface AiChatWebSocketHandlers {
  onConnectionStatus?: (connected: boolean) => void;
  onAiChatCompleted?: (chatId: string) => void;
  onUserMessageSaved?: (chatId: string) => void;
}

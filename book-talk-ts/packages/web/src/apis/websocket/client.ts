import {
  type RaisedHandInfo,
  type VoiceMessagePayload,
  type WebSocketMessage,
  WebSocketMessageSchema,
  type WS_DebateRoundUpdateResponse,
  type WS_SpeakerUpdateResponse,
} from './schema';

export class DebateWebSocketClient {
  private ws: WebSocket | null = null;
  private debateId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 2;
  private reconnectDelay = 3000;
  private handlers: WebSocketHandlers = {};

  connect(debateId: string, handlers: WebSocketHandlers) {
    this.debateId = debateId;
    this.handlers = handlers;
    this.establishConnection();
  }

  sendHeartbeat() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const heartbeatMessage = {
            type: 'C_HEARTBEAT',
            accountId: payload.sub,
          };
          this.ws.send(JSON.stringify(heartbeatMessage));
        } catch (error) {
          console.error('Failed to send heartbeat:', error);
        }
      }
    }
  }

  disconnect() {
    if (this.ws) {
      // LEAVE_DEBATE 메시지 전송
      if (this.ws.readyState === WebSocket.OPEN) {
        const token = localStorage.getItem('accessToken');
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const leaveMessage = {
              type: 'C_LEAVE_DEBATE',
              accountId: payload.sub,
              debateId: this.debateId!,
            };
            this.ws.send(JSON.stringify(leaveMessage));
          } catch (error) {
            console.error('Failed to send leave message:', error);
          }
        }
      }

      this.ws.close();
      this.ws = null;
    }

    this.debateId = null;
    this.handlers = {};
    this.reconnectAttempts = 0;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  sendVoiceMessage(message: VoiceMessagePayload): void {
    if (this.ws?.readyState === WebSocket.OPEN && this.debateId) {
      const voiceMessage = {
        ...message,
        debateId: this.debateId,
      };
      this.ws.send(JSON.stringify(voiceMessage));
    } else {
      console.error('❌ WebSocket 전송 실패:', {
        readyState: this.ws?.readyState,
        debateId: this.debateId,
        messageType: message.type,
      });
    }
  }

  sendChatMessage(chatId: number): void {
    if (this.ws?.readyState === WebSocket.OPEN && this.debateId) {
      const chatMessage = {
        type: 'C_CHAT_MESSAGE',
        debateId: this.debateId,
        chatId: chatId,
      };
      this.ws.send(JSON.stringify(chatMessage));
    }
  }

  toggleHand(): void {
    if (this.ws?.readyState === WebSocket.OPEN && this.debateId) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const toggleHandMessage = {
            type: 'C_TOGGLE_HAND',
            debateId: this.debateId,
            accountId: payload.sub,
            accountName: payload.name || 'User',
          };
          this.ws.send(JSON.stringify(toggleHandMessage));
        } catch (error) {
          console.error('Failed to send toggle hand message:', error);
        }
      }
    }
  }

  private establishConnection() {
    if (!this.debateId) return;

    const wsUrl = this.getWebSocketUrl();

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.handlers.onConnectionStatus?.(true);
      this.sendJoinMessage();
    };

    this.ws.onmessage = (event) => {
      try {
        const rawMessage = JSON.parse(event.data);
        const message = WebSocketMessageSchema.parse(rawMessage);
        this.handleMessage(message);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      this.handlers.onConnectionStatus?.(false);
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private getWebSocketUrl(): string {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    const wsUrl = baseUrl.replace(/^http/, 'ws');
    const token = localStorage.getItem('accessToken');
    return `${wsUrl}/ws?debateId=${this.debateId}&token=${encodeURIComponent(token || '')}`;
  }

  private sendJoinMessage() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const token = localStorage.getItem('accessToken');
      if (this.debateId && token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const joinMessage = {
            type: 'C_JOIN_DEBATE',
            debateId: this.debateId,
            accountId: payload.sub,
            accountName: payload.name || 'User',
          };

          // 약간의 지연 후 메시지 전송
          setTimeout(() => {
            this.ws?.send(JSON.stringify(joinMessage));
          }, 100);
        } catch (error) {
          console.error('JWT token parsing failed:', error);
        }
      }
    }
  }

  private handleMessage(message: WebSocketMessage) {
    switch (message.type) {
      case 'S_PRESENCE_UPDATE':
        if (this.handlers.onOnlineMembersUpdate) {
          const onlineIds = new Set<string>(
            message.onlineAccounts.map((account) => account.accountId)
          );
          this.handlers.onOnlineMembersUpdate(onlineIds);
        }
        break;
      case 'S_SPEAKER_UPDATE':
        if (this.handlers.onSpeakerUpdate) {
          this.handlers.onSpeakerUpdate(message);
        }
        break;
      case 'S_JOIN_SUCCESS':
        if (this.handlers.onJoinSuccess) {
          this.handlers.onJoinSuccess();
        }
        break;
      case 'S_HEARTBEAT_ACK':
        break;
      case 'S_DEBATE_ROUND_UPDATE':
        if (this.handlers.onDebateRoundUpdate) {
          this.handlers.onDebateRoundUpdate(message);

          // currentSpeaker 정보가 있으면 SPEAKER_UPDATE로도 처리
          if (this.handlers.onSpeakerUpdate && message.currentSpeaker) {
            const speakerUpdate: WS_SpeakerUpdateResponse = {
              type: 'S_SPEAKER_UPDATE',
              debateId: message.debateId,
              provider: message.provider,
              currentSpeaker: message.currentSpeaker.accountId
                ? {
                    accountId: message.currentSpeaker.accountId,
                    accountName: message.currentSpeaker.accountName!,
                    endedAt: message.currentSpeaker.endedAt,
                  }
                : null,
              nextSpeaker: null,
            };
            this.handlers.onSpeakerUpdate(speakerUpdate);
          }
        }
        break;
      case 'S_VOICE_JOIN':
      case 'S_VOICE_OFFER':
      case 'S_VOICE_ANSWER':
      case 'S_VOICE_ICE_CANDIDATE':
        if (this.handlers.onVoiceSignaling) {
          this.handlers.onVoiceSignaling(message);
        }
        break;
      case 'S_HAND_RAISE_UPDATE':
        if (this.handlers.onHandRaiseUpdate) {
          this.handlers.onHandRaiseUpdate(message.raisedHands);
        }
        break;
      case 'S_CHAT_MESSAGE':
        if (this.handlers.onChatMessage) {
          this.handlers.onChatMessage(message.chatId);
        }
        break;
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
      console.error('Max reconnection attempts reached');
    }
  }
}

export interface WebSocketHandlers {
  onOnlineMembersUpdate?: (onlineAccountIds: Set<string>) => void;
  onConnectionStatus?: (connected: boolean) => void;
  onJoinSuccess?: () => void;
  onSpeakerUpdate?: (speakerInfo: WS_SpeakerUpdateResponse) => void;
  onDebateRoundUpdate?: (roundInfo: WS_DebateRoundUpdateResponse) => void;
  onVoiceSignaling?: (message: WebSocketMessage) => void;
  onHandRaiseUpdate?: (raisedHands: RaisedHandInfo[]) => void;
  onChatMessage?: (chatId: number) => void;
}

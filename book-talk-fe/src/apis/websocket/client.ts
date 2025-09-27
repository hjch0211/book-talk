export class DebateWebSocketClient {
    private ws: WebSocket | null = null;
    private debateId: string | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 2;
    private reconnectDelay = 3000;
    private handlers: WebSocketHandlers = {};

    constructor() {
    }

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
                        type: 'HEARTBEAT',
                        accountId: payload.sub,
                        debateId: this.debateId,
                        timestamp: Date.now()
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
                            type: 'LEAVE_DEBATE',
                            accountId: payload.sub,
                            debateId: this.debateId
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

    sendVoiceMessage(message: Omit<WebSocketMessage, 'debateId'>): void {
        if (this.ws?.readyState === WebSocket.OPEN && this.debateId) {
            const voiceMessage = {
                ...message,
                debateId: this.debateId
            };
            this.ws.send(JSON.stringify(voiceMessage));
        }
    }

    private establishConnection() {
        if (!this.debateId) return;

        const wsUrl = this.getWebSocketUrl();
        console.log('Connecting to WebSocket:', wsUrl);

        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            console.log('Debate WebSocket connected, joining debate');
            this.reconnectAttempts = 0;
            this.handlers.onConnectionStatus?.(true);
            this.sendJoinMessage();
        };

        this.ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data) as WebSocketMessage;
                console.log('WebSocket message received:', message);
                this.handleMessage(message);
            } catch (error) {
                console.error('Failed to parse WebSocket message:', error);
            }
        };

        this.ws.onclose = (event) => {
            console.log('Debate WebSocket closed:', event.code, event.reason);
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
        return `${wsUrl}/ws/presence?debateId=${this.debateId}&token=${encodeURIComponent(token || '')}`;
    }

    private sendJoinMessage() {
        if (this.ws?.readyState === WebSocket.OPEN) {
            const token = localStorage.getItem('accessToken');
            if (this.debateId && token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const joinMessage = {
                        type: 'JOIN_DEBATE',
                        debateId: this.debateId,
                        accountId: payload.sub,
                        accountName: payload.name || 'User'
                    };
                    console.log('Sending JOIN_DEBATE message:', joinMessage);

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
            case 'PRESENCE_UPDATE':
                if (Array.isArray(message.onlineAccounts) && this.handlers.onPresenceUpdate) {
                    const onlineIds = new Set<string>(
                        message.onlineAccounts.map((account: { accountId: string }) => account.accountId)
                    );
                    this.handlers.onPresenceUpdate(onlineIds);
                }
                break;
            case 'SPEAKER_UPDATE':
                if (this.handlers.onSpeakerUpdate) {
                    this.handlers.onSpeakerUpdate({
                        type: message.type,
                        debateId: message.debateId,
                        currentSpeaker: message.currentSpeaker,
                        nextSpeaker: message.nextSpeaker
                    });
                }
                // TODO: 추 후 새로고침말고 다른 방법 찾기
                window.location.reload();
                break;
            case 'JOIN_SUCCESS':
                console.log('Successfully joined debate:', message);
                break;
            case 'HEARTBEAT_ACK':
                console.log('Heartbeat acknowledged:', message);
                break;
            case 'DEBATE_ROUND_UPDATE':
                if (this.handlers.onDebateRoundUpdate && message.round) {
                    console.log('Debate round updated:', message);
                    this.handlers.onDebateRoundUpdate({
                        type: message.type,
                        debateId: message.debateId,
                        round: message.round
                    });

                    // currentSpeaker 정보가 있으면 SPEAKER_UPDATE로도 처리
                    if (this.handlers.onSpeakerUpdate && message.currentSpeaker) {
                        console.log('Processing currentSpeaker from DEBATE_ROUND_UPDATE:', message.currentSpeaker);
                        this.handlers.onSpeakerUpdate({
                            type: 'SPEAKER_UPDATE',
                            debateId: message.debateId,
                            currentSpeaker: message.currentSpeaker
                        });
                    }
                }
                // TODO: 추 후 새로고침말고 다른 방법 찾기
                window.location.reload();
                break;
            case 'VOICE_JOIN':
            case 'VOICE_LEAVE':
            case 'VOICE_OFFER':
            case 'VOICE_ANSWER':
            case 'VOICE_ICE':
            case 'VOICE_STATE':
                if (this.handlers.onVoiceSignaling) {
                    this.handlers.onVoiceSignaling(message);
                }
                break;
            default:
                console.log('Unknown message type:', message.type);
        }
    }

    private attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;

            setTimeout(() => {
                console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
                this.establishConnection();
            }, this.reconnectDelay);
        } else {
            console.error('Max reconnection attempts reached');
        }
    }
}

export interface WebSocketMessage {
    type: 'JOIN_DEBATE' | 'LEAVE_DEBATE' | 'PRESENCE_UPDATE' | 'JOIN_SUCCESS' | 'HEARTBEAT' | 'HEARTBEAT_ACK' | 'SPEAKER_UPDATE' | 'SPEAKER_TIME_UPDATE' | 'SPEAKER_ENDED' | 'DEBATE_ROUND_UPDATE' | 'VOICE_JOIN' | 'VOICE_LEAVE' | 'VOICE_OFFER' | 'VOICE_ANSWER' | 'VOICE_ICE' | 'VOICE_STATE';
    debateId?: string;
    accountId?: string;
    accountName?: string;
    timestamp?: number;
    onlineAccounts?: Array<{
        accountId: string;
        accountName: string;
        status: string;
        lastHeartbeat: number;
    }>;
    // Speaker 관련 필드
    currentSpeaker?: {
        accountId: string;
        accountName: string;
        endedAt?: number;
    };
    nextSpeaker?: {
        accountId: string;
        accountName: string;
    };
    currentSpeakerId?: string;
    remainingSeconds?: number;
    endedSpeakerId?: string;
    // Debate Round 관련 필드
    round?: {
        id: number;
        type: string;
        nextSpeakerId: string;
        nextSpeakerName: string;
        createdAt: number;
        endedAt?: number;
    };
    // Voice 관련 필드
    fromId?: string;
    toId?: string;
    offer?: RTCSessionDescriptionInit;
    answer?: RTCSessionDescriptionInit;
    iceCandidate?: RTCIceCandidateInit;
    isMuted?: boolean;
}

export interface WebSocketHandlers {
    onPresenceUpdate?: (onlineAccountIds: Set<string>) => void;
    onConnectionStatus?: (connected: boolean) => void;
    onSpeakerUpdate?: (speakerInfo: unknown) => void;
    onDebateRoundUpdate?: (roundInfo: unknown) => void;
    onVoiceSignaling?: (message: WebSocketMessage) => void;
}
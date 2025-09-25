export class PresenceWebSocket {
    private ws: WebSocket | null = null;
    private debateId: string | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 2;
    private reconnectDelay = 3000;
    private onPresenceUpdateCallback?: (onlineAccountIds: Set<string>) => void;
    private onConnectionStatusCallback?: (connected: boolean) => void;

    constructor() {}

    connect(
        debateId: string,
        onPresenceUpdate?: (onlineAccountIds: Set<string>) => void,
        onConnectionStatus?: (connected: boolean) => void
    ) {
        this.debateId = debateId;
        this.onPresenceUpdateCallback = onPresenceUpdate;
        this.onConnectionStatusCallback = onConnectionStatus;
        this.establishConnection();
    }

    private establishConnection() {
        if (!this.debateId) return;

        const wsUrl = this.getWebSocketUrl();
        console.log('Connecting to WebSocket:', wsUrl);

        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            console.log('Presence WebSocket connected, joining debate');
            this.reconnectAttempts = 0;
            this.onConnectionStatusCallback?.(true);
            this.sendJoinMessage();
        };

        this.ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data) as PresenceMessage;
                console.log('Presence message received:', message);
                this.handleMessage(message);
            } catch (error) {
                console.error('Failed to parse WebSocket message:', error);
            }
        };

        this.ws.onclose = (event) => {
            console.log('Presence WebSocket closed:', event.code, event.reason);
            this.onConnectionStatusCallback?.(false);
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

    private handleMessage(message: PresenceMessage) {
        switch (message.type) {
            case 'PRESENCE_UPDATE':
                if (Array.isArray(message.onlineAccounts) && this.onPresenceUpdateCallback) {
                    const onlineIds = new Set<string>(
                        message.onlineAccounts.map((account: { accountId: string }) => account.accountId)
                    );
                    this.onPresenceUpdateCallback(onlineIds);
                }
                break;
            case 'JOIN_SUCCESS':
                console.log('Successfully joined debate:', message);
                break;
            case 'HEARTBEAT_ACK':
                console.log('Heartbeat acknowledged:', message);
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
        this.onPresenceUpdateCallback = undefined;
        this.onConnectionStatusCallback = undefined;
        this.reconnectAttempts = 0;
    }

    isConnected(): boolean {
        return this.ws?.readyState === WebSocket.OPEN;
    }
}

export interface PresenceMessage {
    type: 'JOIN_DEBATE' | 'LEAVE_DEBATE' | 'PRESENCE_UPDATE' | 'JOIN_SUCCESS' | 'HEARTBEAT' | 'HEARTBEAT_ACK';
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
}

export interface PresenceUpdate {
    accountId: string;
    isOnline: boolean;
}
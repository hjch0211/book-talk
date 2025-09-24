export class PresenceWebSocket {
    private ws: WebSocket | null = null;
    private debateId: string | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 1000;
    private onPresenceUpdateCallback?: (updates: PresenceUpdate[]) => void;

    constructor() {}

    connect(debateId: string, onPresenceUpdate?: (updates: PresenceUpdate[]) => void) {
        this.debateId = debateId;
        this.onPresenceUpdateCallback = onPresenceUpdate;
        this.establishConnection();
    }

    private establishConnection() {
        if (!this.debateId) return;

        const wsUrl = this.getWebSocketUrl();
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            console.log('WebSocket connected for presence tracking');
            this.reconnectAttempts = 0;
            this.sendJoinMessage();
        };

        this.ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data) as PresenceMessage;
                this.handleMessage(message);
            } catch (error) {
                console.error('Failed to parse WebSocket message:', error);
            }
        };

        this.ws.onclose = (event) => {
            console.log('WebSocket connection closed:', event.code, event.reason);
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
        return `${wsUrl}/ws/presence?debateId=${this.debateId}&token=${token}`;
    }

    private sendJoinMessage() {
        if (this.ws?.readyState === WebSocket.OPEN) {
            const message: PresenceMessage = {
                type: 'JOIN',
                debateId: this.debateId!,
                timestamp: new Date().toISOString()
            };
            this.ws.send(JSON.stringify(message));
        }
    }

    private handleMessage(message: PresenceMessage) {
        switch (message.type) {
            case 'PRESENCE_UPDATE':
                if (message.presenceUpdates && this.onPresenceUpdateCallback) {
                    this.onPresenceUpdateCallback(message.presenceUpdates);
                }
                break;
            default:
                console.log('Unknown message type:', message.type);
        }
    }

    private attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

            setTimeout(() => {
                console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
                this.establishConnection();
            }, delay);
        } else {
            console.error('Max reconnection attempts reached');
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.debateId = null;
        this.onPresenceUpdateCallback = undefined;
        this.reconnectAttempts = 0;
    }

    isConnected(): boolean {
        return this.ws?.readyState === WebSocket.OPEN;
    }
}

export interface PresenceMessage {
    type: 'JOIN' | 'LEAVE' | 'PRESENCE_UPDATE';
    debateId: string;
    timestamp: string;
    presenceUpdates?: PresenceUpdate[];
}

export interface PresenceUpdate {
    accountId: string;
    isOnline: boolean;
}
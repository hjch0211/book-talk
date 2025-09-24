import { useEffect, useRef, useCallback } from 'react';

interface UseWebSocketOptions {
    onOpen?: () => void;
    onMessage?: (event: MessageEvent) => void;
    onClose?: (event: CloseEvent) => void;
    onError?: (event: Event) => void;
    shouldReconnect?: boolean;
    maxReconnectAttempts?: number;
    reconnectDelay?: number;
}

export const useWebSocket = (url: string | null, options: UseWebSocketOptions = {}) => {
    const {
        onOpen,
        onMessage,
        onClose,
        onError,
        shouldReconnect = true,
        maxReconnectAttempts = 5,
        reconnectDelay = 1000
    } = options;

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectAttemptsRef = useRef(0);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const connect = useCallback(() => {
        if (!url || wsRef.current?.readyState === WebSocket.CONNECTING || wsRef.current?.readyState === WebSocket.OPEN) {
            return;
        }

        wsRef.current = new WebSocket(url);

        wsRef.current.onopen = (event) => {
            console.log('WebSocket connected to:', url);
            reconnectAttemptsRef.current = 0;
            onOpen?.();
        };

        wsRef.current.onmessage = (event) => {
            onMessage?.(event);
        };

        wsRef.current.onclose = (event) => {
            console.log('WebSocket connection closed:', event.code, event.reason);
            console.log('Close event details:', {
                wasClean: event.wasClean,
                code: event.code,
                reason: event.reason || 'No reason provided'
            });
            onClose?.(event);

            if (shouldReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
                attemptReconnect();
            }
        };

        wsRef.current.onerror = (event) => {
            console.error('WebSocket error:', event);
            onError?.(event);
        };
    }, [url, onOpen, onMessage, onClose, onError, shouldReconnect, maxReconnectAttempts]);

    const attemptReconnect = useCallback(() => {
        if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
            console.error('Max reconnection attempts reached');
            return;
        }

        reconnectAttemptsRef.current++;
        const delay = reconnectDelay * Math.pow(2, reconnectAttemptsRef.current - 1);

        reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Attempting to reconnect... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
            connect();
        }, delay);
    }, [maxReconnectAttempts, reconnectDelay, connect]);

    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        reconnectAttemptsRef.current = 0;
    }, []);

    const sendMessage = useCallback((message: string | object) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
            wsRef.current.send(messageStr);
            return true;
        }
        return false;
    }, []);

    const isConnected = useCallback(() => {
        return wsRef.current?.readyState === WebSocket.OPEN;
    }, []);

    useEffect(() => {
        if (url) {
            connect();
        }

        return () => {
            disconnect();
        };
    }, [url]); // connect와 disconnect 의존성 제거

    return {
        sendMessage,
        disconnect,
        isConnected,
        webSocket: wsRef.current
    };
};
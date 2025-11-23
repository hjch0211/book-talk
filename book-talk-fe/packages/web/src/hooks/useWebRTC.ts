import {useCallback, useEffect, useRef, useState} from 'react';
import {type MediaConnection, Peer, type PeerOptions} from 'peerjs';

export interface RemoteStream {
    peerId: string;
    stream: MediaStream;
}

export interface UseWebRTCOptions {
    onError?: (error: Error) => void;
}

/** webRTC 최대 재연결수 */
const MAX_RETRY_COUNT = 3;

export const useWebRTC = (options?: UseWebRTCOptions) => {
    /** 내 Peer ID */
    const [myPeerId, setMyPeerId] = useState<string | null>(null);
    /** 상대방들의 미디어 스트림 목록 */
    const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);

    /** Peer Instance */
    const peerRef = useRef<Peer | null>(null);
    /** 미디어 연결 Map */
    const mediaConnectionsRef = useRef<Map<string, MediaConnection>>(new Map());
    /** 내 로컬 미디어 스트림 (마이크/카메라) */
    const localStreamRef = useRef<MediaStream | null>(null);
    /** 재시도 횟수 */
    const retryCountRef = useRef(0);

    /** 콜백 ref */
    const onErrorRef = useRef(options?.onError);
    useEffect(() => {
        onErrorRef.current = options?.onError;
    }, [options?.onError]);

    /** 미디어 연결 설정 */
    const setupMediaConnection = useCallback((call: MediaConnection) => {
        call.on('stream', (remoteStream) => {
            setRemoteStreams(prev => {
                const filtered = prev.filter(rs => rs.peerId !== call.peer);
                return [...filtered, {peerId: call.peer, stream: remoteStream}];
            });
            console.log('스트림 수신:', call.peer);
        });

        call.on('close', () => {
            mediaConnectionsRef.current.delete(call.peer);
            setRemoteStreams(prev => prev.filter(rs => rs.peerId !== call.peer));
            console.log('미디어 연결 종료:', call.peer);
        });

        mediaConnectionsRef.current.set(call.peer, call);
    }, []);

    /** Peer 초기화 */
    const initPeer = useCallback((id?: string, peerOptions?: PeerOptions) => {
        const peer = id
            ? (peerOptions ? new Peer(id, peerOptions) : new Peer(id))
            : (peerOptions ? new Peer(peerOptions) : new Peer());
        peerRef.current = peer;
        retryCountRef.current = 0;

        peer.on('open', (peerId) => {
            setMyPeerId(peerId);
            retryCountRef.current = 0;
            console.log('Peer 연결됨:', peerId);
        });

        peer.on('call', (call) => {
            if (localStreamRef.current) {
                call.answer(localStreamRef.current);
            } else {
                call.answer();
            }
            setupMediaConnection(call);
        });

        peer.on('disconnected', () => {
            console.log('Signaling 서버 연결 끊김');
            if (retryCountRef.current < MAX_RETRY_COUNT) {
                retryCountRef.current++;
                console.log(`재연결 시도 (${retryCountRef.current}/${MAX_RETRY_COUNT})...`);
                peer.reconnect();
            } else {
                console.error('재연결 실패: 최대 재시도 횟수 초과');
                onErrorRef.current?.(new Error('재연결 실패: 최대 재시도 횟수 초과'));
            }
        });

        peer.on('error', (err) => {
            console.error('Peer 에러:', err);
            if (!peer.destroyed && retryCountRef.current < MAX_RETRY_COUNT) {
                retryCountRef.current++;
                console.log(`재연결 시도 (${retryCountRef.current}/${MAX_RETRY_COUNT})...`);
                peer.reconnect();
            } else if (retryCountRef.current >= MAX_RETRY_COUNT) {
                console.error('재연결 실패: 최대 재시도 횟수 초과');
                onErrorRef.current?.(new Error('재연결 실패: 최대 재시도 횟수 초과'));
            }
        });
    }, [setupMediaConnection]);

    /** 브라우저 마이크/카메라 권한 요청 */
    const startLocalStream = useCallback(async (constraints: MediaStreamConstraints = {video: true, audio: true}) => {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        localStreamRef.current = stream;
        return stream;
    }, []);

    /** 미디어 스트림 전송 */
    const call = useCallback((peerIds: string[]) => {
        if (!peerRef.current || !localStreamRef.current) return;

        peerIds.forEach((peerId) => {
            if (!mediaConnectionsRef.current.has(peerId)) {
                const mediaCall = peerRef.current!.call(peerId, localStreamRef.current!);
                setupMediaConnection(mediaCall);
            }
        });
    }, [setupMediaConnection]);

    /** 연결 종료 */
    const disconnect = useCallback(() => {
        mediaConnectionsRef.current.forEach(call => call.close());
        mediaConnectionsRef.current.clear();

        localStreamRef.current?.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;

        peerRef.current?.destroy();
        peerRef.current = null;

        setMyPeerId(null);
        setRemoteStreams([]);
        retryCountRef.current = 0;
    }, []);

    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return {
        myPeerId,
        remoteStreams,
        initPeer,
        startLocalStream,
        call,
        disconnect
    };
};
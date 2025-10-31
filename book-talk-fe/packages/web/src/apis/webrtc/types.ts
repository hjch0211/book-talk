/**
 * Voice Chat 타입 정의
 */

/**
 * 연결 상태 머신
 */
export type ConnectionState =
    | 'idle'          // 초기 상태, 연결 안 됨
    | 'connecting'    // 미디어 획득 중, peer connection 생성 중
    | 'connected'     // 연결 성공
    | 'reconnecting'  // ICE Restart 진행 중
    | 'failed'        // 모든 재시도 후 연결 실패
    | 'closed';       // 명시적으로 종료됨

/**
 * WebSocket 시그널링 메시지 타입
 */
export interface SignalingMessage {
    type: string;
    debateId: string;
    fromId: string;
    toId: string;
    [key: string]: any;
}

export interface VoiceOfferMessage extends SignalingMessage {
    type: 'VOICE_OFFER';
    offer: RTCSessionDescriptionInit;
}

export interface VoiceAnswerMessage extends SignalingMessage {
    type: 'VOICE_ANSWER';
    answer: RTCSessionDescriptionInit;
}

export interface VoiceIceMessage extends SignalingMessage {
    type: 'VOICE_ICE';
    iceCandidate: RTCIceCandidateInit;
}

/**
 * VoiceChatManager 이벤트
 */
export type VoiceChatEvent =
    | 'stateChange'
    | 'remoteStream'
    | 'error';

export interface VoiceChatEventMap {
    stateChange: (state: ConnectionState) => void;
    remoteStream: (stream: MediaStream | null) => void;
    error: (error: Error) => void;
}

/**
 * VoiceChatManager 설정
 */
export interface VoiceChatConfig {
    debateId: string;
    myId: string;
    remotePeerId: string;
    onSendSignaling: (message: SignalingMessage) => void;
}

/**
 * ICE 연결 통계
 */
export interface ConnectionStats {
    state: ConnectionState;
    iceConnectionState: RTCIceConnectionState | null;
    reconnectAttempts: number;
    hasLocalStream: boolean;
    hasRemoteStream: boolean;
}

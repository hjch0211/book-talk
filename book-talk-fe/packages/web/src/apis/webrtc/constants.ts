/**
 * Voice Chat 설정 상수
 */

/**
 * NAT 통과를 위한 ICE 서버
 */
export const ICE_SERVERS: RTCConfiguration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
    ]
};

/**
 * 오디오 미디어 제약 조건
 */
export const AUDIO_CONSTRAINTS: MediaStreamConstraints = {
    audio: {
        echoCancellation: true,    // 에코 제거
        noiseSuppression: true,     // 노이즈 제거
        autoGainControl: true       // 자동 볼륨 조절
    },
    video: false
};

/**
 * 재연결 설정
 */
export const MAX_RECONNECT_ATTEMPTS = 3;

/**
 * ICE Restart 시도 전 disconnected 상태 대기 시간 (ms)
 */
export const DISCONNECT_TIMEOUT_MS = 10000; // 10초

/**
 * 작업 타임아웃 (ms)
 */
export const OPERATION_TIMEOUT_MS = 30000; // 30초

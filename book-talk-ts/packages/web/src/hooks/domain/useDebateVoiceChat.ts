import { useWebRTC } from '@src/hooks';
import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  WebSocketMessage,
  WS_VoiceAnswerRequest,
  WS_VoiceIceCandidateRequest,
  WS_VoiceJoinRequest,
  WS_VoiceOfferRequest,
} from '../../apis/websocket/schema';

/** Voice 메시지 타입 (전송용) */
type VoiceMessage =
  | WS_VoiceJoinRequest
  | WS_VoiceOfferRequest
  | WS_VoiceAnswerRequest
  | WS_VoiceIceCandidateRequest;

/** Voice chat 연결 상태 */
export type VoiceConnectionStatus = 'NOT_STARTED' | 'PENDING' | 'COMPLETED' | 'FAILED';

export interface UseDebateVoiceChatOptions {
  /** 내 ID */
  myId: string;
  /** 토론 ID */
  debateId: string;
  /** Voice 메시지 전송 함수 */
  sendVoiceMessage: (message: VoiceMessage) => void;
  /** 수신된 음성 시그널링 메시지 (WebSocket에서 전달) */
  voiceMessage: WebSocketMessage | null;
  /** 현재 접속 중인 계정 ID 목록 */
  onlineAccountIds: Set<string>;
  /** 에러 콜백 */
  onError?: (error: Error) => void;
}

/**
 * 토론 음성 채팅 관리 (내부 전용)
 * - 토론방 입장 시 자동 참여
 * - WebRTC P2P 연결 관리
 * - 원격 오디오 스트림 병합
 *
 * @internal useDebate 내부에서만 사용
 */
export const useDebateVoiceChat = (options: UseDebateVoiceChatOptions) => {
  const { myId, debateId, sendVoiceMessage, voiceMessage, onlineAccountIds, onError } = options;

  const [connectionStatus, setConnectionStatus] = useState<VoiceConnectionStatus>('NOT_STARTED');
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(true);
  /** 실제 P2P 연결이 완료된 peer ID 목록 */
  const [connectedPeerIds, setConnectedPeerIds] = useState<Set<string>>(new Set());

  /** 최신 상태를 ref로 유지 (useEffect 내에서 사용) */
  const connectionStatusRef = useRef(connectionStatus);
  connectionStatusRef.current = connectionStatus;

  /** 마지막 처리된 메시지 추적 (중복 처리 방지) */
  const lastProcessedMessageRef = useRef<WebSocketMessage | null>(null);

  const {
    localStream,
    remoteStreams,
    startLocalStream,
    createOffer,
    handleOffer,
    handleAnswer,
    addIceCandidate,
    disconnect,
  } = useWebRTC({
    myId,
    onError: (error) => {
      setConnectionStatus('FAILED');
      onError?.(error);
    },
    onReconnectNeeded: () => {
      if (connectionStatusRef.current !== 'COMPLETED' || !myId) return;
      setConnectionStatus('PENDING');
      setConnectedPeerIds(new Set());
      sendVoiceMessage({
        type: 'C_VOICE_JOIN',
        provider: 'CLIENT',
        debateId,
        accountId: myId,
      });
    },
    onIceCandidate: ({ myId: fromId, peerId, candidate }) => {
      sendVoiceMessage({
        type: 'C_VOICE_ICE_CANDIDATE',
        provider: 'CLIENT',
        debateId,
        fromId,
        toId: peerId,
        candidate,
      });
    },
    onPeerConnected: (peerId) => {
      console.log(`✅ P2P 연결 완료: ${peerId}`);
      setConnectedPeerIds((prev) => new Set([...prev, peerId]));
    },
  });

  /** 음성 채팅 참여 */
  const join = useCallback(async () => {
    if (connectionStatusRef.current !== 'NOT_STARTED' || !myId) return;

    const stream = await startLocalStream({ audio: true, video: false });
    if (!stream) {
      console.error('로컬 스트림 생성 실패');
      setConnectionStatus('FAILED');
      return;
    }

    setConnectionStatus('PENDING');

    sendVoiceMessage({
      type: 'C_VOICE_JOIN',
      provider: 'CLIENT',
      debateId,
      accountId: myId,
    });
  }, [myId, debateId, sendVoiceMessage, startLocalStream]);

  /** 음성 채팅 퇴장 */
  const leave = useCallback(() => {
    if (connectionStatusRef.current !== 'COMPLETED') return;

    disconnect();
    setConnectionStatus('NOT_STARTED');
  }, [disconnect]);

  /** 음소거 토글 */
  const toggleMute = useCallback(() => {
    const stream = localStream;
    if (!stream) return;

    const newMuted = !isMuted;
    stream.getAudioTracks().forEach((track) => {
      track.enabled = !newMuted;
    });
    setIsMuted(newMuted);
  }, [localStream, isMuted]);

  /** 오디오 활성화 (사용자 제스처로 autoplay policy 해제) */
  const activateAudio = useCallback(() => {
    setIsAudioActive(true);
  }, []);

  /** Autoplay 차단 시 호출 (AudioPlayer에서 전달) */
  const onAutoplayBlocked = useCallback(() => {
    setIsAudioActive(false);
  }, []);

  /** WebSocket voice message handling */
  const processVoiceMessage = useCallback(
    async (message: WebSocketMessage) => {
      const status = connectionStatusRef.current;
      const isConnectable = status === 'PENDING' || status === 'COMPLETED';

      switch (message.type) {
        /** 새 참가자 입장 → Offer 전송 */
        case 'S_VOICE_JOIN': {
          const fromId = message.fromId;
          if (fromId === myId) return;

          // NOT_STARTED면 먼저 join()
          if (status === 'NOT_STARTED') {
            await join();
          }

          const offer = await createOffer(fromId);
          if (offer) {
            sendVoiceMessage({
              type: 'C_VOICE_OFFER',
              provider: 'CLIENT',
              debateId,
              fromId: myId,
              toId: fromId,
              offer,
            });
          }
          break;
        }

        /** Offer 수신 → Answer 응답 */
        case 'S_VOICE_OFFER': {
          if (message.toId !== myId || !isConnectable) return;

          const answer = await handleOffer(message.fromId, message.offer);
          if (answer) {
            sendVoiceMessage({
              type: 'C_VOICE_ANSWER',
              provider: 'CLIENT',
              debateId,
              fromId: myId,
              toId: message.fromId,
              answer,
            });
          }
          break;
        }

        /** Answer 수신 → 연결 완료 */
        case 'S_VOICE_ANSWER': {
          if (message.toId !== myId) return;
          await handleAnswer(message.fromId, message.answer);
          break;
        }

        /** ICE Candidate 수신 */
        case 'S_VOICE_ICE_CANDIDATE': {
          if (message.toId !== myId) return;
          await addIceCandidate(message.fromId, message.candidate);
          break;
        }
      }
    },
    [
      myId,
      debateId,
      join,
      createOffer,
      handleOffer,
      handleAnswer,
      addIceCandidate,
      sendVoiceMessage,
    ]
  );

  // voiceMessage가 변경되면 처리 (중복 처리 방지)
  useEffect(() => {
    if (voiceMessage && voiceMessage !== lastProcessedMessageRef.current) {
      lastProcessedMessageRef.current = voiceMessage;
      void processVoiceMessage(voiceMessage);
    }
  }, [voiceMessage, processVoiceMessage]);

  // PENDING 상태에서 COMPLETED로 전이
  // - 혼자일 경우: 즉시 COMPLETED
  // - 여러 명일 경우: 모든 peer와 실제 P2P 연결이 완료되면 COMPLETED
  useEffect(() => {
    if (connectionStatus !== 'PENDING') return;

    const isAlone = onlineAccountIds.size <= 1;
    const allPeersConnected = connectedPeerIds.size >= onlineAccountIds.size - 1;

    if (isAlone || allPeersConnected) {
      setConnectionStatus('COMPLETED');
    }
  }, [connectionStatus, onlineAccountIds.size, connectedPeerIds.size]);

  return {
    /** 음성 연결 상태 (NOT_STARTED | PENDING | COMPLETED | FAILED) */
    connectionStatus,
    /** 음소거 상태 */
    isMuted,
    /** 오디오 재생 가능 상태 (사용자 제스처 후 true) */
    isAudioActive,
    /** 로컬 오디오 스트림 */
    localStream,
    /** 원격 오디오 스트림 목록 */
    remoteStreams,
    /** 음성 채팅 참여 (방장이 토론 시작 시 호출) */
    join,
    /** 음성 채팅 퇴장 */
    leave,
    /** 음소거 토글 */
    toggleMute,
    /** 오디오 활성화 (사용자 클릭 필요) */
    activateAudio,
    /** Autoplay 차단 콜백 (AudioPlayer에 전달) */
    onAutoplayBlocked,
  };
};

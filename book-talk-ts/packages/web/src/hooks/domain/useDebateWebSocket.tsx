import {
  findOneDebateQueryOptions,
  getChatsQueryOptions,
  type MemberInfo,
  type RoundType,
} from '@src/apis/debate';
import {
  DebateWebSocketClient,
  type RaisedHandInfo,
  type WebSocketMessage,
  type WS_DebateRoundUpdateResponse,
  type WS_SpeakerUpdateResponse,
} from '@src/apis/websocket';
import { useWebRTC } from '@src/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { VoiceConnectionStatus } from './useDebateVoiceChat';

interface UseDebateWebSocketOptions {
  onRoundStartBackdrop: (roundType: RoundType) => void;
  onVoiceChatError: (error: Error) => void;
}

export interface MemberWithPresence extends MemberInfo {
  isMe: boolean;
}

/**
 * WebSocket 연결 및 실시간 통신 관리
 * - WebSocket 연결/해제
 * - 메시지 송수신
 * - 상태 관리 (온라인, 손들기)
 * - 비즈니스 로직 (Query 갱신, UI 이벤트)
 * - 온라인 멤버 목록 계산
 * - WebRTC P2P 음성 채팅 연결 관리
 *
 * @internal useDebate 내부에서만 사용
 */
export const useDebateWebSocket = (
  debateId: string | null,
  members: MemberInfo[],
  myAccountId: string | undefined,
  isFreeRound: boolean,
  options: UseDebateWebSocketOptions
) => {
  const queryClient = useQueryClient();
  const [onlineAccountIds, setOnlineAccountIds] = useState<Set<string>>(new Set());
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isDebateJoined, setIsDebateJoined] = useState<boolean>(false);
  const [raisedHands, setRaisedHands] = useState<RaisedHandInfo[]>([]);
  const wsClientRef = useRef<DebateWebSocketClient | null>(null);
  const heartbeatIntervalRef = useRef<number | null>(null);

  const [voiceConnectionStatus, setVoiceConnectionStatus] =
    useState<VoiceConnectionStatus>('NOT_STARTED');
  /** 실제 P2P 연결이 완료된 peer ID 목록 */
  const [connectedPeerIds, setConnectedPeerIds] = useState<Set<string>>(new Set());

  /** 음성 메시지 전송 */
  const sendVoiceMessage = useCallback((message: WebSocketMessage) => {
    console.log('🎙️ sendVoiceMessage 호출:', message.type);
    if (wsClientRef.current?.isConnected()) {
      console.log('  ✅ WebSocket 연결됨, 메시지 전송');
      wsClientRef.current.sendVoiceMessage(message);
    } else {
      console.error('  ❌ WebSocket 연결 안됨!');
    }
  }, []);

  const {
    localStream,
    remoteStreams,
    startLocalStream,
    createOffer,
    handleOffer,
    handleAnswer,
    addIceCandidate,
    disconnect: disconnectWebRTC,
  } = useWebRTC({
    myId: myAccountId ?? '',
    onError: (error) => {
      setVoiceConnectionStatus('FAILED');
      options.onVoiceChatError(error);
    },
    onReconnectNeeded: () => {
      if (!myAccountId || !debateId) return;
      setVoiceConnectionStatus('PENDING');
      setConnectedPeerIds(new Set());
      sendVoiceMessage({
        type: 'C_VOICE_JOIN',
        provider: 'CLIENT',
        debateId,
        accountId: myAccountId,
      });
    },
    onIceCandidate: ({ myId: fromId, peerId, candidate }) => {
      if (!debateId) return;
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
  const joinVoiceChat = useCallback(async () => {
    if (voiceConnectionStatus !== 'NOT_STARTED' || !myAccountId || !debateId) return;

    const stream = await startLocalStream({ audio: true, video: false });
    if (!stream) {
      console.error('로컬 스트림 생성 실패');
      setVoiceConnectionStatus('FAILED');
      return;
    }

    setVoiceConnectionStatus('PENDING');

    sendVoiceMessage({
      type: 'C_VOICE_JOIN',
      provider: 'CLIENT',
      debateId,
      accountId: myAccountId,
    });
  }, [voiceConnectionStatus, myAccountId, debateId, sendVoiceMessage, startLocalStream]);

  /** 음성 채팅 퇴장 */
  const leaveVoiceChat = useCallback(() => {
    if (voiceConnectionStatus !== 'COMPLETED') return;

    disconnectWebRTC();
    setVoiceConnectionStatus('NOT_STARTED');
  }, [voiceConnectionStatus, disconnectWebRTC]);

  /** WebSocket voice message handling */
  const handleVoiceMessage = useCallback(
    async (message: WebSocketMessage) => {
      if (!myAccountId || !debateId) return;
      const isConnectable =
        voiceConnectionStatus === 'PENDING' || voiceConnectionStatus === 'COMPLETED';

      switch (message.type) {
        /** 새 참가자 입장 → Offer 전송 */
        case 'S_VOICE_JOIN': {
          const fromId = message.fromId;
          if (fromId === myAccountId) return;

          // NOT_STARTED면 먼저 join()
          if (voiceConnectionStatus === 'NOT_STARTED') {
            await joinVoiceChat();
          }

          const offer = await createOffer(fromId);
          if (offer) {
            sendVoiceMessage({
              type: 'C_VOICE_OFFER',
              provider: 'CLIENT',
              debateId,
              fromId: myAccountId,
              toId: fromId,
              offer,
            });
          }
          break;
        }

        /** Offer 수신 → Answer 응답 */
        case 'S_VOICE_OFFER': {
          if (message.toId !== myAccountId || !isConnectable) return;

          const answer = await handleOffer(message.fromId, message.offer);
          if (answer) {
            sendVoiceMessage({
              type: 'C_VOICE_ANSWER',
              provider: 'CLIENT',
              debateId,
              fromId: myAccountId,
              toId: message.fromId,
              answer,
            });
          }
          break;
        }

        /** Answer 수신 → 연결 완료 */
        case 'S_VOICE_ANSWER': {
          if (message.toId !== myAccountId) return;
          await handleAnswer(message.fromId, message.answer);
          break;
        }

        /** ICE Candidate 수신 */
        case 'S_VOICE_ICE_CANDIDATE': {
          if (message.toId !== myAccountId) return;
          await addIceCandidate(message.fromId, message.candidate);
          break;
        }
      }
    },
    [
      voiceConnectionStatus,
      myAccountId,
      debateId,
      joinVoiceChat,
      createOffer,
      handleOffer,
      handleAnswer,
      addIceCandidate,
      sendVoiceMessage,
    ]
  );

  /** 발언자 업데이트 콜백*/
  const handleSpeakerUpdate = useCallback(
    (speakerInfo: WS_SpeakerUpdateResponse) => {
      console.log('Speaker updated via WebSocket:', speakerInfo);
      if (debateId) {
        void queryClient.invalidateQueries({
          queryKey: findOneDebateQueryOptions(debateId).queryKey,
        });
      }
    },
    [debateId, queryClient]
  );

  /** 토론 라운드 업데이트 콜백*/
  const handleDebateRoundUpdate = useCallback(
    (roundInfo: WS_DebateRoundUpdateResponse) => {
      console.log('Debate round updated via WebSocket:', roundInfo);
      if (debateId) {
        void queryClient.invalidateQueries({
          queryKey: findOneDebateQueryOptions(debateId).queryKey,
        });
      }

      const roundType = roundInfo.round.type as RoundType;
      if (roundType === 'PRESENTATION' || roundType === 'FREE') {
        options.onRoundStartBackdrop(roundType);
      }
    },
    [debateId, queryClient, options.onRoundStartBackdrop]
  );

  /** 음성 시그널링 */
  const handleVoiceSignaling = useCallback(
    (message: WebSocketMessage) => {
      console.log('Voice signaling message received:', message);
      void handleVoiceMessage(message);
    },
    [handleVoiceMessage]
  );

  const combinedHandlers = useMemo(
    () => ({
      onPresenceUpdate: (onlineIds: Set<string>) => {
        console.log('Received online account IDs:', onlineIds);
        setOnlineAccountIds(onlineIds);

        if (debateId) {
          void queryClient.invalidateQueries({
            queryKey: findOneDebateQueryOptions(debateId).queryKey,
          });
        }
      },
      onConnectionStatus: (connected: boolean) => {
        console.log('Connection status changed:', connected);
        setIsConnected(connected);

        // WebSocket 연결 끊김 시 debate join 상태 리셋
        if (!connected) {
          console.log('🔌 WebSocket disconnected - resetting debate join status');
          setIsDebateJoined(false);
        }
      },
      onJoinSuccess: () => {
        console.log('Debate join success - ready for voice chat');
        setIsDebateJoined(true);
      },
      onHandRaiseUpdate: (hands: RaisedHandInfo[]) => {
        console.log('Received raised hands update:', hands);
        setRaisedHands(hands);
      },
      onSpeakerUpdate: handleSpeakerUpdate,
      onDebateRoundUpdate: handleDebateRoundUpdate,
      onVoiceSignaling: handleVoiceSignaling,
      onChatMessage: (chatId: number) => {
        console.log('Received chat message:', chatId);
        if (debateId) {
          void queryClient.invalidateQueries({
            queryKey: getChatsQueryOptions(debateId, isFreeRound, true).queryKey,
          });
        }
      },
    }),
    [
      handleSpeakerUpdate,
      handleDebateRoundUpdate,
      handleVoiceSignaling,
      debateId,
      isFreeRound,
      queryClient,
    ]
  );

  /** WebSocket 연결 및 관리 */
  useEffect(() => {
    if (!debateId) return;
    const wsClient = new DebateWebSocketClient();
    wsClientRef.current = wsClient;

    wsClient.connect(debateId, combinedHandlers);

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }

      if (wsClientRef.current) {
        wsClientRef.current.disconnect();
        wsClientRef.current = null;
      }
    };
  }, [debateId, combinedHandlers]);

  /** WebSocket 하트비트 관리 */
  useEffect(() => {
    if (isConnected && wsClientRef.current) {
      // 30초마다 하트비트 전송
      heartbeatIntervalRef.current = window.setInterval(() => {
        console.log('Sending heartbeat...');
        wsClientRef.current?.sendHeartbeat();
      }, 30000);
    } else {
      // 연결이 끊어지면 하트비트 중단
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
    }

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
    };
  }, [isConnected]);

  /** 온라인 멤버 목록 계산 */
  const membersWithPresence = useMemo((): MemberWithPresence[] => {
    return members
      .filter((member) => onlineAccountIds.has(member.id))
      .map((member) => ({
        ...member,
        isMe: member.id === myAccountId,
      }));
  }, [members, onlineAccountIds, myAccountId]);

  /** 손들기 기능 */
  const toggleHand = useCallback(() => {
    wsClientRef.current?.toggleHand();
  }, []);

  const isHandRaised = useCallback(
    (accountId: string): boolean => {
      return raisedHands.some((hand) => hand.accountId === accountId);
    },
    [raisedHands]
  );

  /** 채팅 메시지 전송 */
  const sendChatMessage = useCallback((chatId: number) => {
    if (wsClientRef.current?.isConnected()) {
      wsClientRef.current.sendChatMessage(chatId);
    }
  }, []);

  // PENDING 상태에서 COMPLETED로 전이
  // - 혼자일 경우: 즉시 COMPLETED
  // - 여러 명일 경우: 모든 peer와 실제 P2P 연결이 완료되면 COMPLETED
  useEffect(() => {
    if (voiceConnectionStatus !== 'PENDING') return;

    const isAlone = onlineAccountIds.size <= 1;
    const allPeersConnected = connectedPeerIds.size >= onlineAccountIds.size - 1;

    if (isAlone || allPeersConnected) {
      setVoiceConnectionStatus('COMPLETED');
    }
  }, [voiceConnectionStatus, onlineAccountIds.size, connectedPeerIds.size]);

  return {
    onlineAccountIds,
    isConnected,
    isDebateJoined,
    wsClient: wsClientRef.current,
    raisedHands,
    toggleHand,
    isHandRaised,
    sendVoiceMessage,
    sendChatMessage,
    membersWithPresence,
    /** Voice chat 관련 */
    voiceConnectionStatus,
    localStream,
    remoteStreams,
    joinVoiceChat,
    leaveVoiceChat,
  };
};

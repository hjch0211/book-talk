import {
  type Debate,
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
import { useEffect, useEffectEvent, useRef, useState } from 'react';

export interface OnlineMember extends MemberInfo {
  isMe: boolean;
}

export type VoiceConnectionStatus = 'NOT_STARTED' | 'PENDING' | 'COMPLETED' | 'FAILED';

interface Props {
  /** 토론 ID */
  debateId: string | null;
  /** 토론 정보 */
  debate: Debate;
  /** 라운드 시작 백드롭 열기 콜백 */
  onRoundStartBackdrop: (roundType: RoundType) => void;
}

/**
 * 토론 실시간 연결 관리
 * - WebSocket 연결/해제 및 메시지 송수신
 * - WebRTC P2P 음성 연결
 * - 상태 관리 (온라인 멤버, 손들기, 음성 연결)
 * - 비즈니스 로직 (Query 갱신, UI 이벤트)
 *
 * @internal useDebate 내부에서만 사용
 */
export const useDebateRealtimeConnection = (props: Props) => {
  const { debateId, debate, onRoundStartBackdrop } = props;
  const queryClient = useQueryClient();

  // WebSocket 상태
  const [onlineMembers, setOnlineMembers] = useState<OnlineMember[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isDebateJoined, setIsDebateJoined] = useState<boolean>(false);
  const [raisedHands, setRaisedHands] = useState<RaisedHandInfo[]>([]);
  const wsClientRef = useRef<DebateWebSocketClient | null>(null);

  // Voice 연결 상태
  const [voiceConnectionStatus, setVoiceConnectionStatus] =
    useState<VoiceConnectionStatus>('NOT_STARTED');
  const [connectedPeerIds, setConnectedPeerIds] = useState<Set<string>>(new Set());

  /** WebRTC P2P 음성 연결 */
  const webRTC = useWebRTC({
    myId: debate.myMemberInfo?.id ?? '',
    onError: (error: Error) => {
      setVoiceConnectionStatus('FAILED');
      console.error('Voice chat error:', error);
    },
    onReconnectNeeded: () => {
      if (!debate.myMemberInfo?.id || !debateId) return;
      setVoiceConnectionStatus('PENDING');
      setConnectedPeerIds(new Set());
      wsClientRef.current?.sendVoiceMessage({
        type: 'C_VOICE_JOIN',
        provider: 'CLIENT',
        accountId: debate.myMemberInfo.id,
      });
    },
    onIceCandidate: ({ myId: fromId, peerId, candidate }) => {
      if (!debateId) return;
      wsClientRef.current?.sendVoiceMessage({
        type: 'C_VOICE_ICE_CANDIDATE',
        provider: 'CLIENT',
        fromId,
        toId: peerId,
        candidate,
      });
    },
    onPeerConnected: (peerId: string) => {
      const newConnectedPeerIds = new Set([...connectedPeerIds, peerId]);
      setConnectedPeerIds(newConnectedPeerIds);

      if (voiceConnectionStatus === 'PENDING') {
        const allPeersConnected = newConnectedPeerIds.size >= onlineMembers.length - 1;
        if (allPeersConnected) {
          setVoiceConnectionStatus('COMPLETED');
        }
      }
    },
  });

  /** 음성 채팅 참여 */
  const joinVoiceChat = useEffectEvent(async () => {
    if (voiceConnectionStatus !== 'NOT_STARTED' || !debate.myMemberInfo?.id || !debateId) return;

    const stream = await webRTC.startLocalStream({ audio: true, video: false });
    if (!stream) {
      setVoiceConnectionStatus('FAILED');
      return;
    }

    setVoiceConnectionStatus('PENDING');

    wsClientRef.current?.sendVoiceMessage({
      type: 'C_VOICE_JOIN',
      provider: 'CLIENT',
      accountId: debate.myMemberInfo.id,
    });
  });

  /** 음성 시그널링 메시지 핸들러 */
  const handleVoiceSignaling = useEffectEvent(async (message: WebSocketMessage) => {
    const myAccountId = debate.myMemberInfo?.id;
    if (!myAccountId || !debateId) return;

    const isConnectable =
      voiceConnectionStatus === 'PENDING' || voiceConnectionStatus === 'COMPLETED';

    switch (message.type) {
      case 'S_VOICE_JOIN': {
        const fromId = message.fromId;
        if (fromId === myAccountId) return;

        if (voiceConnectionStatus === 'NOT_STARTED') {
          await joinVoiceChat();
        }

        const offer = await webRTC.createOffer(fromId);
        if (offer) {
          wsClientRef.current?.sendVoiceMessage({
            type: 'C_VOICE_OFFER',
            provider: 'CLIENT',
            fromId: myAccountId,
            toId: fromId,
            offer,
          });
        }
        break;
      }

      case 'S_VOICE_OFFER': {
        if (message.toId !== myAccountId || !isConnectable) return;

        const answer = await webRTC.handleOffer(message.fromId, message.offer);
        if (answer) {
          wsClientRef.current?.sendVoiceMessage({
            type: 'C_VOICE_ANSWER',
            provider: 'CLIENT',
            fromId: myAccountId,
            toId: message.fromId,
            answer,
          });
        }
        break;
      }

      case 'S_VOICE_ANSWER': {
        if (message.toId !== myAccountId) return;
        await webRTC.handleAnswer(message.fromId, message.answer);
        break;
      }

      case 'S_VOICE_ICE_CANDIDATE': {
        if (message.toId !== myAccountId) return;
        await webRTC.addIceCandidate(message.fromId, message.candidate);
        break;
      }
    }
  });

  /** 음성 채팅 퇴장 */
  const leaveVoiceChat = useEffectEvent(() => {
    if (voiceConnectionStatus !== 'COMPLETED') return;
    webRTC.disconnect();
    setVoiceConnectionStatus('NOT_STARTED');
  });

  /** 온라인 멤버 목록 업데이트 */
  const onOnlineMembersUpdate = useEffectEvent((onlineIds: Set<string>) => {
    console.log('Received online account IDs:', onlineIds);
    const members = debate.members
      .filter((member) => onlineIds.has(member.id))
      .map((member) => ({
        ...member,
        isMe: member.id === debate.myMemberInfo?.id,
      }));
    setOnlineMembers(members);

    if (voiceConnectionStatus === 'PENDING') {
      const isAlone = members.length <= 1;
      if (isAlone) {
        setVoiceConnectionStatus('COMPLETED');
      }
    }

    if (debateId) {
      void queryClient.invalidateQueries({
        queryKey: findOneDebateQueryOptions(debateId).queryKey,
      });
    }
  });

  /** 발언자 업데이트 */
  const onSpeakerUpdate = useEffectEvent((speakerInfo: WS_SpeakerUpdateResponse) => {
    console.log('Speaker updated via WebSocket:', speakerInfo);
    if (debateId) {
      void queryClient.invalidateQueries({
        queryKey: findOneDebateQueryOptions(debateId).queryKey,
      });
    }
  });

  /** 라운드 업데이트 */
  const onDebateRoundUpdate = useEffectEvent((roundInfo: WS_DebateRoundUpdateResponse) => {
    if (debateId) {
      void queryClient.invalidateQueries({
        queryKey: findOneDebateQueryOptions(debateId).queryKey,
      });
    }

    const roundType = roundInfo.round.type as RoundType;
    if (roundType === 'PRESENTATION' || roundType === 'FREE') {
      onRoundStartBackdrop(roundType);
    }
  });

  /** 채팅 메시지 수신 */
  const onChatMessage = useEffectEvent((chatId: number) => {
    console.log('Received chat message:', chatId);
    if (debateId) {
      void queryClient.invalidateQueries({
        queryKey: getChatsQueryOptions(debateId, debate.currentRoundInfo.type === 'FREE', true)
          .queryKey,
      });
    }
  });

  /** WebSocket 연결 및 관리 */
  useEffect(() => {
    if (!debateId) return;
    const wsClient = new DebateWebSocketClient();
    wsClientRef.current = wsClient;

    wsClient.connect(debateId, {
      onOnlineMembersUpdate,
      onConnectionStatus: (connected: boolean) => {
        console.log('Connection status changed:', connected);
        setIsConnected(connected);
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
      onSpeakerUpdate,
      onDebateRoundUpdate,
      onVoiceSignaling: handleVoiceSignaling,
      onChatMessage,
    });

    return () => {
      wsClientRef.current?.disconnect();
      wsClientRef.current = null;
    };
  }, [debateId]);

  /** WebSocket 하트비트 관리 (30초 간격) */
  useEffect(() => {
    if (!isConnected || !wsClientRef.current) return;

    const intervalId = window.setInterval(() => {
      console.log('Sending heartbeat...');
      wsClientRef.current?.sendHeartbeat();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [isConnected]);

  /** 손들기 토글 */
  const toggleHand = () => {
    wsClientRef.current?.toggleHand();
  };

  /** 손든 상태 확인 */
  const isHandRaised = (accountId: string): boolean => {
    return raisedHands.some((hand) => hand.accountId === accountId);
  };

  /** 채팅 메시지 전송 */
  const sendChatMessage = (chatId: number) => {
    if (wsClientRef.current?.isConnected()) {
      wsClientRef.current.sendChatMessage(chatId);
    }
  };

  return {
    /** 온라인 멤버 목록 */
    onlineMembers,
    /** WebSocket 연결 상태 */
    isConnected,
    /** 토론 참여 완료 여부 */
    isDebateJoined,
    /** 손들기 목록 */
    raisedHands,
    /** 손들기 토글 */
    toggleHand,
    /** 손든 상태 확인 */
    isHandRaised,
    /** 채팅 메시지 전송 */
    sendChatMessage,
    /** 음성 연결 상태 */
    voiceConnectionStatus,
    /** 로컬 스트림 */
    localStream: webRTC.localStream,
    /** 원격 스트림 목록 */
    remoteStreams: webRTC.remoteStreams,
    /** 음성 채팅 참여 */
    joinVoiceChat,
    /** 음성 채팅 퇴장 */
    leaveVoiceChat,
  };
};

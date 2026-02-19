import { findOneAiChatQueryOptions } from '@src/externals/aiChat';
import {
  type Debate,
  findOneDebateQueryOptions,
  getChatsQueryOptions,
  type MemberInfo,
  type RoundType,
} from '@src/externals/debate';
import {
  type DebateRoundUpdateResponse,
  DebateWebSocketClient,
  type RaisedHandInfo,
  type WebSocketMessage,
  WSRequestMessageType,
  WSResponseMessageType,
} from '@src/externals/websocket';
import { useModal, useWebRTC } from '@src/hooks';
import AiSummarizationModal from '@src/routes/Debate/_components/modal/AiSummarizationModal.tsx';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useEffectEvent, useRef, useState } from 'react';

export interface OnlineMember extends MemberInfo {
  isMe: boolean;
  isConnecting: boolean;
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
  const { openModal } = useModal();

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
      setOnlineMembers((prev) => prev.map((m) => ({ ...m, isConnecting: false })));
      wsClientRef.current?.sendVoiceMessage({
        type: WSRequestMessageType.C_VOICE_JOIN,
        payload: {
          accountId: debate.myMemberInfo.id,
        },
      });
    },
    onIceCandidate: ({ myId: fromId, peerId, candidate }) => {
      if (!debateId) return;
      wsClientRef.current?.sendVoiceMessage({
        type: WSRequestMessageType.C_VOICE_ICE_CANDIDATE,
        payload: {
          fromId,
          toId: peerId,
          candidate,
        },
      });
    },
    onPeerConnected: (peerId) => {
      setOnlineMembers((prev) =>
        prev.map((member) => (member.id === peerId ? { ...member, isConnecting: false } : member))
      );
      const newConnectedPeerIds = new Set([...connectedPeerIds, peerId]);
      setConnectedPeerIds(newConnectedPeerIds);

      if (voiceConnectionStatus === 'PENDING') {
        const allPeersConnected = newConnectedPeerIds.size >= onlineMembers.length - 1;
        if (allPeersConnected) {
          setVoiceConnectionStatus('COMPLETED');
        }
      }
    },
    onPeerConnecting: (peerId) => {
      setOnlineMembers((prev) =>
        prev.map((member) => (member.id === peerId ? { ...member, isConnecting: true } : member))
      );
    },
  });

  /** 음성 채팅 참여 */
  const joinVoiceChat = useEffectEvent(async () => {
    if (voiceConnectionStatus !== 'NOT_STARTED' || !debate.myMemberInfo?.id || !debateId) return;

    setVoiceConnectionStatus('PENDING');

    const stream = await webRTC.startLocalStream({ audio: true, video: false });
    if (!stream) {
      setVoiceConnectionStatus('FAILED');
      return;
    }

    wsClientRef.current?.sendVoiceMessage({
      type: WSRequestMessageType.C_VOICE_JOIN,
      payload: {
        accountId: debate.myMemberInfo.id,
      },
    });
  });

  /** 음성 시그널링 메시지 핸들러 */
  const handleVoiceSignaling = useEffectEvent(async (message: WebSocketMessage) => {
    const myAccountId = debate.myMemberInfo?.id;
    if (!myAccountId || !debateId) return;

    const isConnectable =
      voiceConnectionStatus === 'PENDING' || voiceConnectionStatus === 'COMPLETED';

    switch (message.type) {
      case WSResponseMessageType.S_VOICE_JOIN: {
        if (!message.payload) return;
        const fromId = message.payload.fromId;
        if (fromId === myAccountId) return;

        if (voiceConnectionStatus === 'NOT_STARTED') {
          await joinVoiceChat();
        }

        const offer = await webRTC.createOffer(fromId);
        if (offer) {
          wsClientRef.current?.sendVoiceMessage({
            type: WSRequestMessageType.C_VOICE_OFFER,
            payload: {
              fromId: myAccountId,
              toId: fromId,
              offer,
            },
          });
        }
        break;
      }

      case WSResponseMessageType.S_VOICE_OFFER: {
        if (!message.payload) return;
        if (message.payload.toId !== myAccountId || !isConnectable) return;

        const answer = await webRTC.handleOffer(message.payload.fromId, message.payload.offer);
        if (answer) {
          wsClientRef.current?.sendVoiceMessage({
            type: WSRequestMessageType.C_VOICE_ANSWER,
            payload: {
              fromId: myAccountId,
              toId: message.payload.fromId,
              answer,
            },
          });
        }
        break;
      }

      case WSResponseMessageType.S_VOICE_ANSWER: {
        if (!message.payload) return;
        if (message.payload.toId !== myAccountId) return;
        await webRTC.handleAnswer(message.payload.fromId, message.payload.answer);
        break;
      }

      case WSResponseMessageType.S_VOICE_ICE_CANDIDATE: {
        if (!message.payload) return;
        if (message.payload.toId !== myAccountId) return;
        await webRTC.addIceCandidate(message.payload.fromId, message.payload.candidate);
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
    const connectingIds = new Set(onlineMembers.filter((m) => m.isConnecting).map((m) => m.id));

    const members = debate.members
      .filter((member) => onlineIds.has(member.id))
      .map((member) => ({
        ...member,
        isMe: member.id === debate.myMemberInfo?.id,
        isConnecting: connectingIds.has(member.id),
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
  const onSpeakerUpdate = useEffectEvent(() => {
    if (debateId) {
      void queryClient.invalidateQueries({
        queryKey: findOneDebateQueryOptions(debateId).queryKey,
      });
    }
  });

  /** 라운드 업데이트 */
  const onDebateRoundUpdate = useEffectEvent((roundInfo: DebateRoundUpdateResponse) => {
    if (debateId) {
      void queryClient.invalidateQueries({
        queryKey: findOneDebateQueryOptions(debateId).queryKey,
      });
    }

    const roundType = roundInfo.payload.round.type as RoundType;
    if (roundType === 'PRESENTATION' || roundType === 'FREE') {
      onRoundStartBackdrop(roundType);
    }
  });

  /** AI 채팅 완성 */
  const onAiChatCompleted = useEffectEvent((chatId: string) => {
    void queryClient.invalidateQueries({
      queryKey: findOneAiChatQueryOptions(chatId).queryKey,
    });
  });

  /** AI 요약 완성 */
  const onAiSummaryCompleted = useEffectEvent(async () => {
    if (debateId) {
      await queryClient
        .fetchQuery({
          ...findOneDebateQueryOptions(debateId),
          staleTime: 0,
        })
        .then((debate) => {
          openModal(AiSummarizationModal, {
            bookTitle: `${debate.bookInfo.title} - ${debate.bookInfo.author}`,
            topic: debate.topic,
            bookImageUrl: debate.bookInfo.imageUrl,
            summarization: debate.aiSummarized ?? '',
          });
        });
    }
  });

  /** 채팅 메시지 수신 */
  const onChatMessage = useEffectEvent(() => {
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
        setIsConnected(connected);
        if (!connected) {
          setIsDebateJoined(false);
        }
      },
      onJoinSuccess: () => {
        setIsDebateJoined(true);
      },
      onHandRaiseUpdate: (hands: RaisedHandInfo[]) => {
        setRaisedHands(hands);
      },
      onSpeakerUpdate,
      onDebateRoundUpdate,
      onVoiceSignaling: handleVoiceSignaling,
      onChatMessage,
      onAiSummaryCompleted,
      onAiChatCompleted,
    });

    return () => {
      wsClientRef.current?.disconnect();
      wsClientRef.current = null;
    };
  }, [debateId]);

  /** WebSocket 하트비트 관리 (5초 간격) */
  useEffect(() => {
    if (!isConnected || !wsClientRef.current) return;

    const intervalId = window.setInterval(() => {
      wsClientRef.current?.sendHeartbeat();
    }, 5000);

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

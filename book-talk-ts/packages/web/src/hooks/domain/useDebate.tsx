import { meQueryOption } from '@src/apis/account';
import { findOneDebateQueryOptions, joinDebate, type RoundType } from '@src/apis/debate';
import { useDebateChat, useDebateRound, useDebateVoiceChat, useDebateWebSocket } from '@src/hooks';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  debateId?: string;
}

/**
 * 토론 참여 및 전체 관리
 * - 토론 기본 정보 제공
 * - 라운드/발언자 관리 (useDebateRound)
 * - WebSocket 연결 관리 (useDebateWebSocket)
 * - 자동 참여 처리
 * - UI 상태 관리 (백드롭)
 * - VoiceChat 관리
 */
export const useDebate = ({ debateId }: Props) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: _me } = useSuspenseQuery(meQueryOption);
  const { data: debate } = useSuspenseQuery(findOneDebateQueryOptions(debateId, _me?.id));
  const joinAttempted = useRef<Set<string>>(new Set());

  /** RoundStartBackdrop UI 상태 */
  const [showRoundStartBackdrop, setShowRoundStartBackdrop] = useState<{
    show: boolean;
    type: RoundType | null;
  }>({ show: false, type: null });

  const closeRoundStartBackdrop = useCallback(() => {
    setShowRoundStartBackdrop({ show: false, type: null });
  }, []);

  const handleRoundStartBackdrop = useCallback(
    (roundType: RoundType) => {
      setShowRoundStartBackdrop({ show: true, type: roundType });
      setTimeout(() => {
        closeRoundStartBackdrop();
      }, 5000);
    },
    [closeRoundStartBackdrop]
  );

  /** 토론 참여 */
  const joinDebateMutation = useMutation({
    mutationFn: (debateId: string) => joinDebate({ debateId }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: findOneDebateQueryOptions(debateId).queryKey,
      });
    },
    onError: () => {
      navigate('/debate-full');
    },
  });

  /** 멤버가 아니면 자동으로 가입 시도 (한 번만) */
  useEffect(() => {
    if (
      debateId &&
      _me?.id &&
      !debate.myMemberInfo &&
      !joinDebateMutation.isPending &&
      !joinAttempted.current.has(`${debateId}-${_me.id}`)
    ) {
      joinAttempted.current.add(`${debateId}-${_me.id}`);
      joinDebateMutation.mutate(debateId);
    }
  }, [
    debateId,
    _me?.id,
    debate.myMemberInfo,
    joinDebateMutation.isPending,
    joinDebateMutation.mutate,
  ]);

  const round = useDebateRound(debate, debateId, debate.currentRoundInfo);

  /** WebSocket 연결 및 WebRTC 음성 채팅 */
  const websocket = useDebateWebSocket(
    debateId || null,
    debate.members,
    debate.myMemberInfo?.id,
    debate.currentRoundInfo.type === 'FREE',
    {
      onRoundStartBackdrop: handleRoundStartBackdrop,
      onVoiceChatError: (err) => {
        console.error('Voice chat error:', err);
      },
    }
  );

  /** 음성 채팅 UI 상태 관리 (음소거, 오디오 활성화) */
  const voiceChatUI = useDebateVoiceChat({
    localStream: websocket.localStream,
  });

  /** 음성 채팅 통합 객체 */
  const voiceChat = useMemo(
    () => ({
      connectionStatus: websocket.voiceConnectionStatus,
      localStream: websocket.localStream,
      remoteStreams: websocket.remoteStreams,
      join: websocket.joinVoiceChat,
      leave: websocket.leaveVoiceChat,
      ...voiceChatUI,
    }),
    [websocket, voiceChatUI]
  );

  /** 토론 진행 중 입장 시 자동 voice chat 참여 */
  useEffect(() => {
    if (
      debate.currentRoundInfo.type !== 'PREPARATION' &&
      websocket.isDebateJoined &&
      websocket.voiceConnectionStatus === 'NOT_STARTED'
    ) {
      void websocket.joinVoiceChat();
    }
  }, [
    debate.currentRoundInfo.type,
    websocket.isDebateJoined,
    websocket.voiceConnectionStatus,
    websocket.joinVoiceChat,
  ]);

  /** 토론 시작 */
  const handleStartDebate = useCallback(async () => {
    if (!debateId) return;

    await round.startPresentationRound();

    const isAlone = websocket.onlineAccountIds.size <= 1;
    if (!isAlone) {
      void websocket.joinVoiceChat();
    }
  }, [
    debateId,
    websocket.onlineAccountIds.size,
    round.startPresentationRound,
    websocket.joinVoiceChat,
  ]);

  /** 채팅 기능 (FREE 라운드에서만 동작) */
  const chat = useDebateChat(
    debateId,
    websocket.sendChatMessage,
    debate.currentRoundInfo.type === 'FREE',
    !!debate.myMemberInfo
  );

  return {
    /** 토론 기본 정보 */
    debate,
    /** 내 멤버 정보 */
    myMemberInfo: debate.myMemberInfo,
    /** 현재 라운드 정보 */
    currentRoundInfo: debate.currentRoundInfo,
    /** 라운드 & 발언자 관리 */
    round,
    /** WebSocket 연결 및 실시간 통신 */
    websocket,
    /** 채팅 기능 (FREE 라운드 전용) */
    chat,
    /** 음성 채팅 기능 */
    voiceChat,
    /** 라운드 시작 백드롭 UI 상태 */
    showRoundStartBackdrop,
    /** 라운드 시작 백드롭 닫기 */
    closeRoundStartBackdrop,
    /** 토론 시작 */
    handleStartDebate,
  };
};

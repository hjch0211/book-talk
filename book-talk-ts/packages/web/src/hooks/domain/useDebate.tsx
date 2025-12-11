import { meQueryOption } from '@src/apis/account';
import { findOneDebateQueryOptions, joinDebate } from '@src/apis/debate';
import { useDebateChat, useDebateRound, useDebateVoiceChat, useDebateWebSocket } from '@src/hooks';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type RoundType = 'PREPARATION' | 'PRESENTATION' | 'FREE';

interface Props {
  debateId?: string;
}

export interface CurrentRoundInfo {
  id: number | null;
  type: 'PRESENTATION' | 'FREE' | 'PREPARATION';
  currentPresentationId?: string;
  currentSpeakerId?: string | null;
  createdAt: string | null;
  nextSpeakerId?: string | null | undefined;
  endedAt?: string | null | undefined;
  isEditable: boolean;
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
  const { data: debate } = useSuspenseQuery(findOneDebateQueryOptions(debateId));
  const { data: _me } = useSuspenseQuery(meQueryOption);
  const joinAttempted = useRef<Set<string>>(new Set());

  /** 토론 시작 대기 플래그 */
  const pendingStartDebateRef = useRef(false);

  const myMemberInfo = debate.members.find((m) => m.id === _me?.id);

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
      !myMemberInfo &&
      !joinDebateMutation.isPending &&
      !joinAttempted.current.has(`${debateId}-${_me.id}`)
    ) {
      joinAttempted.current.add(`${debateId}-${_me.id}`);
      joinDebateMutation.mutate(debateId);
    }
    // joinDebateMutation은 의도적으로 의존성에서 제외 (무한 리렌더링 방지)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debateId, _me?.id, myMemberInfo]);

  const myMemberData = {
    id: myMemberInfo?.id,
    role: myMemberInfo?.role,
  };

  /** 라운드 시작 전 상태를 포함한 라운드 정보 */
  const currentRoundInfo: CurrentRoundInfo = useMemo(() => {
    // 기존 라운드가 있으면 그대로 반환
    if (debate.currentRound) {
      const currentSpeakerPresentationId = debate.presentations.find(
        (p) => p.accountId === debate.currentRound?.currentSpeakerId
      )?.id;
      return {
        ...debate.currentRound,
        currentPresentationId: currentSpeakerPresentationId,
        isEditable: false,
      };
    }

    // 0라운드 (준비 단계)
    const myPresentation = debate.presentations.find((p) => p.accountId === _me?.id);
    return {
      id: null,
      type: 'PREPARATION' as const,
      currentPresentationId: myPresentation?.id,
      currentSpeakerId: null,
      createdAt: null,
      isEditable: true,
    };
  }, [debate.currentRound, debate.presentations, _me?.id]);

  const round = useDebateRound(debate, debateId, currentRoundInfo);

  /** WebSocket 연결 (먼저 생성 - voiceChat에서 사용) */
  const websocket = useDebateWebSocket(
    debateId || null,
    debate.members,
    myMemberData.id,
    currentRoundInfo.type === 'FREE',
    { onRoundStartBackdrop: handleRoundStartBackdrop }
  );

  /** Voice connection 완료 시 토론 시작 처리 */
  const handleVoiceConnectionCompleted = useCallback(() => {
    if (pendingStartDebateRef.current) {
      pendingStartDebateRef.current = false;
      void round.handlePresentationRound();
    }
  }, [round.handlePresentationRound]);

  /** 토론 시작 (혼자면 즉시, 여럿이면 voice connection 완료 후 handlePresentationRound 호출) */
  const handleStartDebate = useCallback(() => {
    if (!debateId) return;

    const isAlone = websocket.onlineAccountIds.size <= 1;
    if (isAlone) {
      void round.handlePresentationRound();
    } else {
      pendingStartDebateRef.current = true;
    }
  }, [debateId, websocket.onlineAccountIds.size, round.handlePresentationRound]);

  /**
   * 음성 채팅 기능
   * - PREPARATION 라운드가 아닐 것
   * - myId가 있을 것
   * - WebSocket 토론 참여 완료(S_JOIN_SUCCESS)되었을 것
   *
   * 중요: isDebateJoined 조건으로 Race Condition 방지
   * (C_VOICE_JOIN이 C_JOIN_DEBATE보다 먼저 도착하면 백엔드에서 거부됨)
   */
  const voiceChat = useDebateVoiceChat({
    myId: myMemberData.id ?? '',
    debateId: debateId ?? '',
    sendVoiceMessage: websocket.sendVoiceMessage,
    voiceMessage: websocket.lastVoiceMessage,
    onlineAccountIds: websocket.onlineAccountIds,
    enabled:
      (currentRoundInfo.type !== 'PREPARATION' || pendingStartDebateRef.current) &&
      !!myMemberData.id &&
      websocket.isDebateJoined,
    onConnectionCompleted: handleVoiceConnectionCompleted,
  });

  /** 채팅 기능 (FREE 라운드에서만 동작) */
  const chat = useDebateChat(
    debateId,
    websocket.sendChatMessage,
    currentRoundInfo.type === 'FREE',
    !!myMemberInfo
  );

  return {
    /** 토론 기본 정보 */
    debate,
    /** 내 멤버 정보 (id, role) */
    myMemberData,
    /** 현재 라운드 정보 */
    currentRoundInfo,
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
    /** 토론 시작 (voice connection 완료 후 실행) */
    handleStartDebate,
  };
};

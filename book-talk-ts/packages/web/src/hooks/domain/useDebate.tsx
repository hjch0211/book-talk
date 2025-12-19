import { meQueryOption } from '@src/apis/account';
import { findOneDebateQueryOptions, joinDebate } from '@src/apis/debate';
import {
  useDebateChat,
  useDebateRealtimeConnection,
  useDebateRound,
  useDebateVoiceChat,
} from '@src/hooks';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useEffect, useEffectEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebateRoundStartBackdrop } from './useDebateRoundStartBackdrop';

interface Props {
  debateId?: string;
}

/**
 * 토론 참여 및 전체 관리
 * - 토론 기본 정보 제공
 * - 라운드/발언자 관리 (useDebateRound)
 * - 실시간 연결 관리 (useDebateRealtimeConnection)
 * - 자동 참여 처리
 * - UI 상태 관리 (백드롭)
 */
export const useDebate = ({ debateId }: Props) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: _me } = useSuspenseQuery(meQueryOption);
  const { data: debate } = useSuspenseQuery(findOneDebateQueryOptions(debateId, _me?.id));

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

  const onAutoJoin = useEffectEvent((targetDebateId: string) => {
    joinDebateMutation.mutate(targetDebateId);
  });

  /** 멤버가 아니면 자동으로 가입 시도 (isIdle: mutation이 한 번도 호출되지 않은 상태) */
  useEffect(() => {
    if (debateId && _me?.id && !debate.myMemberInfo && joinDebateMutation.isIdle) {
      onAutoJoin(debateId);
    }
  }, [debateId, _me?.id, debate.myMemberInfo, joinDebateMutation.isIdle]);

  const round = useDebateRound({ debate, debateId, currentRoundInfo: debate.currentRoundInfo });

  /** 라운드 시작 백드롭 UI */
  const roundStartBackdrop = useDebateRoundStartBackdrop();

  /** 실시간 연결 (WebSocket + WebRTC) */
  const connection = useDebateRealtimeConnection({
    debateId: debateId || null,
    debate,
    onRoundStartBackdrop: roundStartBackdrop.open,
  });

  /** 음성 채팅 UI 상태 관리 (음소거, 오디오 활성화) */
  const voiceChatUI = useDebateVoiceChat({ localStream: connection.localStream });

  /** 토론 진행 중 입장 시 자동 voice chat 참여 */
  const onAutoJoinVoiceChat = useEffectEvent(() => {
    void connection.joinVoiceChat();
  });

  useEffect(() => {
    if (
      debate.currentRoundInfo.type !== 'PREPARATION' &&
      connection.isDebateJoined &&
      connection.voiceConnectionStatus === 'NOT_STARTED'
    ) {
      onAutoJoinVoiceChat();
    }
  }, [debate.currentRoundInfo.type, connection.isDebateJoined, connection.voiceConnectionStatus]);

  /** 토론 시작 */
  const handleStartDebate = useEffectEvent(async () => {
    if (!debateId) return;

    await round.startPresentationRound();

    const isAlone = connection.onlineMembers.length <= 1;
    if (!isAlone) {
      void connection.joinVoiceChat();
    }
  });

  /** 채팅 기능 (FREE 라운드에서만 동작) */
  const chat = useDebateChat({
    debateId,
    sendChatMessage: connection.sendChatMessage,
    isFreeRound: debate.currentRoundInfo.type === 'FREE',
    hasMyMemberInfo: !!debate.myMemberInfo,
  });

  return {
    /** 토론 기본 정보 */
    debate,
    /** 내 멤버 정보 */
    myMemberInfo: debate.myMemberInfo,
    /** 현재 라운드 정보 */
    currentRoundInfo: debate.currentRoundInfo,
    /** 라운드 & 발언자 관리 */
    round,
    /** 실시간 연결 (WebSocket + WebRTC) */
    connection,
    /** 채팅 기능 (FREE 라운드 전용) */
    chat,
    /** 음성 채팅 UI */
    voiceChatUI,
    /** 라운드 시작 백드롭 UI */
    roundStartBackdrop,
    /** 토론 시작 */
    handleStartDebate,
  };
};

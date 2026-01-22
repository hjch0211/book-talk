import { meQueryOption } from '@src/externals/account';
import { signIn, signUp } from '@src/externals/auth';
import { type ApiError, saveTokens } from '@src/externals/client.ts';
import { findOneDebateQueryOptions, joinDebate, updateDebate } from '@src/externals/debate';
import { createSurvey } from '@src/externals/survey';
import {
  useDebateChat,
  useDebateRealtimeConnection,
  useDebateRound,
  useDebateVoiceChat,
  useModal,
  useToast,
} from '@src/hooks';
import SurveyModal from '@src/routes/Debate/_components/modal/SurveyModal';
import NicknameModal from '@src/routes/Main/_components/NickNameModal/NicknameModal.tsx';
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
  const { openModal, closeModal } = useModal();
  const { toast } = useToast();

  /** 로그인 */
  const signInMutation = useMutation({
    mutationFn: (name: string) => signIn({ name }),
    onSuccess: async (data: { accessToken: string; refreshToken: string }) => {
      saveTokens(data.accessToken, data.refreshToken);
      await queryClient.invalidateQueries();
    },
    onError: (error: ApiError, name) => {
      if (error?.status === 400 && error?.message === '존재하지 않는 계정입니다.') {
        signUpMutation.mutate(name);
        return;
      }
      toast.error('로그인 중 오류가 발생했습니다.');
    },
  });

  /** 회원가입 */
  const signUpMutation = useMutation({
    mutationFn: (name: string) => signUp({ name }),
    onSuccess: async (data: { accessToken: string; refreshToken: string }) => {
      saveTokens(data.accessToken, data.refreshToken);
      await queryClient.invalidateQueries();
    },
    onError: () => {
      toast.error('회원가입 중 오류가 발생했습니다.');
    },
  });

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

  /** 토론 상태 수정 */
  const updateDebateMutation = useMutation({
    mutationFn: updateDebate,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: findOneDebateQueryOptions(debateId).queryKey,
      });
    },
  });

  /** 설문조사 생성 */
  const createSurveyMutation = useMutation({
    mutationFn: createSurvey,
    onSuccess: () => {
      closeModal();
      navigateToExpiredPage();
    },
  });

  const onAutoJoin = useEffectEvent((targetDebateId: string) => {
    joinDebateMutation.mutate(targetDebateId);
  });

  const navigateToExpiredPage = useEffectEvent(() => {
    navigate('/debate-expired');
  });

  /** 설문조사 모달 열기 */
  const handleOpenSurveyModal = useEffectEvent(() => {
    openModal(SurveyModal, {
      onConfirm: (rate: number) => {
        createSurveyMutation.mutate({ rate });
      },
      isLoading: createSurveyMutation.isPending,
    });
  });

  const openNickNameModal = useEffectEvent(() => {
    openModal(NicknameModal, {
      onSubmit: (nickname: string) => {
        signInMutation.mutate(nickname);
      },
      isLoading: signInMutation.isPending || signUpMutation.isPending,
    });
  });

  useEffect(() => {
    /** 로그인이 필요한 경우 */
    if (!_me?.id) {
      openNickNameModal();
      return;
    }

    const closedTime = debate.closedAt ? new Date(debate.closedAt).getTime() : null;
    const now = Date.now();
    const diffInSeconds = closedTime ? (now - closedTime) / 1000 : Infinity;

    /** 토론이 끝난 지 10초 미만이면 설문조사 모달 띄우기 */
    if (debate.closedAt && diffInSeconds < 10) {
      handleOpenSurveyModal();
      return;
    } else if (debate.closedAt) {
      /** expired 토론방의 경우 (10초 이상 지난 경우) */
      navigateToExpiredPage();
      return;
    }

    /** 멤버가 아니면 자동으로 가입 시도 */
    if (debateId && _me?.id && !debate.myMemberInfo && joinDebateMutation.isIdle) {
      onAutoJoin(debateId);
    }
  }, [debateId, _me?.id, debate.myMemberInfo, joinDebateMutation.isIdle, debate.closedAt]);

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
  });

  /** 토론 종료 */
  const handleEndDebate = useEffectEvent(async () => {
    if (!debateId) return;
    await updateDebateMutation.mutateAsync({
      debateId,
      roundType: debate.currentRoundInfo.type,
      ended: true,
    });
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
    /** 토론 종료 */
    handleEndDebate,
  };
};

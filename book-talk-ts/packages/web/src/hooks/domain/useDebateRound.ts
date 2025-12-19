import {
  type CurrentRoundInfo,
  createRoundSpeaker,
  type FindOneDebateResponse,
  findOneDebateQueryOptions,
  patchRoundSpeaker,
  updateDebate,
} from '@src/apis/debate';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';

/** 현재 발언자 정보 */
export interface CurrentSpeaker {
  /** 계정 ID */
  accountId: string;
  /** 계정 이름 */
  accountName: string;
  /** 발언 종료 시각 (timestamp) */
  endedAt?: number;
}

/** 다음 발언자 정보 */
export interface NextSpeaker {
  /** 계정 ID */
  accountId: string;
  /** 계정 이름 */
  accountName: string;
}

interface Props {
  /** 토론 정보 */
  debate: FindOneDebateResponse;
  /** 토론 ID */
  debateId?: string;
  /** 현재 라운드 정보 */
  currentRoundInfo?: CurrentRoundInfo;
}

/**
 * 토론 라운드 & 발언자 관리
 * - 현재/다음 발언자 계산
 * - 남은 시간 계산
 * - 라운드 관련 Mutation
 *
 * @internal useDebate 내부에서만 사용
 */
export const useDebateRound = (props: Props) => {
  const { debate, debateId, currentRoundInfo } = props;
  const queryClient = useQueryClient();
  const [currentTime, setCurrentTime] = useState(new Date());

  /** 1초마다 현재 시간 업데이트 (타이머 표시용) */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /** 토론 라운드 전환 */
  const updateDebateMutation = useMutation({
    mutationFn: updateDebate,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: findOneDebateQueryOptions(debateId).queryKey,
      });
    },
  });

  /** 발언자 생성 (FREE 라운드에서 발언권 전환) */
  const createRoundSpeakerMutation = useMutation({
    mutationFn: createRoundSpeaker,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: findOneDebateQueryOptions(debateId).queryKey,
      });
    },
  });

  /** 발언자 업데이트 (발언 시간 연장/종료) */
  const patchRoundSpeakerMutation = useMutation({
    mutationFn: patchRoundSpeaker,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: findOneDebateQueryOptions(debateId).queryKey,
      });
    },
  });

  /** 현재 발표자 계산 (서버 데이터에서 직접 계산) */
  const currentSpeaker = useMemo((): CurrentSpeaker | null => {
    const currentRound = debate.currentRound;
    if (!currentRound || !currentRound.currentSpeakerAccountId) return null;

    const speaker = debate.members.find((m) => m.id === currentRound.currentSpeakerAccountId);
    if (!speaker) return null;

    return {
      accountId: speaker.id,
      accountName: speaker.name,
      endedAt: currentRound.currentSpeakerEndedAt
        ? new Date(currentRound.currentSpeakerEndedAt).getTime()
        : undefined,
    };
  }, [debate.currentRound, debate.members]);

  /** 다음 발표자 계산 (서버 데이터에서 직접 계산) */
  const nextSpeaker = useMemo((): NextSpeaker | null => {
    const currentRound = debate.currentRound;
    if (!currentRound || !currentRound.nextSpeakerAccountId) return null;

    const speaker = debate.members.find((m) => m.id === currentRound.nextSpeakerAccountId);
    if (!speaker) return null;

    return {
      accountId: speaker.id,
      accountName: speaker.name,
    };
  }, [debate.currentRound, debate.members]);

  /** 현재 발표자의 실시간 남은 시간 계산 */
  const realTimeRemainingSeconds = useMemo(() => {
    if (!currentSpeaker?.endedAt) return 0;

    return Math.max(0, Math.floor((currentSpeaker.endedAt - currentTime.getTime()) / 1000));
  }, [currentSpeaker?.endedAt, currentTime]);

  /** PRESENTATION 라운드 시작 (PREPARATION → PRESENTATION) */
  const startPresentationRound = useCallback(async () => {
    if (!debateId || currentRoundInfo?.id) return;

    await updateDebateMutation.mutateAsync({
      debateId,
      roundType: 'PRESENTATION',
    });
  }, [debateId, currentRoundInfo?.id, updateDebateMutation]);

  /** PRESENTATION 라운드에서 발언 조기 종료 */
  const endPresentation = useCallback(async () => {
    const currentSpeakerId = debate.currentRound?.currentSpeakerId;
    if (currentRoundInfo?.type !== 'PRESENTATION' || !currentSpeakerId) return;

    await patchRoundSpeakerMutation.mutateAsync({
      debateRoundSpeakerId: currentSpeakerId,
      ended: true,
    });
  }, [debate.currentRound?.currentSpeakerId, currentRoundInfo?.type, patchRoundSpeakerMutation]);

  /** 발언권 전달 (FREE 라운드) */
  const passSpeaker = useCallback(
    async (memberId: string) => {
      if (!currentRoundInfo?.id) return;

      await createRoundSpeakerMutation.mutateAsync({
        debateRoundId: currentRoundInfo.id,
        nextSpeakerId: memberId,
      });
    },
    [currentRoundInfo?.id, createRoundSpeakerMutation]
  );

  return {
    /** 현재 발언자 */
    currentSpeaker,
    /** 다음 발언자 */
    nextSpeaker,
    /** 실시간 남은 발언 시간 (초) */
    realTimeRemainingSeconds,
    /** 토론 업데이트 중 여부 */
    isUpdating: updateDebateMutation.isPending,
    /** PRESENTATION 라운드 시작 */
    startPresentationRound,
    /** 발언 조기 종료 */
    endPresentation,
    /** 발언권 전달 (FREE 라운드) */
    passSpeaker,
  };
};

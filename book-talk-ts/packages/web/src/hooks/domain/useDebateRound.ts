import {
  type CreateRoundSpeakerRequest,
  createRoundSpeaker,
  type FindOneDebateResponse,
  findOneDebateQueryOptions,
  type PatchRoundSpeakerRequest,
  patchRoundSpeaker,
  type UpdateDebateRequest,
  updateDebate,
} from '@src/apis/debate';
import { type UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';

type RoundType = 'PREPARATION' | 'PRESENTATION' | 'FREE';

interface CurrentRoundInfo {
  id: number | null;
  type: RoundType;
  nextSpeakerAccountId?: string | null;
}

export interface CurrentSpeaker {
  accountId: string;
  accountName: string;
  endedAt?: number;
}

export interface NextSpeaker {
  accountId: string;
  accountName: string;
}

export interface UseDebateRoundReturn {
  currentSpeaker: CurrentSpeaker | null;
  nextSpeaker: NextSpeaker | null;
  realTimeRemainingSeconds: number;
  updateDebateMutation: UseMutationResult<void, Error, UpdateDebateRequest>;
  createRoundSpeakerMutation: UseMutationResult<void, Error, CreateRoundSpeakerRequest>;
  patchRoundSpeakerMutation: UseMutationResult<void, Error, PatchRoundSpeakerRequest>;
  startPresentationRound: () => Promise<void>;
}

/**
 * 토론 라운드 & 발언자 관리
 * - 현재/다음 발언자 계산
 * - 남은 시간 계산
 * - 라운드 관련 Mutation
 *
 * @internal useDebate 내부에서만 사용
 */
export const useDebateRound = (
  debate: FindOneDebateResponse,
  debateId?: string,
  currentRoundInfo?: CurrentRoundInfo
): UseDebateRoundReturn => {
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

  return {
    currentSpeaker,
    nextSpeaker,
    realTimeRemainingSeconds,
    updateDebateMutation,
    createRoundSpeakerMutation,
    patchRoundSpeakerMutation,
    startPresentationRound,
  };
};

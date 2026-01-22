import {
  type CurrentRoundInfo,
  createRoundSpeaker,
  type Debate,
  findOneDebateQueryOptions,
  patchRoundSpeaker,
  updateDebate,
} from '@src/externals/debate';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useEffectEvent, useMemo, useState } from 'react';

interface Props {
  /** 토론 정보 */
  debate: Debate;
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

  /** 현재 발표자의 실시간 남은 시간 계산 */
  const realTimeRemainingSeconds = useMemo(() => {
    if (!debate.currentRoundInfo.currentSpeaker?.endedAt) return 0;
    return Math.max(
      0,
      Math.floor(
        (debate.currentRoundInfo.currentSpeaker?.endedAt.getTime() - currentTime.getTime()) / 1000
      )
    );
  }, [debate.currentRoundInfo.currentSpeaker?.endedAt, currentTime]);

  /** PRESENTATION 라운드 시작 (PREPARATION → PRESENTATION) */
  const startPresentationRound = useEffectEvent(async () => {
    if (!debateId || currentRoundInfo?.id) return;

    await updateDebateMutation.mutateAsync({
      debateId,
      roundType: 'PRESENTATION',
      ended: false,
    });
  });

  /** PRESENTATION 라운드에서 발언 조기 종료 */
  const endPresentation = useEffectEvent(async () => {
    const currentSpeakerId = debate.currentRound?.currentSpeakerId;
    if (currentRoundInfo?.type !== 'PRESENTATION' || !currentSpeakerId) return;

    await patchRoundSpeakerMutation.mutateAsync({
      debateRoundSpeakerId: currentSpeakerId,
      ended: true,
    });
  });

  /** 발언권 전달 (FREE 라운드) */
  const passSpeaker = useEffectEvent(async (memberId: string) => {
    if (!currentRoundInfo?.id) return;

    await createRoundSpeakerMutation.mutateAsync({
      debateRoundId: currentRoundInfo.id,
      nextSpeakerId: memberId,
    });
  });

  return {
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

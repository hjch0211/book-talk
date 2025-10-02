import {useCallback, useEffect, useMemo, useState} from 'react';
import {useMutation, type UseMutationResult, useQueryClient} from "@tanstack/react-query";
import {
    createRound,
    type CreateRoundRequest,
    type CreateRoundResponse,
    createRoundSpeaker,
    type CreateRoundSpeakerRequest,
    findOneDebateQueryOptions,
    type FindOneDebateResponse,
    patchRound,
    patchRoundSpeaker,
    type PatchRoundSpeakerRequest
} from "../apis/debate";

type RoundType = 'PREPARATION' | 'PRESENTATION' | 'FREE';

interface CurrentRoundInfo {
    id: number | null;
    type: RoundType;
    nextSpeakerId?: string | null;
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
    createRoundMutation: UseMutationResult<CreateRoundResponse, Error, CreateRoundRequest>;
    createRoundSpeakerMutation: UseMutationResult<void, Error, CreateRoundSpeakerRequest>;
    patchRoundSpeakerMutation: UseMutationResult<void, Error, PatchRoundSpeakerRequest>;
    handlePresentationRound: () => Promise<void>;
}

/**
 * 토론 라운드 & 발언자 관리
 * - 현재/다음 발언자 계산
 * - 남은 시간 계산
 * - 라운드 관련 Mutation
 * - 다음 발언자 생성 로직
 *
 * @internal useDebate 내부에서만 사용
 */
export const useDebateRound = (
    debate: FindOneDebateResponse,
    debateId?: string,
    currentRoundInfo?: CurrentRoundInfo,
    myAccountId?: string
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

    const createRoundMutation = useMutation({
        mutationFn: (request: CreateRoundRequest) => createRound(request),
        onSuccess: () => {
            void queryClient.invalidateQueries({queryKey: findOneDebateQueryOptions(debateId).queryKey});
        }
    });

    const patchRoundMutation = useMutation({
        mutationFn: patchRound,
        onSuccess: () => {
            void queryClient.invalidateQueries({queryKey: findOneDebateQueryOptions(debateId).queryKey});
        }
    })

    const patchRoundSpeakerMutation = useMutation({
        mutationFn: patchRoundSpeaker,
        onSuccess: () => {
            void queryClient.invalidateQueries({queryKey: findOneDebateQueryOptions(debateId).queryKey});
        }
    });

    const createRoundSpeakerMutation = useMutation({
        mutationFn: createRoundSpeaker,
        onSuccess: () => {
            void queryClient.invalidateQueries({queryKey: findOneDebateQueryOptions(debateId).queryKey});
        }
    });

    /** 현재 발표자 계산 (서버 데이터에서 직접 계산) */
    const currentSpeaker = useMemo((): CurrentSpeaker | null => {
        const currentRound = debate.currentRound;
        if (!currentRound || !currentRound.currentSpeakerId) return null;

        const speaker = debate.members.find(m => m.id === currentRound.currentSpeakerId);
        if (!speaker) return null;

        return {
            accountId: speaker.id,
            accountName: speaker.name,
            endedAt: currentRound.currentSpeakerEndedAt ? new Date(currentRound.currentSpeakerEndedAt).getTime() : undefined
        };
    }, [debate.currentRound, debate.members]);

    /** 다음 발표자 계산 (서버 데이터에서 직접 계산) */
    const nextSpeaker = useMemo((): NextSpeaker | null => {
        const currentRound = debate.currentRound;
        if (!currentRound || !currentRound.nextSpeakerId) return null;

        const speaker = debate.members.find(m => m.id === currentRound.nextSpeakerId);
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

    /** PRESENTATION 라운드: 순차적 발표자 진행 */
    const handlePresentationRound = useCallback(async () => {
        if (!debateId) return;

        // PREPARATION 상태 (라운드가 아직 없음) - 라운드 생성 및 첫 발언자 지정
        if (!currentRoundInfo?.id) {
            // 1. PRESENTATION 라운드 생성
            const roundResponse = await createRoundMutation.mutateAsync({debateId, type: "PRESENTATION"});

            if (roundResponse?.id && debate.members.length > 0) {
                // 2. 첫 번째 발언자 생성
                const firstSpeakerId = debate.members[0].id;
                await createRoundSpeakerMutation.mutateAsync({
                    debateRoundId: roundResponse.id,
                    nextSpeakerId: firstSpeakerId
                });

                // 3. 두 번째 발언자 예약
                if (debate.members.length > 1) {
                    const secondSpeakerId = debate.members[1].id;
                    await patchRoundMutation.mutateAsync({
                        debateRoundId: roundResponse.id,
                        nextSpeakerId: secondSpeakerId
                    });
                } else {
                    // 멤버가 1명만 있는 경우 nextSpeakerId를 null로 설정
                    await patchRoundMutation.mutateAsync({
                        debateRoundId: roundResponse.id,
                        nextSpeakerId: null
                    });
                }
            }

            await queryClient.invalidateQueries({queryKey: findOneDebateQueryOptions(debateId).queryKey});
            return;
        }

        // 현재 발언자가 있는 경우 - 다음 발언자로 진행
        if (!currentSpeaker) return;

        const currentIndex = debate.members.findIndex(m => m.id === currentSpeaker.accountId);

        if (currentIndex !== -1 && currentIndex < debate.members.length - 1) {
            // 다음 발표자로 넘기기
            const nextSpeakerId = debate.members[currentIndex + 1].id;
            await createRoundSpeakerMutation.mutateAsync({
                debateRoundId: currentRoundInfo.id,
                nextSpeakerId
            });

            // 다음 예정 발표자 지정
            if (debate.currentRound?.id) {
                if (currentIndex < debate.members.length - 2) {
                    const nextWaitingSpeakerId = debate.members[currentIndex + 2].id;
                    await patchRoundMutation.mutateAsync({
                        debateRoundId: debate.currentRound.id,
                        nextSpeakerId: nextWaitingSpeakerId
                    });
                } else {
                    // 다음 다음 발언자가 없는 경우 null로 설정
                    await patchRoundMutation.mutateAsync({
                        debateRoundId: debate.currentRound.id,
                        nextSpeakerId: null
                    });
                }
            }
        } else {
            // PRESENTATION 라운드 끝 -> FREE 라운드 생성
            await createRoundMutation.mutateAsync({debateId, type: "FREE"});
        }
    }, [debateId, currentSpeaker, currentRoundInfo?.id, debate.members, debate.currentRound?.id, createRoundSpeakerMutation, patchRoundMutation, createRoundMutation, queryClient]);

    /** 발표 시간 만료시 자동 다음 발표자 처리 */
    useEffect(() => {
        if (!debateId || !currentSpeaker || !currentRoundInfo?.id) return;

        // PRESENTATION 라운드만 자동 진행
        const shouldAutoProgress = currentRoundInfo.type === 'PRESENTATION' &&
            realTimeRemainingSeconds === 0 &&
            currentSpeaker.accountId === myAccountId;

        if (shouldAutoProgress) {
            console.log('Speaker time expired, auto-creating next speaker');

            (async () => {
                try {
                    await handlePresentationRound();
                    console.log('Successfully processed next speaker');
                } catch (error) {
                    console.error('Failed to create next speaker:', error);
                } finally {
                    void queryClient.invalidateQueries({queryKey: findOneDebateQueryOptions().queryKey});
                }
            })();
        }
    }, [
        realTimeRemainingSeconds,
        currentSpeaker,
        myAccountId,
        handlePresentationRound,
        debateId,
        currentRoundInfo,
        queryClient
    ]);

    return {
        currentSpeaker,
        nextSpeaker,
        realTimeRemainingSeconds,
        createRoundMutation,
        createRoundSpeakerMutation,
        patchRoundSpeakerMutation,
        handlePresentationRound
    };
};
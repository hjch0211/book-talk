import {useCallback, useEffect, useMemo, useState} from 'react';
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {
    createRound,
    createRoundSpeaker,
    findOneDebateQueryOptions,
    type FindOneDebateResponse,
    patchRound,
    patchRoundSpeaker
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createRoundMutation: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createRoundSpeakerMutation: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    patchRoundSpeakerMutation: any;
    createNextSpeaker: () => Promise<void>;
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
        mutationFn: ({debateId, nextSpeakerId}: { debateId: string; nextSpeakerId: string }) =>
            createRound({debateId, type: 'PRESENTATION', nextSpeakerId}),
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

    /** 라운드 타입별 다음 발표자 생성 로직 */
    const roundHandlers = useMemo(() => ({
        PRESENTATION: {
            async createNextSpeaker() {
                if (!debateId || !currentSpeaker || !currentRoundInfo?.id) return;

                const currentIndex = debate.members.findIndex(m => m.id === currentSpeaker.accountId);

                if (currentIndex !== -1 && currentIndex < debate.members.length - 1) {
                    // 다음 발표자로 넘기기
                    const nextSpeakerId = debate.members[currentIndex + 1].id;
                    await createRoundSpeakerMutation.mutateAsync({
                        debateRoundId: currentRoundInfo.id,
                        nextSpeakerId
                    });
                } else {
                    // PRESENTATION 라운드 끝 -> FREE 라운드 생성
                    const hostId = debate.members.find(m => m.role === "HOST")?.id || "";
                    await createRoundMutation.mutateAsync({debateId, nextSpeakerId: hostId});
                }
            },
            shouldAutoProgress: true
        },
        FREE: {
            async createNextSpeaker() {
                if (!debateId || !currentRoundInfo?.id || !currentRoundInfo.nextSpeakerId) return;

                await createRoundSpeakerMutation.mutateAsync({
                    debateRoundId: currentRoundInfo.id,
                    nextSpeakerId: currentRoundInfo.nextSpeakerId
                });
            },
            shouldAutoProgress: false
        },
        PREPARATION: {
            async createNextSpeaker() {
                // PREPARATION에서는 다음 발표자 생성 불가
            },
            shouldAutoProgress: false
        }
    }), [debateId, currentSpeaker, currentRoundInfo, debate.members, createRoundSpeakerMutation, createRoundMutation]);

    /** 다음 발언자 생성 */
    const createNextSpeaker = useCallback(async () => {
        if (!currentRoundInfo) return;

        const handler = roundHandlers[currentRoundInfo.type as RoundType];
        if (!handler) return;

        try {
            await handler.createNextSpeaker();
            console.log('Successfully processed next speaker');
        } catch (error) {
            console.error('Failed to create next speaker:', error);
        } finally {
            void queryClient.invalidateQueries({queryKey: findOneDebateQueryOptions().queryKey});
        }
    }, [roundHandlers, currentRoundInfo, queryClient]);

    /** 발표 시간 만료시 자동 다음 발표자 처리 */
    useEffect(() => {
        if (!debateId || !currentSpeaker || !currentRoundInfo?.id) return;

        const handler = roundHandlers[currentRoundInfo.type as RoundType];
        const shouldAutoProgress = handler?.shouldAutoProgress && realTimeRemainingSeconds === 0 && currentSpeaker.accountId === myAccountId;

        if (shouldAutoProgress) {
            console.log('Speaker time expired, auto-creating next speaker');
            void createNextSpeaker();
        }
    }, [
        realTimeRemainingSeconds,
        currentSpeaker,
        myAccountId,
        createNextSpeaker,
        debateId,
        currentRoundInfo,
        roundHandlers
    ]);

    return {
        currentSpeaker,
        nextSpeaker,
        realTimeRemainingSeconds,
        createRoundMutation,
        createRoundSpeakerMutation,
        patchRoundSpeakerMutation,
        createNextSpeaker
    };
};
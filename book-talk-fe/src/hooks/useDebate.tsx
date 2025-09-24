import {useMutation, useQueryClient, useSuspenseQuery} from "@tanstack/react-query";
import {findOneDebateQueryOptions, joinDebate} from "../apis/debate";
import {meQueryOption} from "../apis/account";
import {useEffect, useMemo, useRef} from "react";

interface Props {
    debateId?: string;
}

export interface CurrentRoundInfo {
    id: number | null;
    type: "PRESENTATION" | "FREE" | "PREPARATION";
    currentPresentationId?: string;
    currentSpeakerId: string | null;
    createdAt: string | null;
    nextSpeakerId?: string | null | undefined;
    endedAt?: string | null | undefined;
    isEditable: boolean;
}

export const useDebate = ({debateId}: Props) => {
    const queryClient = useQueryClient();
    const {data: debate} = useSuspenseQuery(findOneDebateQueryOptions(debateId));
    const {data: _me} = useSuspenseQuery(meQueryOption);
    const joinAttempted = useRef<Set<string>>(new Set());

    const myMember = debate.members.find((m) => m.id === _me?.id);
    const isAlreadyMember = !!myMember;

    const joinDebateMutation = useMutation({
        mutationFn: (debateId: string) => joinDebate({debateId}),
        onSuccess: () => {
            void queryClient.invalidateQueries({queryKey: ['debates', debateId]});
        }
    });

    // 멤버가 아니면 자동으로 가입 시도 (한 번만)
    useEffect(() => {
        if (
            debateId &&
            _me?.id &&
            !isAlreadyMember &&
            !joinDebateMutation.isPending &&
            !joinAttempted.current.has(`${debateId}-${_me.id}`)
        ) {
            joinAttempted.current.add(`${debateId}-${_me.id}`);
            joinDebateMutation.mutate(debateId);
        }
        // joinDebateMutation은 의도적으로 의존성에서 제외 (무한 리렌더링 방지)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debateId, _me?.id, isAlreadyMember]);

    const myMemberData = {
        role: myMember?.role
    }

    /** 라운드 시작 전 상태를 포함한 라운드 정보 */
    const currentRoundInfo: CurrentRoundInfo = useMemo(() => {
        // 기존 라운드가 있으면 그대로 반환
        if (debate.currentRound) {
            const currentSpeakerPresentationId = debate.presentations.find(p =>
                p.accountId === debate.currentRound?.currentSpeakerId
            )?.id;
            return {
                ...debate.currentRound,
                currentPresentationId: currentSpeakerPresentationId,
                isEditable: false,
            };
        }

        // 0라운드 (준비 단계)
        const myPresentation = debate.presentations.find(p => p.accountId === _me?.id);
        return {
            id: null,
            type: 'PREPARATION' as const,
            currentPresentationId: myPresentation?.id,
            currentSpeakerId: null,
            createdAt: null,
            isEditable: true,
        };
    }, [debate.currentRound, debate.presentations, _me?.id]);

    return {
        debate,
        myMemberData,
        currentRoundInfo
    }
}
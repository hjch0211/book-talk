import {useSuspenseQuery} from "@tanstack/react-query";
import {findOneDebateQueryOptions} from "../apis/debate";
import {meQueryOption} from "../apis/account";
import {useMemo} from "react";

interface Props {
    debateId?: string;
}

export interface CurrentRoundInfo {
    id: number | null;
    type: "PRESENTATION" | "FREE" | "PREPARATION";
    currentPresentationId: string | null;
    currentSpeakerId: string | null;
    createdAt: string | null;
    nextSpeakerId?: string | null | undefined;
    endedAt?: string | null | undefined;
    isEditable: boolean;
}

export const useDebate = ({debateId}: Props) => {
    const {data: debate} = useSuspenseQuery(findOneDebateQueryOptions(debateId));
    const {data: _me} = useSuspenseQuery(meQueryOption);

    const myMemberData = {
        role: debate.members.find((m) => m.id === _me?.id)?.role
    }

    /** 라운드 시작 전 상태를 포함한 라운드 정보 */
    const currentRoundInfo: CurrentRoundInfo = useMemo(() => {
        // 기존 라운드가 있으면 그대로 반환
        if (debate.currentRound) {
            const currentSpeakerPresentationId = debate.presentations.find(p =>
                p.accountId === debate.currentRound?.currentSpeakerId
            )?.id || null;
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
            currentPresentationId: myPresentation?.id || null,
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
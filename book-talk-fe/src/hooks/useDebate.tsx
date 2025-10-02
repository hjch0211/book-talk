import {useMutation, useQueryClient, useSuspenseQuery} from "@tanstack/react-query";
import {findOneDebateQueryOptions, type FindOneDebateResponse, joinDebate} from "../apis/debate";
import {meQueryOption} from "../apis/account";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useDebateRound, type UseDebateRoundReturn} from "./useDebateRound";
import {useDebateWebSocket} from "./useDebateWebSocket";
import type {WebSocketMessage} from "../apis/websocket";

type RoundType = 'PREPARATION' | 'PRESENTATION' | 'FREE';

interface Props {
    debateId?: string;
    onVoiceSignaling?: (message: WebSocketMessage) => void;
}

export interface CurrentRoundInfo {
    id: number | null;
    type: "PRESENTATION" | "FREE" | "PREPARATION";
    currentPresentationId?: string;
    currentSpeakerId?: string | null;
    createdAt: string | null;
    nextSpeakerId?: string | null | undefined;
    endedAt?: string | null | undefined;
    isEditable: boolean;
}

export interface UseDebateReturn {
    // 토론 기본 정보
    debate: FindOneDebateResponse;
    myMemberData: {
        id: string | undefined;
        role: string | undefined;
    };
    currentRoundInfo: CurrentRoundInfo;

    // 라운드 & 발언자 정보
    round: UseDebateRoundReturn;

    // WebSocket 정보
    websocket: ReturnType<typeof useDebateWebSocket>;

    // UI 상태
    showRoundStartBackdrop: {
        show: boolean;
        type: RoundType | null;
    };
    closeRoundStartBackdrop: () => void;
}

/**
 * 토론 참여 및 전체 관리
 * - 토론 기본 정보 제공
 * - 라운드/발언자 관리 (useDebateRound)
 * - WebSocket 연결 관리 (useDebateWebSocket)
 * - 자동 참여 처리
 * - UI 상태 관리 (백드롭)
 */
export const useDebate = ({debateId, onVoiceSignaling}: Props): UseDebateReturn => {
    const queryClient = useQueryClient();
    const {data: debate} = useSuspenseQuery(findOneDebateQueryOptions(debateId));
    const {data: _me} = useSuspenseQuery(meQueryOption);
    const joinAttempted = useRef<Set<string>>(new Set());

    const myMember = debate.members.find((m) => m.id === _me?.id);
    const isAlreadyMember = !!myMember;

    /** RoundStartBackdrop UI 상태 */
    const [showRoundStartBackdrop, setShowRoundStartBackdrop] = useState<{
        show: boolean;
        type: RoundType | null;
    }>({show: false, type: null});

    const closeRoundStartBackdrop = useCallback(() => {
        setShowRoundStartBackdrop({show: false, type: null});
    }, []);

    const handleRoundStartBackdrop = useCallback((roundType: RoundType) => {
        setShowRoundStartBackdrop({show: true, type: roundType});
        setTimeout(() => {
            closeRoundStartBackdrop()
        }, 5000);
    }, [closeRoundStartBackdrop]);


    /** 토론 참여 */
    const joinDebateMutation = useMutation({
        mutationFn: (debateId: string) => joinDebate({debateId}),
        onSuccess: () => {
            void queryClient.invalidateQueries({queryKey: ['debates', debateId]});
            window.location.reload();
        }
    });

    /** 멤버가 아니면 자동으로 가입 시도 (한 번만) */
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
        id: myMember?.id,
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

    const round = useDebateRound(debate, debateId, currentRoundInfo, myMemberData.id);
    const websocket = useDebateWebSocket(
        debateId || null,
        debate.members,
        myMemberData.id,
        {
            onRoundStartBackdrop: handleRoundStartBackdrop,
            onVoiceSignaling
        }
    );

    return {
        debate,
        myMemberData,
        currentRoundInfo,
        round,
        websocket,
        showRoundStartBackdrop,
        closeRoundStartBackdrop
    }
}
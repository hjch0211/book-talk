import {useEffect, useMemo, useState} from 'react';
import {useSuspenseQuery} from "@tanstack/react-query";
import {findOneDebateQueryOptions} from "../apis/debate";

interface CurrentSpeaker {
    accountId: string;
    accountName: string;
    endedAt?: number;
}

interface NextSpeaker {
    accountId: string;
    accountName: string;
}

interface UseDebateRoundSpeakerReturn {
    currentSpeaker: CurrentSpeaker | null;
    nextSpeaker: NextSpeaker | null;
    realTimeRemainingSeconds: number;
}

export const useDebateRoundSpeaker = (debateId: string): UseDebateRoundSpeakerReturn => {
    const [currentTime, setCurrentTime] = useState(new Date());

    // 백엔드에서 현재 토론 정보 가져오기 (서버 상태만 사용)
    const {data: debate} = useSuspenseQuery(findOneDebateQueryOptions(debateId));

    // 1초마다 현재 시간 업데이트 (타이머 표시용)
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // 현재 발표자 계산 (서버 데이터에서 직접 계산)
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

    // 다음 발표자 계산 (서버 데이터에서 직접 계산)
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

    // 현재 발표자의 실시간 남은 시간 계산
    const realTimeRemainingSeconds = useMemo(() => {
        if (!currentSpeaker?.endedAt) return 0;

        return Math.max(0, Math.floor((currentSpeaker.endedAt - currentTime.getTime()) / 1000));
    }, [currentSpeaker?.endedAt, currentTime]);

    return {
        currentSpeaker,
        nextSpeaker,
        realTimeRemainingSeconds,
    };
};
import { useEffect, useMemo, useState } from 'react';
import { SavedTimeIndicator } from '../Debate.style';

interface LastModifiedProps {
    lastSavedAt: Date | null;
    isEditable: boolean;
    isSaving: boolean;
}

export const LastModified = ({ lastSavedAt, isEditable, isSaving }: LastModifiedProps) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    // 1분마다 현재 시간 업데이트
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    // lastSavedAt이 변경되면 현재 시간 리셋
    useEffect(() => {
        setCurrentTime(new Date());
    }, [lastSavedAt]);

    const lastSaved = useMemo(() => {
        if (!lastSavedAt) {
            return '';
        }

        const diffMs = currentTime.getTime() - lastSavedAt.getTime();
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMinutes / 60);

        if (diffSeconds < 60) {
            return '방금 저장됨';
        } else if (diffMinutes === 1) {
            return '1분 전 저장됨';
        } else if (diffMinutes < 60) {
            return `${diffMinutes}분 전 저장됨`;
        } else if (diffHours === 1) {
            return '1시간 전 저장됨';
        } else if (diffHours < 24) {
            return `${diffHours}시간 전 저장됨`;
        } else {
            const diffDays = Math.floor(diffHours / 24);
            if (diffDays === 1) {
                return '1일 전 저장됨';
            } else {
                return `${diffDays}일 전 저장됨`;
            }
        }
    }, [lastSavedAt, currentTime]);

    if (!isEditable) {
        return null;
    }

    if (isSaving) {
        return <SavedTimeIndicator>저장중...</SavedTimeIndicator>;
    }

    if (!lastSaved) {
        return null;
    }

    return <SavedTimeIndicator>{lastSaved}</SavedTimeIndicator>;
};
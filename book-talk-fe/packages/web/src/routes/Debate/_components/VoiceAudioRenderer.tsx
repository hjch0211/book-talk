import { useEffect, useRef } from 'react';
import { useVoiceChat } from '../../../hooks/useVoiceChat';

/**
 * WebRTC로 수신한 원격 오디오 스트림을 재생하는 컴포넌트
 * - 각 참가자마다 숨겨진 <audio> 엘리먼트를 생성
 * - remoteStream을 자동으로 재생
 */
export function VoiceAudioRenderer() {
    const { participants, getRemoteStream } = useVoiceChat();

    console.log('🎵 VoiceAudioRenderer: Current participants:', participants);

    return (
        <>
            {participants.map(participant => (
                <RemoteAudio
                    key={participant.accountId}
                    participantId={participant.accountId}
                    participantName={participant.accountName}
                    getRemoteStream={getRemoteStream}
                />
            ))}
        </>
    );
}

interface RemoteAudioProps {
    participantId: string;
    participantName: string;
    getRemoteStream: (id: string) => MediaStream | null;
}

function RemoteAudio({ participantId, participantName, getRemoteStream }: RemoteAudioProps) {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const stream = getRemoteStream(participantId);

        if (!audioRef.current) {
            console.warn(`⚠️ Audio ref not ready for ${participantName} (${participantId})`);
            return;
        }

        if (stream) {
            console.log(`🎵 Setting audio stream for ${participantName} (${participantId})`, {
                streamId: stream.id,
                tracks: stream.getTracks().map(t => ({
                    kind: t.kind,
                    enabled: t.enabled,
                    readyState: t.readyState
                }))
            });

            audioRef.current.srcObject = stream;

            // 자동 재생 시도
            audioRef.current.play()
                .then(() => {
                    console.log(`✅ Audio playing for ${participantName} (${participantId})`);
                })
                .catch(err => {
                    console.error(`❌ Audio play failed for ${participantName} (${participantId}):`, err);
                    // 사용자 인터랙션이 필요한 경우를 대비해 에러 로그
                    if (err.name === 'NotAllowedError') {
                        console.warn('User interaction may be required to play audio');
                    }
                });
        } else {
            console.log(`ℹ️ No stream available for ${participantName} (${participantId})`);
            audioRef.current.srcObject = null;
        }

        // Cleanup
        return () => {
            if (audioRef.current) {
                console.log(`🧹 Cleaning up audio for ${participantName} (${participantId})`);
                audioRef.current.pause();
                audioRef.current.srcObject = null;
            }
        };
    }, [participantId, participantName, getRemoteStream]);

    return (
        <audio
            ref={audioRef}
            autoPlay
            playsInline
            style={{ display: 'none' }}
            data-participant-id={participantId}
            data-participant-name={participantName}
        />
    );
}

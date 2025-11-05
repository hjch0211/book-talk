/**
 * VoiceAudioRenderer - Audio Playback Component
 *
 * Renders multiple remote audio streams (mesh topology support).
 * Each peer gets their own <audio> element for playback.
 */

import {useEffect, useRef, useState} from 'react';
import {useVoiceChat} from '../../../hooks/useVoiceChat';

/**
 * Individual audio player for one peer
 */
function AudioPlayer({peerId, stream}: { peerId: string; stream: MediaStream }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [hasPlayedSuccessfully, setHasPlayedSuccessfully] = useState(false);
    const {requestJoinConfirmation} = useVoiceChat();

    // Attach stream and attempt autoplay
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        console.log(`🎵 [${peerId}] Attaching remote stream to audio element`);
        audio.srcObject = stream;

        // Attempt autoplay
        audio.play()
            .then(() => {
                console.log(`✅ [${peerId}] Audio playing automatically`);
                setHasPlayedSuccessfully(true);
            })
            .catch((error) => {
                console.warn(`⚠️ [${peerId}] Audio autoplay blocked:`, error.message);

                // Only show modal if we've never successfully played
                if (!hasPlayedSuccessfully) {
                    requestJoinConfirmation();
                }
            });

        return () => {
            console.log(`🔇 [${peerId}] Clearing audio`);
            audio.srcObject = null;
        };
    }, [peerId, stream, requestJoinConfirmation, hasPlayedSuccessfully]);

    // Retry playback on user interaction (after modal)
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || hasPlayedSuccessfully) return;

        const handleUserInteraction = () => {
            console.log(`🔄 [${peerId}] Retrying audio playback after user interaction`);
            audio.play()
                .then(() => {
                    console.log(`✅ [${peerId}] Audio playing after user interaction`);
                    setHasPlayedSuccessfully(true);
                    cleanup();
                })
                .catch((error) => {
                    console.error(`❌ [${peerId}] Still failed to play:`, error);
                });
        };

        const cleanup = () => {
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('keydown', handleUserInteraction);
        };

        document.addEventListener('click', handleUserInteraction);
        document.addEventListener('keydown', handleUserInteraction);

        return cleanup;
    }, [peerId, hasPlayedSuccessfully]);

    return (
        <audio
            ref={audioRef}
            autoPlay
            playsInline
            style={{display: 'none'}}
        />
    );
}

/**
 * Main component that renders all audio players
 */
export function VoiceAudioRenderer() {
    const {remoteStreams} = useVoiceChat();

    return (
        <>
            {Array.from(remoteStreams.entries()).map(([peerId, stream]) => (
                <AudioPlayer key={peerId} peerId={peerId} stream={stream}/>
            ))}
        </>
    );
}

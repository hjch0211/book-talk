/**
 * VoiceAudioRenderer - Audio Playback Component
 *
 * Renders remote audio stream with autoplay handling.
 */

import {useEffect, useRef, useState} from 'react';
import {useVoiceChat} from '../../../hooks/useVoiceChat';

export function VoiceAudioRenderer() {
    const {remoteStream, requestJoinConfirmation} = useVoiceChat();
    const audioRef = useRef<HTMLAudioElement>(null);
    const [hasPlayedSuccessfully, setHasPlayedSuccessfully] = useState(false);

    // Attach remote stream and attempt autoplay
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (remoteStream) {
            console.log('🎵 Attaching remote stream to audio element');
            audio.srcObject = remoteStream;

            // Attempt autoplay
            audio.play()
                .then(() => {
                    console.log('✅ Audio playing automatically');
                    setHasPlayedSuccessfully(true);
                })
                .catch((error) => {
                    console.warn('⚠️ Audio autoplay blocked:', error.message);

                    // Only show modal if we've never successfully played
                    if (!hasPlayedSuccessfully) {
                        requestJoinConfirmation();
                    }
                });
        } else {
            console.log('🔇 No remote stream, clearing audio');
            audio.srcObject = null;
        }
    }, [remoteStream, requestJoinConfirmation, hasPlayedSuccessfully]);

    // Retry playback on user interaction (after modal)
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !remoteStream || hasPlayedSuccessfully) return;

        const handleUserInteraction = () => {
            console.log('🔄 Retrying audio playback after user interaction');
            audio.play()
                .then(() => {
                    console.log('✅ Audio playing after user interaction');
                    setHasPlayedSuccessfully(true);
                    cleanup();
                })
                .catch((error) => {
                    console.error('❌ Still failed to play:', error);
                });
        };

        const cleanup = () => {
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('keydown', handleUserInteraction);
        };

        document.addEventListener('click', handleUserInteraction);
        document.addEventListener('keydown', handleUserInteraction);

        return cleanup;
    }, [remoteStream, hasPlayedSuccessfully]);

    return (
        <audio
            ref={audioRef}
            autoPlay
            playsInline
            style={{display: 'none'}}
        />
    );
}

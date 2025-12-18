import { useEffect, useRef } from 'react';
import { hiddenAudioStyle } from './style';

interface AudioPlayerProps {
  /** 재생할 MediaStream */
  stream: MediaStream | null;
  /** 오디오 활성화 여부 */
  isAudioActive: boolean;
  /** Autoplay 차단 시 콜백 */
  onAutoplayBlocked: () => void;
}

/**
 * MediaStream을 재생하는 숨겨진 오디오 플레이어
 * - 마운트 시 자동 재생 시도
 * - autoplay 차단 시 onAutoplayBlocked 콜백 호출
 * - isAudioActive=true가 되면 재생 재시도
 */
export function AudioPlayer({ stream, isAudioActive, onAutoplayBlocked }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  // stream 설정 및 autoplay 시도
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !stream) return;

    audio.srcObject = stream;

    audio.play().catch((error) => {
      if (error.name === 'NotAllowedError') {
        console.error('Autoplay 차단:', error.message);
        onAutoplayBlocked();
      } else {
        console.error('Audio play 실패:', error.message);
      }
    });

    return () => {
      if (audio.srcObject) {
        audio.pause();
        audio.srcObject = null;
      }
    };
  }, [stream, onAutoplayBlocked]);

  // isAudioActive가 true로 변경되면 재생 시도
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isAudioActive || !audio.paused) return;

    audio.play().catch((error) => {
      console.error('Audio play 실패:', error.message);
    });
  }, [isAudioActive]);

  return <audio ref={audioRef} playsInline style={hiddenAudioStyle} />;
}

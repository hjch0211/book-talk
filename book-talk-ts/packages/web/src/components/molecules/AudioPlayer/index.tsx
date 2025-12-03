import { useEffect, useRef } from 'react';
import { hiddenAudioStyle } from './style';

interface AudioPlayerProps {
  /** 재생할 MediaStream */
  stream: MediaStream | null;
  /** 오디오 활성화 여부 (사용자 제스처 후 true) */
  isAudioActive?: boolean;
}

/**
 * MediaStream을 재생하는 숨겨진 오디오 플레이어
 * - autoPlay 속성으로 자동 재생 시도
 * - autoplay 차단 시 isAudioActive=true가 되면 재생 시도
 * - stream 변경 시 자동으로 새 stream으로 전환
 */
export function AudioPlayer({ stream, isAudioActive }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !stream) return;

    audio.srcObject = stream;

    // isAudioActive가 true면 명시적으로 play() 호출 (사용자 제스처 후)
    if (isAudioActive && audio.paused) {
      audio.play().catch((error) => {
        console.error('Audio play 실패:', error.message);
      });
    }

    return () => {
      if (audio.srcObject) {
        audio.pause();
        audio.srcObject = null;
      }
    };
  }, [stream, isAudioActive]);

  return <audio ref={audioRef} autoPlay playsInline style={hiddenAudioStyle} />;
}

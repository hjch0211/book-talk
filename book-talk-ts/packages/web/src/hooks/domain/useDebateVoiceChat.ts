import { useCallback, useState } from 'react';

/** Voice chat 연결 상태 */
export type VoiceConnectionStatus = 'NOT_STARTED' | 'PENDING' | 'COMPLETED' | 'FAILED';

export interface UseDebateVoiceChatOptions {
  /** 로컬 오디오 스트림 */
  localStream: MediaStream | null;
}

/**
 * 토론 음성 채팅 UI 상태 관리
 * - 음소거 상태
 * - 오디오 활성화 상태 (autoplay policy)
 *
 * @internal useDebate 내부에서만 사용
 */
export const useDebateVoiceChat = (options: UseDebateVoiceChatOptions) => {
  const { localStream } = options;

  const [isMuted, setIsMuted] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(true);

  /** 음소거 토글 */
  const toggleMute = useCallback(() => {
    if (!localStream) return;

    const newMuted = !isMuted;
    localStream.getAudioTracks().forEach((track) => {
      track.enabled = !newMuted;
    });
    setIsMuted(newMuted);
  }, [localStream, isMuted]);

  /** 오디오 활성화 (사용자 제스처로 autoplay policy 해제) */
  const activateAudio = useCallback(() => {
    setIsAudioActive(true);
  }, []);

  /** Autoplay 차단 시 호출 (AudioPlayer에서 전달) */
  const onAutoplayBlocked = useCallback(() => {
    setIsAudioActive(false);
  }, []);

  return {
    /** 음소거 상태 */
    isMuted,
    /** 오디오 재생 가능 상태 (사용자 제스처 후 true) */
    isAudioActive,
    /** 음소거 토글 */
    toggleMute,
    /** 오디오 활성화 (사용자 클릭 필요) */
    activateAudio,
    /** Autoplay 차단 콜백 (AudioPlayer에 전달) */
    onAutoplayBlocked,
  };
};

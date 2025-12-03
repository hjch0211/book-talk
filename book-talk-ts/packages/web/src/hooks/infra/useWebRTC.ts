import { useCallback, useEffect, useRef, useState } from 'react';
import { type RemoteStream, WebRTCManager } from '../../libs/WebRTCManager.ts';

export type { RemoteStream };

export interface UseWebRTCOptions {
  /** ICE Candidate 발생 콜백 */
  onIceCandidate?: (peerId: string, candidate: RTCIceCandidateInit) => void;
  /** 에러 콜백 */
  onError?: (error: Error) => void;
  /** 재연결 필요 콜백 (연결 실패 시 호출) */
  onReconnectNeeded?: () => void;
}

export const useWebRTC = (options: UseWebRTCOptions = {}) => {
  const { onIceCandidate, onError, onReconnectNeeded } = options;
  const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);
  const managerRef = useRef<WebRTCManager | null>(null);
  if (!managerRef.current) {
    managerRef.current = new WebRTCManager(
      setRemoteStreams,
      onIceCandidate,
      onError,
      onReconnectNeeded
    );
  }

  useEffect(() => {
    return () => managerRef.current?.disconnect();
  }, []);

  const startLocalStream = useCallback(
    (constraints?: MediaStreamConstraints) => managerRef.current!.startLocalStream(constraints),
    []
  );

  const createOffer = useCallback((peerId: string) => managerRef.current!.createOffer(peerId), []);

  const handleOffer = useCallback(
    (peerId: string, offer: RTCSessionDescriptionInit) =>
      managerRef.current!.handleOffer(peerId, offer),
    []
  );

  const handleAnswer = useCallback(
    (peerId: string, answer: RTCSessionDescriptionInit) =>
      managerRef.current!.handleAnswer(peerId, answer),
    []
  );

  const handleIceCandidate = useCallback(
    (peerId: string, candidate: RTCIceCandidateInit) =>
      managerRef.current!.handleIceCandidate(peerId, candidate),
    []
  );

  const disconnect = useCallback(() => managerRef.current!.disconnect(), []);

  return {
    remoteStreams,
    localStream: managerRef.current?.localStream ?? null,
    startLocalStream,
    createOffer,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    disconnect,
  };
};

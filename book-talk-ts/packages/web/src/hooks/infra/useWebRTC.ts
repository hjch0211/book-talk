import { useCallback, useEffect, useRef, useState } from 'react';
import type { IceCandidateInfo, RemoteStream } from '../../libs/WebRTCManager.ts';
import { WebRTCManager } from '../../libs/WebRTCManager.ts';

export interface UseWebRTCOptions {
  /** 내 계정 ID */
  myId: string;
  /** 에러 콜백 */
  onError: (error: Error) => void;
  /** 재연결 필요 콜백 (연결 실패 시 호출) */
  onReconnectNeeded: () => void;
  /** Trickle ICE: ICE Candidate 전송 콜백 */
  onIceCandidate: (info: IceCandidateInfo) => void;
  /** P2P 연결 완료 콜백 */
  onPeerConnected: (peerId: string) => void;
}

export const useWebRTC = (options: UseWebRTCOptions) => {
  const { myId, onError, onReconnectNeeded, onIceCandidate, onPeerConnected } = options;
  const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const managerRef = useRef<WebRTCManager | null>(null);

  // myId가 있을 때만 WebRTCManager 생성
  useEffect(() => {
    if (!myId || managerRef.current) return;

    managerRef.current = new WebRTCManager(
      myId,
      setRemoteStreams,
      onError,
      onReconnectNeeded,
      onIceCandidate,
      onPeerConnected
    );
  }, [myId, onError, onReconnectNeeded, onIceCandidate, onPeerConnected]);

  useEffect(() => {
    return () => {
      managerRef.current?.disconnect();
      managerRef.current = null;
    };
  }, []);

  const startLocalStream = useCallback(async (constraints?: MediaStreamConstraints) => {
    const stream = await managerRef.current!.startLocalStream(constraints);
    if (stream) {
      setLocalStream(stream);
    }
    return stream;
  }, []);

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

  const addIceCandidate = useCallback(
    (peerId: string, candidate: RTCIceCandidateInit) =>
      managerRef.current!.addIceCandidate(peerId, candidate),
    []
  );

  const disconnect = useCallback(() => managerRef.current!.disconnect(), []);

  return {
    remoteStreams,
    localStream,
    startLocalStream,
    createOffer,
    handleOffer,
    handleAnswer,
    addIceCandidate,
    disconnect,
  };
};

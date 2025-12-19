import { useEffect, useEffectEvent, useRef, useState } from 'react';
import type { IceCandidateInfo, RemoteStream } from '../../libs/WebRTCManager.ts';
import { WebRTCManager } from '../../libs/WebRTCManager.ts';

interface Props {
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

export const useWebRTC = (props: Props) => {
  const { myId, onError, onReconnectNeeded, onIceCandidate, onPeerConnected } = props;
  const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const managerRef = useRef<WebRTCManager | null>(null);

  const onErrorEvent = useEffectEvent((error: Error) => onError(error));
  const onReconnectNeededEvent = useEffectEvent(() => onReconnectNeeded());
  const onIceCandidateEvent = useEffectEvent((info: IceCandidateInfo) => onIceCandidate(info));
  const onPeerConnectedEvent = useEffectEvent((peerId: string) => onPeerConnected(peerId));

  /** myId가 있을 때만 WebRTCManager 생성 */
  useEffect(() => {
    if (!myId || managerRef.current) return;

    managerRef.current = new WebRTCManager(
      myId,
      setRemoteStreams,
      onErrorEvent,
      onReconnectNeededEvent,
      onIceCandidateEvent,
      onPeerConnectedEvent
    );
  }, [myId]);

  /** 컴포넌트 언마운트 시 WebRTC 연결 정리 */
  useEffect(() => {
    return () => {
      managerRef.current?.disconnect();
      managerRef.current = null;
    };
  }, []);

  const startLocalStream = async (constraints?: MediaStreamConstraints) => {
    const stream = await managerRef.current!.startLocalStream(constraints);
    if (stream) {
      setLocalStream(stream);
    }
    return stream;
  };

  const createOffer = (peerId: string) => managerRef.current!.createOffer(peerId);

  const handleOffer = (peerId: string, offer: RTCSessionDescriptionInit) =>
    managerRef.current!.handleOffer(peerId, offer);

  const handleAnswer = (peerId: string, answer: RTCSessionDescriptionInit) =>
    managerRef.current!.handleAnswer(peerId, answer);

  const addIceCandidate = (peerId: string, candidate: RTCIceCandidateInit) =>
    managerRef.current!.addIceCandidate(peerId, candidate);

  const disconnect = () => managerRef.current!.disconnect();

  return {
    /** 원격 피어들의 미디어 스트림 목록 */
    remoteStreams,
    /** 로컬 미디어 스트림 */
    localStream,
    /** 로컬 스트림 시작 (마이크/카메라) */
    startLocalStream,
    /** SDP Offer 생성 */
    createOffer,
    /** SDP Offer 수신 처리 → Answer 반환 */
    handleOffer,
    /** SDP Answer 수신 처리 */
    handleAnswer,
    /** ICE Candidate 추가 */
    addIceCandidate,
    /** WebRTC 연결 종료 */
    disconnect,
  };
};

import {useEffect, useRef, useState} from 'react';
import {type RemoteStream, WebRTCManager} from '../../libs/WebRTCManager.ts';

export type {RemoteStream};

export interface UseWebRTCOptions {
    /** ICE Candidate 발생 콜백 */
    onIceCandidate?: (peerId: string, candidate: RTCIceCandidateInit) => void;
    /** 에러 콜백 */
    onError?: (error: Error) => void;
}

export const useWebRTC = (options: UseWebRTCOptions = {}) => {
    const {onIceCandidate, onError} = options;
    const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);
    const managerRef = useRef<WebRTCManager | null>(null);
    if (!managerRef.current) {
        managerRef.current = new WebRTCManager(
            setRemoteStreams,
            onIceCandidate,
            onError
        );
    }

    useEffect(() => {
        return () => managerRef.current?.disconnect()
    }, []);

    return {
        remoteStreams,
        localStream: managerRef.current.localStream,
        startLocalStream: managerRef.current.startLocalStream.bind(managerRef.current),
        createOffer: managerRef.current.createOffer.bind(managerRef.current),
        handleOffer: managerRef.current.handleOffer.bind(managerRef.current),
        handleAnswer: managerRef.current.handleAnswer.bind(managerRef.current),
        handleIceCandidate: managerRef.current.handleIceCandidate.bind(managerRef.current),
        disconnect: managerRef.current.disconnect.bind(managerRef.current)
    };
};
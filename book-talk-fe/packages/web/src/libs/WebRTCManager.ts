import 'webrtc-adapter';
import {postGenerateIceServers} from '../apis/turn';

/** Remote stream 정보 */
export interface RemoteStream {
    peerId: string;
    stream: MediaStream;
}

/** 기본 STUN 서버 (fallback) */
const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
    {urls: 'stun:stun.l.google.com:19302'},
    {urls: 'stun:stun1.l.google.com:19302'},
];

/**
 * WebRTC Mesh 연결 관리 클래스
 * - 순수 WebRTC 연결만 담당
 * - 도메인 메시지 타입 모름
 */
export class WebRTCManager {
    /** PeerConnection Map (peerId : connection) */
    private peerConnections = new Map<string, RTCPeerConnection>();

    /** Buffered ICE candidates per peer (peerId : candidates[]) */
    private iceCandidateBuffer = new Map<string, RTCIceCandidateInit[]>();
    /** Remote streams 목록 */
    private _remoteStreams: RemoteStream[] = [];

    constructor(
        /** Remote streams 변경 콜백 */
        private onRemoteStreamsChange?: (streams: RemoteStream[]) => void,
        /** ICE Candidate 수신 콜백 */
        private onIceCandidate?: (peerId: string, candidate: RTCIceCandidateInit) => void,
        /** 에러 콜백 */
        private onError?: (error: Error) => void,
    ) {
    }

    /** 내 Local media stream */
    private _localStream: MediaStream | null = null;

    get localStream(): MediaStream | null {
        return this._localStream;
    }

    /** Local stream 시작 (미디어 권한 요청) */
    async startLocalStream(
        constraints: MediaStreamConstraints = {
            audio: {
                autoGainControl: true,      // 자동 게인 조절 (볼륨 자동 증폭)
                echoCancellation: true,      // 에코 제거
                noiseSuppression: true,      // 노이즈 제거
                sampleRate: 48000            // 고품질 샘플레이트
            },
            video: false
        }
    ): Promise<MediaStream | undefined> {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            this._localStream = stream;
            return stream;
        } catch (err) {
            console.error('미디어 권한 요청 실패:', err);
            this.onError?.(err as Error);
        }
    }

    /** Offer 생성 (연결 시작) → Offer 반환 */
    async createOffer(peerId: string): Promise<RTCSessionDescriptionInit | undefined> {
        if (!this._localStream) {
            console.error('로컬 스트림이 없습니다. startLocalStream을 먼저 호출하세요.');
            return;
        }

        // S_VOICE_JOIN을 받았다는 것은 상대방이 (재)연결을 시작한 것
        // 기존 연결이 있어도 정리하고 새로 생성
        this.cleanupPeerConnection(peerId);

        const pc = await this.createPeerConnection(peerId);

        this._localStream.getTracks().forEach(track => {
            pc.addTrack(track, this._localStream!);
        });

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        return pc.localDescription!;
    }

    /** Offer 수신 → Answer 반환 */
    async handleOffer(peerId: string, offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit | undefined> {
        this.cleanupPeerConnection(peerId);

        const pc = await this.createPeerConnection(peerId);

        this._localStream?.getTracks().forEach(track => {
            pc.addTrack(track, this._localStream!);
        });

        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        // Process buffered ICE candidates
        await this.processBufferedIceCandidates(peerId, pc);
        return pc.localDescription!;
    }

    /** Answer 수신 */
    async handleAnswer(peerId: string, answer: RTCSessionDescriptionInit): Promise<void> {
        const pc = this.peerConnections.get(peerId);
        if (pc?.signalingState === 'have-local-offer') {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));

            // Process buffered ICE candidates
            await this.processBufferedIceCandidates(peerId, pc);
        }
    }

    /** ICE Candidate 수신 */
    async handleIceCandidate(peerId: string, candidate: RTCIceCandidateInit): Promise<void> {
        const pc = this.peerConnections.get(peerId);

        // PC가 없거나 remoteDescription이 없으면 버퍼에 저장
        // (Offer 처리 중에 ICE가 먼저 도착할 수 있음)
        if (!pc || !pc.remoteDescription) {
            if (!this.iceCandidateBuffer.has(peerId)) {
                this.iceCandidateBuffer.set(peerId, []);
            }
            this.iceCandidateBuffer.get(peerId)!.push(candidate);
            return;
        }

        // remoteDescription이 설정된 후에는 즉시 추가
        try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
            console.error('ICE Candidate 추가 실패:', err);
        }
    }

    /** 모든 연결 종료 */
    disconnect(): void {
        this.peerConnections.forEach(pc => pc.close());
        this.peerConnections.clear();
        this.iceCandidateBuffer.clear();

        this._localStream?.getTracks().forEach(track => track.stop());
        this._localStream = null;

        this.updateRemoteStreams([]);
    }

    /** 특정 피어 연결 정리 */
    private cleanupPeerConnection(peerId: string): void {
        const existingPc = this.peerConnections.get(peerId);
        if (existingPc) {
            existingPc.close();
            this.peerConnections.delete(peerId);
        }
        this.iceCandidateBuffer.delete(peerId);
    }

    /** Process buffered ICE candidates after setRemoteDescription */
    private async processBufferedIceCandidates(peerId: string, pc: RTCPeerConnection): Promise<void> {
        const buffered = this.iceCandidateBuffer.get(peerId) || [];
        if (buffered.length > 0) {
            for (const candidate of buffered) {
                try {
                    await pc.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (err) {
                    console.error('Buffered ICE candidate 추가 실패:', err);
                }
            }
            this.iceCandidateBuffer.delete(peerId);
        }
    }

    /** ICE 서버 설정 가져오기 (TURN 포함) */
    private async getIceServers(): Promise<RTCConfiguration> {
        try {
            return await postGenerateIceServers()
        } catch (err) {
            console.warn('TURN 서버 조회 실패, Google STUN 사용:', err);
            return {iceServers: DEFAULT_ICE_SERVERS};
        }
    }

    /** PeerConnection 생성 및 이벤트 핸들러 설정 */
    private async createPeerConnection(peerId: string): Promise<RTCPeerConnection> {
        const iceConfig = await this.getIceServers();
        const pc = new RTCPeerConnection(iceConfig);

        /** ICE Candidate 수신 시 */
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                this.onIceCandidate?.(peerId, event.candidate.toJSON());
            }
        };

        /** Remote stream 수신 시 */
        pc.ontrack = (event) => {
            const [remoteStream] = event.streams;
            if (remoteStream) {
                remoteStream.getAudioTracks().forEach((track) => {
                    track.onunmute = () => {
                        // unmute 시 스트림 재갱신 (AudioPlayer가 새로 play() 시도)
                        const filtered = this._remoteStreams.filter(rs => rs.peerId !== peerId);
                        this.updateRemoteStreams([...filtered, {peerId, stream: remoteStream}]);
                    };
                    track.onended = () => {
                        // track이 ended되면 해당 stream 제거
                        this.updateRemoteStreams(this._remoteStreams.filter(rs => rs.peerId !== peerId));
                    };
                });

                const filtered = this._remoteStreams.filter(rs => rs.peerId !== peerId);
                this.updateRemoteStreams([...filtered, {peerId, stream: remoteStream}]);
            }
        };

        /** Connection 변경 시 */
        pc.onconnectionstatechange = () => {
            if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
                this.peerConnections.delete(peerId);
                this.iceCandidateBuffer.delete(peerId);
                this.updateRemoteStreams(this._remoteStreams.filter(rs => rs.peerId !== peerId));
            }
        };

        this.peerConnections.set(peerId, pc);
        return pc;
    }

    /** Remote streams 업데이트 및 콜백 호출 */
    private updateRemoteStreams(streams: RemoteStream[]): void {
        this._remoteStreams = streams;
        this.onRemoteStreamsChange?.(streams);
    }
}
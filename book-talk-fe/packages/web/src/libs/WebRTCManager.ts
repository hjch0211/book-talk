import 'webrtc-adapter';

/** Remote stream 정보 */
export interface RemoteStream {
    peerId: string;
    stream: MediaStream;
}

/** ICE 서버 설정 */
const ICE_SERVERS: RTCConfiguration = {
    iceServers: [
        {urls: 'stun:stun.l.google.com:19302'},
        {urls: 'stun:stun1.l.google.com:19302'},
    ]
};

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

    /** Remote streams 목록 */
    private _remoteStreams: RemoteStream[] = [];

    get remoteStreams(): RemoteStream[] {
        return this._remoteStreams;
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
        if (this.peerConnections.has(peerId)) return;

        const pc = this.createPeerConnection(peerId);

        this._localStream.getTracks().forEach(track => {
            pc.addTrack(track, this._localStream!);
        });

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        return pc.localDescription!;
    }

    /** Offer 수신 → Answer 반환 */
    async handleOffer(peerId: string, offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit | undefined> {
        // 기존 연결 정리
        const existingPc = this.peerConnections.get(peerId);
        if (existingPc) {
            existingPc.close();
            this.peerConnections.delete(peerId);
        }

        const pc = this.createPeerConnection(peerId);

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
        if (!pc) return;

        // Buffer candidates if remote description not set
        if (!pc.remoteDescription) {
            if (!this.iceCandidateBuffer.has(peerId)) {
                this.iceCandidateBuffer.set(peerId, []);
            }
            this.iceCandidateBuffer.get(peerId)!.push(candidate);
            return;
        }

        // Add candidate immediately if remote description is set
        if (candidate) {
            try {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (err) {
                console.error('ICE Candidate 추가 실패:', err);
            }
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

    /** PeerConnection 생성 및 이벤트 핸들러 설정 */
    private createPeerConnection(peerId: string): RTCPeerConnection {
        const pc = new RTCPeerConnection(ICE_SERVERS);

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

        /** ICE Connection 상태 변경 (실제 P2P 연결) */
        pc.oniceconnectionstatechange = () => {
            if (pc.iceConnectionState === 'failed') {
                console.error(`ICE 연결 실패 (${peerId.slice(0, 8)}) - NAT 문제 또는 TURN 서버 필요`);
            }
        };

        /** Connection 변경 시 */
        pc.onconnectionstatechange = () => {
            if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
                this.peerConnections.delete(peerId);
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
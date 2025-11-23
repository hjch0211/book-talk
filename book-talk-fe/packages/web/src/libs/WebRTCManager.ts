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
 * WebRTC Mesh 연결 관리 클래스 (Infrastructure)
 * - 순수 WebRTC 연결만 담당
 * - 도메인 메시지 타입 모름
 */
export class WebRTCManager {
    /** PeerConnection Map (peerId : connection) */
    private peerConnections = new Map<string, RTCPeerConnection>();

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
        constraints: MediaStreamConstraints = {audio: true, video: false}
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

        console.log('Offer 생성:', peerId);
        return pc.localDescription!;
    }

    /** Offer 수신 → Answer 반환 */
    async handleOffer(peerId: string, offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit | undefined> {
        console.log('Offer 수신:', peerId);

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

        console.log('Answer 생성:', peerId);
        return pc.localDescription!;
    }

    /** Answer 수신 */
    async handleAnswer(peerId: string, answer: RTCSessionDescriptionInit): Promise<void> {
        console.log('Answer 수신:', peerId);
        const pc = this.peerConnections.get(peerId);
        if (pc?.signalingState === 'have-local-offer') {
            await pc.setRemoteDescription(new RTCSessionDescription(answer));
        }
    }

    /** ICE Candidate 수신 */
    async handleIceCandidate(peerId: string, candidate: RTCIceCandidateInit): Promise<void> {
        console.log('ICE Candidate 수신:', peerId);
        const pc = this.peerConnections.get(peerId);
        if (pc && candidate) {
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

        this._localStream?.getTracks().forEach(track => track.stop());
        this._localStream = null;

        this.updateRemoteStreams([]);
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
                const filtered = this._remoteStreams.filter(rs => rs.peerId !== peerId);
                this.updateRemoteStreams([...filtered, {peerId, stream: remoteStream}]);
                console.log('스트림 수신:', peerId);
            }
        };

        /** Connection 변경 시 */
        pc.onconnectionstatechange = () => {
            console.log(`연결 상태 (${peerId}):`, pc.connectionState);
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
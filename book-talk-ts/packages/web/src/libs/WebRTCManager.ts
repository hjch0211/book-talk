import 'webrtc-adapter';
import { postGenerateIceServers } from '../apis/turn';

/** Remote stream 정보 */
export interface RemoteStream {
  peerId: string;
  stream: MediaStream;
}

/** 기본 STUN 서버 (fallback) */
const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

/** WebRTC 재연결 최대 횟수 */
const MAX_RETRIES = 5;

/** ICE Gathering 타임아웃 (ms) */
const ICE_GATHERING_TIMEOUT = 5000;

/**
 * WebRTC Mesh 연결 관리 클래스
 */
export class WebRTCManager {
  /** PeerConnection Map (peerId : connection) */
  private peerConnections = new Map<string, RTCPeerConnection>();

  /** 재연결 시도 횟수 (peerId : count) */
  private retryCount = new Map<string, number>();
  /** Remote streams 목록 */
  private _remoteStreams: RemoteStream[] = [];

  constructor(
    /** Remote streams 변경 콜백 */
    private readonly onRemoteStreamsChange?: (streams: RemoteStream[]) => void,
    /** 에러 콜백 */
    private onError?: (error: Error) => void,
    /** 재연결 필요 콜백 (연결 실패 시 호출) */
    private onReconnectNeeded?: () => void
  ) {}

  /** 내 Local media stream */
  private _localStream: MediaStream | null = null;

  get localStream(): MediaStream | null {
    return this._localStream;
  }

  /** Local stream 시작 (미디어 권한 요청) */
  async startLocalStream(
    constraints: MediaStreamConstraints = {
      audio: {
        autoGainControl: true, // 자동 게인 조절 (볼륨 자동 증폭)
        echoCancellation: true, // 에코 제거
        noiseSuppression: true, // 노이즈 제거
        sampleRate: 48000, // 고품질 샘플레이트
      },
      video: false,
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

  /** Offer 생성 (연결 시작) → ICE Gathering 완료 후 Offer 반환 */
  async createOffer(peerId: string): Promise<RTCSessionDescriptionInit | undefined> {
    if (!this._localStream) {
      console.error('로컬 스트림이 없습니다. startLocalStream을 먼저 호출하세요.');
      return;
    }

    // 기존 연결이 있어도 정리하고 새로 생성 -> 재연결 전략
    this.cleanupPeerConnection(peerId);

    const pc = await this.createPeerConnection(peerId);

    this._localStream.getTracks().forEach((track) => {
      pc.addTrack(track, this._localStream!);
    });

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // ICE Gathering 완료까지 대기
    await this.waitForIceGatheringComplete(pc);

    return pc.localDescription!;
  }

  /** Offer 수신 → Answer 반환 */
  async handleOffer(
    peerId: string,
    offer: RTCSessionDescriptionInit
  ): Promise<RTCSessionDescriptionInit | undefined> {
    this.cleanupPeerConnection(peerId);

    const pc = await this.createPeerConnection(peerId);

    this._localStream?.getTracks().forEach((track) => {
      pc.addTrack(track, this._localStream!);
    });

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    // ICE Gathering 완료까지 대기
    await this.waitForIceGatheringComplete(pc);

    return pc.localDescription!;
  }

  /** Answer 수신 */
  async handleAnswer(peerId: string, answer: RTCSessionDescriptionInit): Promise<void> {
    const pc = this.peerConnections.get(peerId);
    if (pc?.signalingState === 'have-local-offer') {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }

  /** 모든 연결 종료 */
  disconnect(): void {
    this.peerConnections.forEach((pc) => pc.close());
    this.peerConnections.clear();
    this.retryCount.clear();

    this._localStream?.getTracks().forEach((track) => track.stop());
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
  }

  /** ICE Gathering 완료까지 대기 */
  private waitForIceGatheringComplete(pc: RTCPeerConnection): Promise<void> {
    return new Promise((resolve) => {
      // 이미 완료된 경우 즉시 반환
      if (pc.iceGatheringState === 'complete') {
        resolve();
        return;
      }

      // 타임아웃 설정
      const timeout = setTimeout(() => {
        console.warn('ICE Gathering 타임아웃, 현재 수집된 candidate로 진행');
        resolve();
      }, ICE_GATHERING_TIMEOUT);

      // ICE Gathering 상태 변경 감지
      pc.onicegatheringstatechange = () => {
        if (pc.iceGatheringState === 'complete') {
          clearTimeout(timeout);
          resolve();
        }
      };
    });
  }

  /** ICE 서버 설정 가져오기 (TURN 포함) */
  private async getIceServers(): Promise<RTCConfiguration> {
    try {
      return await postGenerateIceServers();
    } catch (err) {
      console.warn('TURN 서버 조회 실패, Google STUN 사용:', err);
      return { iceServers: DEFAULT_ICE_SERVERS };
    }
  }

  /** PeerConnection 생성 및 이벤트 핸들러 설정 */
  private async createPeerConnection(peerId: string): Promise<RTCPeerConnection> {
    const iceConfig = await this.getIceServers();
    const pc = new RTCPeerConnection(iceConfig);

    /** Remote stream 수신 시 */
    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      if (remoteStream) {
        remoteStream.getAudioTracks().forEach((track) => {
          track.onunmute = () => {
            // unmute 시 스트림 재갱신 (AudioPlayer가 새로 play() 시도)
            const filtered = this._remoteStreams.filter((rs) => rs.peerId !== peerId);
            this.updateRemoteStreams([...filtered, { peerId, stream: remoteStream }]);
          };
          track.onended = () => {
            // track이 ended되면 해당 stream 제거
            this.updateRemoteStreams(this._remoteStreams.filter((rs) => rs.peerId !== peerId));
          };
        });

        const filtered = this._remoteStreams.filter((rs) => rs.peerId !== peerId);
        this.updateRemoteStreams([...filtered, { peerId, stream: remoteStream }]);
      }
    };

    /** Connection 변경 시 */
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') {
        this.retryCount.delete(peerId);
      } else if (pc.connectionState === 'failed') {
        this.cleanupPeerConnection(peerId);
        this.updateRemoteStreams(this._remoteStreams.filter((rs) => rs.peerId !== peerId));

        const currentRetry = (this.retryCount.get(peerId) ?? 0) + 1;
        this.retryCount.set(peerId, currentRetry);

        if (currentRetry <= MAX_RETRIES) {
          this.onReconnectNeeded?.();
        } else {
          console.error(`피어 ${peerId} 재연결 실패: 최대 재시도 횟수(${MAX_RETRIES}) 초과`);
          this.retryCount.delete(peerId);
          this.onError?.(new Error(`재연결 실패: 최대 재시도 횟수(${MAX_RETRIES}) 초과`));
        }
      } else if (pc.connectionState === 'closed') {
        this.peerConnections.delete(peerId);
        this.retryCount.delete(peerId);
        this.updateRemoteStreams(this._remoteStreams.filter((rs) => rs.peerId !== peerId));
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

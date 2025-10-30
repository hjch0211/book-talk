/**
 * VoiceChatManager - WebRTC 음성 채팅 매니저
 *
 * 상태 머신 기반 WebRTC 연결 관리 및 자동 재연결
 *
 * 연결 플로우:
 * 1. idle → connecting: connect() 호출
 * 2. connecting → connected: 미디어 획득, peer connection 수립
 * 3. connected → reconnecting: ICE 연결 실패
 * 4. reconnecting → connected: ICE Restart 성공
 * 5. * → closed: disconnect() 호출
 * 6. * → failed: 최대 재연결 횟수 도달
 */

import type {ConnectionState, ConnectionStats, VoiceChatConfig, VoiceChatEvent, VoiceChatEventMap} from './types';
import {AUDIO_CONSTRAINTS, DISCONNECT_TIMEOUT_MS, ICE_SERVERS, MAX_RECONNECT_ATTEMPTS} from './constants';

export class VoiceChatManager {
    // 설정
    private readonly config: VoiceChatConfig;

    // 상태
    private state: ConnectionState = 'idle';
    private pc: RTCPeerConnection | null = null;
    private localStream: MediaStream | null = null;
    private remoteStream: MediaStream | null = null;
    private isMuted: boolean = true; // 기본적으로 음소거 상태로 시작

    // 재연결 추적
    private reconnectAttempts: number = 0;
    private disconnectTimeoutId: number | null = null;

    // 이벤트 핸들러
    private eventHandlers: Partial<Record<VoiceChatEvent, Function[]>> = {};

    constructor(config: VoiceChatConfig) {
        this.config = config;
        console.log(`🎯 [${this.myId}] VoiceChatManager created for peer ${this.remotePeerId}`);
    }

    // 편의를 위한 Getter
    private get myId(): string {
        return this.config.myId;
    }

    private get remotePeerId(): string {
        return this.config.remotePeerId;
    }

    private get debateId(): string {
        return this.config.debateId;
    }

    /**
     * 현재 연결 상태 반환
     */
    getState(): ConnectionState {
        return this.state;
    }

    /**
     * 상세 연결 통계 반환
     */
    getStats(): ConnectionStats {
        return {
            state: this.state,
            iceConnectionState: this.pc?.iceConnectionState || null,
            reconnectAttempts: this.reconnectAttempts,
            hasLocalStream: !!this.localStream,
            hasRemoteStream: !!this.remoteStream
        };
    }

    /**
     * 음소거 상태 확인
     */
    isMutedState(): boolean {
        return this.isMuted;
    }

    /**
     * 음소거 상태 설정
     */
    setMuted(muted: boolean): void {
        if (!this.localStream) {
            console.warn(`⚠️ [${this.myId}] 음소거 설정 불가: 로컬 스트림 없음`);
            return;
        }

        this.localStream.getAudioTracks().forEach(track => {
            track.enabled = !muted;
        });

        this.isMuted = muted;
        console.log(`🔇 [${this.myId}] 음소거 상태: ${muted}`);
    }

    /**
     * 음소거 토글
     */
    toggleMute(): boolean {
        this.setMuted(!this.isMuted);
        return this.isMuted;
    }

    /**
     * 이벤트 핸들러 등록
     */
    on<E extends VoiceChatEvent>(event: E, handler: VoiceChatEventMap[E]): void {
        if (!this.eventHandlers[event]) {
            this.eventHandlers[event] = [];
        }
        this.eventHandlers[event]!.push(handler);
    }

    /**
     * 이벤트 핸들러 해제
     */
    off<E extends VoiceChatEvent>(event: E, handler: VoiceChatEventMap[E]): void {
        const handlers = this.eventHandlers[event];
        if (!handlers) return;

        const index = handlers.indexOf(handler);
        if (index !== -1) {
            handlers.splice(index, 1);
        }
    }

    /**
     * 원격 peer에 연결
     */
    async connect(): Promise<void> {
        if (this.state !== 'idle') {
            console.warn(`⚠️ [${this.myId}] ${this.state} 상태에서는 연결할 수 없음`);
            return;
        }

        this.setState('connecting');
        console.log(`🚀 [${this.myId}] Peer에 연결 중...`);

        try {
            // 단계 1: 마이크 획득
            await this.acquireMicrophone();

            // 단계 2: Peer connection 생성
            this.createPeerConnection();

            // 단계 3: 트랙 추가
            this.addTracksToConnection();

            // 단계 4: 필요시 offer 시작
            const shouldInitiate = this.shouldInitiateConnection();
            if (shouldInitiate) {
                await this.createAndSendOffer();
            } else {
                console.log(`⏸️ [${this.myId}] Peer의 offer 대기 중...`);
            }

            this.setState('connected');
            console.log(`✅ [${this.myId}] 연결 성공`);

        } catch (error) {
            console.error(`❌ [${this.myId}] 연결 실패:`, error);
            this.setState('failed');
            this.emit('error', error);
            await this.cleanup();
            throw error;
        }
    }

    /**
     * 연결 해제 및 정리
     */
    async disconnect(): Promise<void> {
        console.log(`🛑 [${this.myId}] 연결 해제 중...`);
        this.setState('closed');
        await this.cleanup();
        console.log(`✅ [${this.myId}] 연결 해제 완료`);
    }

    /**
     * ICE Restart 수행
     */
    async restartIce(): Promise<void> {
        if (this.state !== 'connected' && this.state !== 'reconnecting') {
            console.warn(`⚠️ [${this.myId}] ${this.state} 상태에서는 ICE Restart 불가`);
            return;
        }

        if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
            console.error(`❌ [${this.myId}] 최대 재연결 시도 횟수 도달`);
            this.setState('failed');
            this.emit('error', new Error('최대 재연결 시도 횟수 도달'));
            return;
        }

        this.reconnectAttempts++;
        this.setState('reconnecting');
        console.log(`🔄 [${this.myId}] ICE Restart 시도 ${this.reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`);

        try {
            if (!this.pc) {
                throw new Error('Peer connection 없음');
            }

            const offer = await this.pc.createOffer({iceRestart: true});
            await this.pc.setLocalDescription(offer);

            console.log(`📤 [${this.myId}] ICE Restart offer 전송`);
            this.config.onSendSignaling({
                type: 'VOICE_OFFER',
                debateId: this.debateId,
                fromId: this.myId,
                toId: this.remotePeerId,
                offer: offer
            });

        } catch (error) {
            console.error(`❌ [${this.myId}] ICE Restart 실패:`, error);
            this.emit('error', error);
        }
    }

    /**
     * 수신한 offer 처리
     */
    async handleOffer(offer: RTCSessionDescriptionInit): Promise<void> {
        console.log(`📥 [${this.myId}] VOICE_OFFER 수신`);

        try {
            if (!this.pc) {
                throw new Error('Peer connection 없음');
            }

            await this.pc.setRemoteDescription(offer);
            console.log(`✅ [${this.myId}] Remote description 설정 완료`);

            const answer = await this.pc.createAnswer();
            await this.pc.setLocalDescription(answer);

            console.log(`📤 [${this.myId}] VOICE_ANSWER 전송`);
            this.config.onSendSignaling({
                type: 'VOICE_ANSWER',
                debateId: this.debateId,
                fromId: this.myId,
                toId: this.remotePeerId,
                answer: answer
            });

        } catch (error) {
            console.error(`❌ [${this.myId}] Offer 처리 실패:`, error);
            this.emit('error', error);
        }
    }

    /**
     * 수신한 answer 처리
     */
    async handleAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
        console.log(`📥 [${this.myId}] VOICE_ANSWER 수신`);

        try {
            if (!this.pc) {
                throw new Error('Peer connection 없음');
            }

            await this.pc.setRemoteDescription(answer);
            console.log(`✅ [${this.myId}] Remote description 설정 완료 (answer)`);

        } catch (error) {
            console.error(`❌ [${this.myId}] Answer 처리 실패:`, error);
            this.emit('error', error);
        }
    }

    /**
     * 수신한 ICE candidate 처리
     */
    async handleIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
        console.log(`🧊 [${this.myId}] ICE candidate 수신`);

        try {
            if (!this.pc) {
                throw new Error('Peer connection 없음');
            }

            await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
            console.log(`✅ [${this.myId}] ICE candidate 추가 완료`);

        } catch (error) {
            console.error(`❌ [${this.myId}] ICE candidate 추가 실패:`, error);
            this.emit('error', error);
        }
    }

    /**
     * 등록된 모든 핸들러에 이벤트 전달
     */
    private emit<E extends VoiceChatEvent>(event: E, ...args: any[]): void {
        const handlers = this.eventHandlers[event];
        if (!handlers) return;

        handlers.forEach(handler => {
            try {
                handler(...args);
            } catch (error) {
                console.error(`❌ [${this.myId}] 이벤트 핸들러 에러:`, error);
            }
        });
    }

    /**
     * 상태 업데이트 및 이벤트 발생
     */
    private setState(newState: ConnectionState): void {
        if (this.state === newState) return;

        console.log(`🔄 [${this.myId}] 상태: ${this.state} → ${newState}`);
        this.state = newState;
        this.emit('stateChange', newState);
    }

    // ========== Private 메서드 ==========

    /**
     * 마이크 획득 (에러 처리 포함)
     */
    private async acquireMicrophone(): Promise<void> {
        console.log(`🎤 [${this.myId}] 마이크 획득 중...`);

        try {
            this.localStream = await navigator.mediaDevices.getUserMedia(AUDIO_CONSTRAINTS);

            // 음소거 상태로 시작
            this.localStream.getAudioTracks().forEach(track => {
                track.enabled = false;
            });

            console.log(`✅ [${this.myId}] 마이크 획득 완료 (음소거)`);

        } catch (error) {
            console.error(`❌ [${this.myId}] 마이크 획득 실패:`, error);
            throw new Error('마이크 권한 거부됨');
        }
    }

    /**
     * RTCPeerConnection 생성 및 이벤트 리스너 등록
     */
    private createPeerConnection(): void {
        console.log(`🔗 [${this.myId}] PeerConnection 생성 중...`);

        this.pc = new RTCPeerConnection(ICE_SERVERS);

        // ICE candidate 핸들러
        this.pc.onicecandidate = (event) => {
            if (event.candidate) {
                console.log(`🧊 [${this.myId}] ICE candidate 전송`);
                this.config.onSendSignaling({
                    type: 'VOICE_ICE',
                    debateId: this.debateId,
                    fromId: this.myId,
                    toId: this.remotePeerId,
                    iceCandidate: event.candidate.toJSON()
                });
            }
        };

        // Remote track 핸들러
        this.pc.ontrack = (event) => {
            console.log(`🎵 [${this.myId}] Remote track 수신`);
            this.remoteStream = event.streams[0];
            this.emit('remoteStream', this.remoteStream);
        };

        // Connection 상태 핸들러
        this.pc.onconnectionstatechange = () => {
            const state = this.pc!.connectionState;
            console.log(`🔄 [${this.myId}] Connection 상태: ${state}`);

            if (state === 'failed') {
                console.error(`❌ [${this.myId}] Connection 실패`);
            }
        };

        // ICE connection 상태 핸들러
        this.pc.oniceconnectionstatechange = () => {
            const state = this.pc!.iceConnectionState;
            console.log(`🧊 [${this.myId}] ICE connection 상태: ${state}`);

            // 대기 중인 disconnect timeout 취소
            if (this.disconnectTimeoutId !== null) {
                clearTimeout(this.disconnectTimeoutId);
                this.disconnectTimeoutId = null;
            }

            if (state === 'connected' || state === 'completed') {
                console.log(`✅ [${this.myId}] ICE 연결 수립 완료`);
                this.reconnectAttempts = 0;
                if (this.state === 'reconnecting') {
                    this.setState('connected');
                }
            } else if (state === 'disconnected') {
                console.warn(`⚠️ [${this.myId}] ICE 연결 끊김, ${DISCONNECT_TIMEOUT_MS}ms 대기 중...`);

                // 재연결 시도 전 대기
                this.disconnectTimeoutId = window.setTimeout(() => {
                    if (this.pc?.iceConnectionState === 'disconnected') {
                        console.log(`🔄 [${this.myId}] 여전히 끊김 상태, ICE Restart 시도`);
                        void this.restartIce();
                    }
                }, DISCONNECT_TIMEOUT_MS);
            } else if (state === 'failed') {
                console.error(`❌ [${this.myId}] ICE 연결 실패`);
                void this.restartIce();
            }
        };

        console.log(`✅ [${this.myId}] PeerConnection 생성 완료`);
    }

    /**
     * Peer connection에 로컬 트랙 추가
     */
    private addTracksToConnection(): void {
        if (!this.localStream || !this.pc) {
            throw new Error('트랙 추가 불가: 스트림 또는 연결 없음');
        }

        this.localStream.getTracks().forEach(track => {
            console.log(`➕ [${this.myId}] 트랙 추가: ${track.kind}`);
            this.pc!.addTrack(track, this.localStream!);
        });
    }

    /**
     * 이 peer가 연결을 시작해야 하는지 결정
     * 동시 offer 방지를 위해 lexicographic 비교 사용
     */
    private shouldInitiateConnection(): boolean {
        const shouldInitiate = this.myId < this.remotePeerId;
        console.log(`🤔 [${this.myId}] 연결 시작 여부? ${shouldInitiate}`);
        return shouldInitiate;
    }

    /**
     * Offer 생성 및 전송
     */
    private async createAndSendOffer(): Promise<void> {
        if (!this.pc) {
            throw new Error('Peer connection 없음');
        }

        console.log(`📤 [${this.myId}] Offer 생성 중...`);

        const offer = await this.pc.createOffer();
        await this.pc.setLocalDescription(offer);

        console.log(`📤 [${this.myId}] VOICE_OFFER 전송`);
        this.config.onSendSignaling({
            type: 'VOICE_OFFER',
            debateId: this.debateId,
            fromId: this.myId,
            toId: this.remotePeerId,
            offer: offer
        });
    }

    /**
     * 모든 리소스 정리
     */
    private async cleanup(): Promise<void> {
        // Disconnect timeout 취소
        if (this.disconnectTimeoutId !== null) {
            clearTimeout(this.disconnectTimeoutId);
            this.disconnectTimeoutId = null;
        }

        // 로컬 트랙 중지
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
        }

        // Peer connection 닫기
        if (this.pc) {
            this.pc.close();
            this.pc = null;
        }

        // Remote stream 제거
        this.remoteStream = null;
        this.emit('remoteStream', null);

        // 재연결 카운터 리셋
        this.reconnectAttempts = 0;
    }
}

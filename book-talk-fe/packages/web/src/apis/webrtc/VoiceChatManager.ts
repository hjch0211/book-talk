import type {WebSocketMessage} from "../websocket";

export interface VoiceChatParticipant {
    accountId: string;
    accountName: string;
    isMuted: boolean;
    isSpeaking: boolean;
    volume: number;
}

export class VoiceChatManager {
    private peerConnections: Map<string, RTCPeerConnection> = new Map();
    private localStream: MediaStream | null = null;
    private remoteStreams: Map<string, MediaStream> = new Map();
    private participants: Map<string, VoiceChatParticipant> = new Map();
    private debateId: string;
    private readonly myAccountId: string;
    private isJoined: boolean = false;
    private isMuted: boolean = false;

    private readonly onSignalingMessage: (message: WebSocketMessage) => void;
    private readonly onParticipantUpdate: (participants: VoiceChatParticipant[]) => void;
    private readonly onRemoteStreamUpdate: (accountId: string, stream: MediaStream | null) => void;

    constructor(
        debateId: string,
        myAccountId: string,
        onSignalingMessage: (message: WebSocketMessage) => void,
        onParticipantUpdate: (participants: VoiceChatParticipant[]) => void,
        onRemoteStreamUpdate: (accountId: string, stream: MediaStream | null) => void
    ) {
        this.debateId = debateId;
        this.myAccountId = myAccountId;
        this.onSignalingMessage = onSignalingMessage;
        this.onParticipantUpdate = onParticipantUpdate;
        this.onRemoteStreamUpdate = onRemoteStreamUpdate;
    }

    async joinVoiceChat(): Promise<void> {
        if (this.isJoined) return;

        try {
            this.localStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            this.isJoined = true;

            this.onSignalingMessage({
                type: 'VOICE_JOIN',
                provider: 'CLIENT',
                debateId: this.debateId,
                accountId: this.myAccountId,
                fromId: this.myAccountId
            });

        } catch (error) {
            console.error('Failed to join voice chat:', error);
            throw error;
        }
    }

    async leaveVoiceChat(): Promise<void> {
        if (!this.isJoined) return;

        this.onSignalingMessage({
            type: 'VOICE_LEAVE',
            provider: 'CLIENT',
            debateId: this.debateId,
            accountId: this.myAccountId,
            fromId: this.myAccountId
        });

        this.cleanup();
    }

    async handleParticipantJoined(participantId: string, participantName: string, shouldInitiateConnection: boolean = false): Promise<void> {
        if (participantId === this.myAccountId) return;

        const participant: VoiceChatParticipant = {
            accountId: participantId,
            accountName: participantName,
            isMuted: false,
            isSpeaking: false,
            volume: 1.0
        };

        this.participants.set(participantId, participant);

        // Only create peer connection and send offer if we should initiate
        // This prevents simultaneous offer/answer conflicts
        if (shouldInitiateConnection) {
            const peerConnection = this.createPeerConnection(participantId);
            this.peerConnections.set(participantId, peerConnection);

            if (this.localStream) {
                this.localStream.getTracks().forEach(track => {
                    peerConnection.addTrack(track, this.localStream!);
                });
            }

            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);

            this.onSignalingMessage({
                type: 'VOICE_OFFER',
                provider: 'CLIENT',
                debateId: this.debateId,
                fromId: this.myAccountId,
                toId: participantId,
                offer: offer
            });
        }

        this.updateParticipants();
    }

    async handleParticipantLeft(participantId: string): Promise<void> {
        const peerConnection = this.peerConnections.get(participantId);
        if (peerConnection) {
            peerConnection.close();
            this.peerConnections.delete(participantId);
        }

        this.participants.delete(participantId);
        this.remoteStreams.delete(participantId);
        this.onRemoteStreamUpdate(participantId, null);
        this.updateParticipants();
    }

    async handleOffer(fromId: string, offer: RTCSessionDescriptionInit): Promise<void> {
        if (!this.participants.has(fromId)) return;

        let peerConnection = this.peerConnections.get(fromId);
        if (!peerConnection) {
            peerConnection = this.createPeerConnection(fromId);
            this.peerConnections.set(fromId, peerConnection);
        }

        if (this.localStream) {
            this.localStream.getTracks().forEach(track => {
                peerConnection!.addTrack(track, this.localStream!);
            });
        }

        await peerConnection.setRemoteDescription(offer);
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        this.onSignalingMessage({
            type: 'VOICE_ANSWER',
            provider: 'CLIENT',
            debateId: this.debateId,
            fromId: this.myAccountId,
            toId: fromId,
            answer: answer
        });
    }

    async handleAnswer(fromId: string, answer: RTCSessionDescriptionInit): Promise<void> {
        const peerConnection = this.peerConnections.get(fromId);
        if (peerConnection) {
            await peerConnection.setRemoteDescription(answer);
        }
    }

    async handleIceCandidate(fromId: string, iceCandidate: RTCIceCandidateInit): Promise<void> {
        const peerConnection = this.peerConnections.get(fromId);
        if (peerConnection) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidate));
        }
    }

    toggleMute(): void {
        if (!this.localStream) return;

        this.isMuted = !this.isMuted;
        this.localStream.getAudioTracks().forEach(track => {
            track.enabled = !this.isMuted;
        });

        this.onSignalingMessage({
            type: 'VOICE_STATE',
            provider: 'CLIENT',
            debateId: this.debateId,
            accountId: this.myAccountId,
            fromId: this.myAccountId,
            isMuted: this.isMuted
        });
    }

    setParticipantVolume(participantId: string, volume: number): void {
        const participant = this.participants.get(participantId);
        if (participant) {
            participant.volume = volume;
            this.updateParticipants();
        }
    }

    getLocalStream(): MediaStream | null {
        return this.localStream;
    }

    getRemoteStream(participantId: string): MediaStream | null {
        return this.remoteStreams.get(participantId) || null;
    }

    getParticipants(): VoiceChatParticipant[] {
        return Array.from(this.participants.values());
    }

    isMicMuted(): boolean {
        return this.isMuted;
    }

    isVoiceChatJoined(): boolean {
        return this.isJoined;
    }

    private createPeerConnection(participantId: string): RTCPeerConnection {
        const configuration: RTCConfiguration = {
            iceServers: [
                {urls: 'stun:stun.l.google.com:19302'}
            ]
        };

        const peerConnection = new RTCPeerConnection(configuration);

        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                this.onSignalingMessage({
                    type: 'VOICE_ICE',
                    provider: 'CLIENT',
                    debateId: this.debateId,
                    fromId: this.myAccountId,
                    toId: participantId,
                    iceCandidate: event.candidate.toJSON()
                });
            }
        };

        peerConnection.ontrack = (event) => {
            const [remoteStream] = event.streams;
            this.remoteStreams.set(participantId, remoteStream);
            this.onRemoteStreamUpdate(participantId, remoteStream);

            this.setupVoiceDetection(participantId, remoteStream);
        };

        peerConnection.onconnectionstatechange = () => {
            console.log(`Peer connection state with ${participantId}:`, peerConnection.connectionState);
        };

        return peerConnection;
    }

    private setupVoiceDetection(participantId: string, stream: MediaStream): void {
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);

            source.connect(analyser);
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.8;

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            let animationFrameId: number;
            let isActive = true;

            const checkAudioLevel = () => {
                if (!isActive) return;

                analyser.getByteFrequencyData(dataArray);

                // Calculate RMS (Root Mean Square) for more accurate voice detection
                const rms = Math.sqrt(
                    dataArray.reduce((sum, value) => sum + value * value, 0) / bufferLength
                );

                const isSpeaking = rms > 15; // Adjusted threshold

                const participant = this.participants.get(participantId);
                if (participant && participant.isSpeaking !== isSpeaking) {
                    participant.isSpeaking = isSpeaking;
                    this.updateParticipants();
                }

                animationFrameId = requestAnimationFrame(checkAudioLevel);
            };

            checkAudioLevel();

            // Store cleanup function
            const cleanup = () => {
                isActive = false;
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }
                audioContext.close();
            };

            // Clean up when participant leaves (you might want to store this)
            stream.addEventListener('inactive', cleanup);

        } catch (error) {
            console.error('Failed to setup voice detection:', error);
        }
    }

    private updateParticipants(): void {
        this.onParticipantUpdate(this.getParticipants());
    }

    private cleanup(): void {
        this.peerConnections.forEach(pc => pc.close());
        this.peerConnections.clear();

        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
        }

        this.remoteStreams.clear();
        this.participants.clear();
        this.isJoined = false;
        this.isMuted = false;
    }
}
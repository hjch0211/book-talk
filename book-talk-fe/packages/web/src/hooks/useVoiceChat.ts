import {useVoiceChatContext} from '../contexts/VoiceChatContext';

export const useVoiceChat = () => {
    const context = useVoiceChatContext();

    return {
        participants: context.participants,
        isJoined: context.isJoined,
        isMuted: context.isMuted,
        isConnecting: context.isConnecting,
        hasMicPermission: context.hasMicPermission,
        joinVoiceChat: context.joinVoiceChat,
        leaveVoiceChat: context.leaveVoiceChat,
        toggleMute: context.toggleMute,
        setParticipantVolume: context.setParticipantVolume,
        getRemoteStream: context.getRemoteStream,
        getLocalStream: context.getLocalStream,
        handleIncomingSignalingMessage: context.handleIncomingSignalingMessage,
        requestMicPermission: context.requestMicPermission
    };
};
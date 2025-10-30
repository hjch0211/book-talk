/**
 * useVoiceChat - 간단한 음성 채팅 훅
 *
 * VoiceChatContext를 그대로 expose
 */

import { useVoiceChat as useVoiceChatContext } from '../contexts/VoiceChatContext';

export const useVoiceChat = () => {
    return useVoiceChatContext();
};

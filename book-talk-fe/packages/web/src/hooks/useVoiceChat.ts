/**
 * useVoiceChat - 음성 채팅 훅
 *
 * VoiceChatContext의 기능을 컴포넌트에서 사용할 수 있도록 제공합니다.
 */

import { useVoiceChat as useVoiceChatContext } from '../contexts/VoiceChatContext';

export const useVoiceChat = () => {
    return useVoiceChatContext();
};

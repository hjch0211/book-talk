import { useConversation } from '@elevenlabs/react';
import MicOffRoundedIcon from '@mui/icons-material/MicOffRounded';
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import { motion } from 'framer-motion';
import { useEffect, useEffectEvent } from 'react';
import type { LogEntry } from './ConversationLog';
import { AgentWrapper, Divider, MicButton, StatusLabel } from './style';

const STATUS_LABEL: Record<string, string> = {
  speaking: '말하는 중 (눌러서 토론 종료하기)',
  listening: '듣는 중 (눌러서 토론 종료하기)',
  connecting: '연결 중...',
  idle: '클릭하여 음성 대화 시작',
};

type Mode = 'idle' | 'speaking' | 'listening' | 'connecting';

interface Props {
  chatId: string;
  debateId: string;
  myId: string;
  agentId: string;
  onMessage: (entry: LogEntry) => void;
  onModeChange: (mode: Mode) => void;
}

export function VoiceAgent({ chatId, debateId, myId, agentId, onMessage, onModeChange }: Props) {
  const conversation = useConversation({
    onError: (message) => console.error('[VoiceAgent]', message),
    onMessage: ({ role, message }) => {
      onMessage({ role, text: message });
    },
  });

  const mode: Mode =
    conversation.status === 'connected'
      ? conversation.isSpeaking
        ? 'speaking'
        : 'listening'
      : conversation.status === 'connecting'
        ? 'connecting'
        : 'idle';

  const notifyModeChange = useEffectEvent(onModeChange);

  useEffect(() => {
    notifyModeChange(mode);
  }, [mode]);

  const handleToggle = async () => {
    if (conversation.status === 'connected') {
      await conversation.endSession();
    } else {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({
        agentId,
        connectionType: 'websocket',
        dynamicVariables: { chatId, debateId, accountId: myId },
        userId: myId,
      });
    }
  };

  return (
    <>
      <AgentWrapper>
        <motion.div
          style={{ borderRadius: '50%' }}
          animate={mode === 'connecting' ? { opacity: [1, 0.5, 1] } : { scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
        >
          <MicButton
            type="button"
            onClick={handleToggle}
            aria-label={conversation.status === 'connected' ? '음성 대화 종료' : '음성 대화 시작'}
          >
            {conversation.status === 'connected' ? (
              <MicOffRoundedIcon sx={{ fontSize: 32, color: '#9ca3af' }} />
            ) : (
              <MicRoundedIcon sx={{ fontSize: 32, color: '#9ca3af' }} />
            )}
          </MicButton>
        </motion.div>

        <StatusLabel $mode={mode}>{STATUS_LABEL[mode]}</StatusLabel>
      </AgentWrapper>
      <Divider />
    </>
  );
}

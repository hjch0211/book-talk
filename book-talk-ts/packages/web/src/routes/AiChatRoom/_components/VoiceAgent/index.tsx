import { useConversation } from '@elevenlabs/react';
import MicOffRoundedIcon from '@mui/icons-material/MicOffRounded';
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import { AgentWrapper, Divider, MicButton, StatusLabel } from './style';

const STATUS_LABEL: Record<string, string> = {
  speaking: '말하는 중',
  listening: '듣는 중',
  connecting: '연결 중...',
  idle: '클릭하여 음성 대화 시작',
};

interface Props {
  chatId: string;
  debateId: string;
  myId: string;
  agentId: string;
}

export function VoiceAgent({ chatId, debateId, myId, agentId }: Props) {
  const conversation = useConversation({
    onError: (message) => console.error('[VoiceAgent]', message),
  });

  const mode: 'idle' | 'speaking' | 'listening' | 'connecting' =
    conversation.status === 'connected'
      ? conversation.isSpeaking
        ? 'speaking'
        : 'listening'
      : conversation.status === 'connecting'
        ? 'connecting'
        : 'idle';

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
        <MicButton
          type="button"
          $mode={mode}
          onClick={handleToggle}
          aria-label={conversation.status === 'connected' ? '음성 대화 종료' : '음성 대화 시작'}
        >
          {conversation.status === 'connected' ? (
            <MicOffRoundedIcon sx={{ fontSize: 32, color: '#9ca3af' }} />
          ) : (
            <MicRoundedIcon sx={{ fontSize: 32, color: '#9ca3af' }} />
          )}
        </MicButton>
        <StatusLabel $mode={mode}>{STATUS_LABEL[mode]}</StatusLabel>
      </AgentWrapper>
      <Divider />
    </>
  );
}

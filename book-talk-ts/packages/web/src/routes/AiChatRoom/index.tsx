import DeleteIcon from '@mui/icons-material/Delete';
import { AiPageRoot } from '@src/components/templates/AiPageRoot';
import { meQueryOption } from '@src/externals/account';
import { AiChatMessageStatus, findOneAiChatQueryOptions } from '@src/externals/aiChat';
import { findOneDebateQueryOptions } from '@src/externals/debate';
import { useAiChat } from '@src/hooks';
import { ChatMessageList } from '@src/routes/Debate/_components/chat/ChatMessageList';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, useEffect, useEffectEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ConversationLog, type LogEntry } from './_components/VoiceAgent/ConversationLog';
import { LogPanelHeader } from './_components/VoiceAgent/style';
import { VoiceAgent } from './_components/VoiceAgent';
import { AiChatRoomSkeleton } from './AiChatRoomSkeleton';
import {
  AiChatRoomContainer,
  AvatarCircle,
  AvatarColumn,
  ChatArea,
  DeleteButton,
  EmptyState,
  Header,
  HeaderLeft,
  HeaderTitle,
  LoadingDots,
  LogPanel,
  MainPanel,
  MessageList,
  MessageRow,
} from './style';

export function AiChatRoomPage() {
  const { chatId } = useParams<{ chatId: string }>();

  return (
    <AiPageRoot>
      <Suspense fallback={<AiChatRoomSkeleton />}>
        <AiChatRoomContent chatId={chatId!} />
      </Suspense>
    </AiPageRoot>
  );
}

function stripBrackets(text: string) {
  return text.replace(/\[.*?]/g, '').trim();
}

type VoiceMode = 'idle' | 'speaking' | 'listening' | 'connecting';

function AiChatRoomContent({ chatId }: { chatId: string }) {
  const { isConnected, handleDeleteChat } = useAiChat({ chatId });
  const { data: chatRoom, isFetching } = useSuspenseQuery(findOneAiChatQueryOptions(chatId));
  const { data: debate } = useSuspenseQuery(findOneDebateQueryOptions(chatRoom.debateId));
  const { data: me } = useSuspenseQuery(meQueryOption);
  const navigate = useNavigate();

  const [log, setLog] = useState<LogEntry[]>([]);
  const [voiceMode, setVoiceMode] = useState<VoiceMode>('idle');

  const handleNavigateToSignIn = useEffectEvent(() => {
    navigate('/sign-in');
  });

  const [isWaiting, setIsWaiting] = useState(
    chatRoom.messages.at(-1)?.status === AiChatMessageStatus.PENDING
  );

  useEffect(() => {
    setIsWaiting(chatRoom.messages.at(-1)?.status === AiChatMessageStatus.PENDING);
  }, [chatRoom.messages]);

  useEffect(() => {
    if (!me?.id) handleNavigateToSignIn();
  }, [me]);

  const handleVoiceMessage = (entry: LogEntry) => {
    const cleaned = stripBrackets(entry.text);
    if (!cleaned) return;
    setLog((prev) => [...prev, { ...entry, text: cleaned }]);
  };

  const handleModeChange = (mode: VoiceMode) => {
    setVoiceMode(mode);
    if (mode === 'idle') setLog([]);
  };

  const chats = chatRoom.messages
    .filter((msg) => msg.status !== AiChatMessageStatus.PENDING)
    .map((msg, i) => ({
      id: i,
      debateId: chatRoom.debateId,
      accountId: msg.role === 'user' ? (me?.id ?? '') : 'ai',
      accountName: msg.role === 'user' ? chatRoom.name : 'AI',
      content: msg.content,
      createdAt: msg.createdAt,
    }));

  if (!isConnected) return <AiChatRoomSkeleton />;

  return (
    <AiChatRoomContainer>
      <Header>
        <HeaderLeft>
          <HeaderTitle>{debate.topic}</HeaderTitle>
        </HeaderLeft>
        <DeleteButton onClick={handleDeleteChat}>
          <DeleteIcon />
        </DeleteButton>
      </Header>

      <ChatArea>
        <MainPanel>
          <VoiceAgent
            chatId={chatId}
            debateId={chatRoom.debateId}
            myId={me?.id || ''}
            agentId={chatRoom.agentId}
            onMessage={handleVoiceMessage}
            onModeChange={handleModeChange}
          />
          <MessageList>
            {chats.length === 0 && !isWaiting && (
              <EmptyState>상대가 공유한 자료를 확인해보세요!</EmptyState>
            )}
            <ChatMessageList
              chats={chats}
              isFetching={isFetching}
              myAccountId={me?.id ?? ''}
              members={[]}
              presentations={[]}
            />
            {isWaiting && (
              <MessageRow $isUser={false}>
                <AvatarColumn>
                  <AvatarCircle $isUser={false}>AI</AvatarCircle>
                </AvatarColumn>
                <LoadingDots>
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </LoadingDots>
              </MessageRow>
            )}
          </MessageList>
        </MainPanel>

        <LogPanel>
          <LogPanelHeader>음성 대화</LogPanelHeader>
          <ConversationLog entries={log} mode={voiceMode} />
        </LogPanel>
      </ChatArea>
    </AiChatRoomContainer>
  );
}

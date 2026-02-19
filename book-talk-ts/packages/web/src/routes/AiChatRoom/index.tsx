import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { PageContainer } from '@src/components';
import { AiChatMessageStatus, findOneAiChatQueryOptions } from '@src/externals/aiChat';
import { findOneDebateQueryOptions } from '@src/externals/debate';
import { useAiChat } from '@src/hooks';
import { useSuspenseQuery } from '@tanstack/react-query';
import type React from 'react';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  InputArea,
  InputBox,
  LoadingDots,
  MessageBubble,
  MessageGroup,
  MessageList,
  MessageRow,
  MessageTime,
  SendButton,
} from './style';

export function AiChatRoomPage() {
  const { chatId } = useParams<{ chatId: string }>();

  return (
    <Suspense fallback={<AiChatRoomSkeleton />}>
      <AiChatRoomContent chatId={chatId!} />
    </Suspense>
  );
}

function AiChatRoomContent({ chatId }: { chatId: string }) {
  const [input, setInput] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { isConnected, handleSendMessage, handleDeleteChat } = useAiChat({ chatId });
  const { data: chatRoom } = useSuspenseQuery(findOneAiChatQueryOptions(chatId));
  const { data: debate } = useSuspenseQuery(findOneDebateQueryOptions(chatRoom.debateId));

  const [isWaiting, setIsWaiting] = useState(
    chatRoom.messages.at(-1)?.status === AiChatMessageStatus.PENDING
  );

  useEffect(() => {
    if (chatRoom.messages.length > 0) {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  });

  useEffect(() => {
    setIsWaiting(chatRoom.messages.at(-1)?.status === AiChatMessageStatus.PENDING);
  }, [chatRoom.messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isWaiting) return;
    handleSendMessage(trimmed);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const isActive = input.trim().length > 0 && !isWaiting;

  if (!isConnected) return <AiChatRoomSkeleton />;

  return (
    <PageContainer>
      <AiChatRoomContainer>
        {/* TODO: 토론 요약 페이지 버튼 만들기*/}
        <Header>
          <HeaderLeft>
            <HeaderTitle>{debate.topic}</HeaderTitle>
          </HeaderLeft>
          <DeleteButton onClick={handleDeleteChat}>
            <DeleteIcon />
          </DeleteButton>
        </Header>

        <ChatArea>
          <MessageList>
            {chatRoom.messages.length === 0 && !isWaiting && (
              <EmptyState>메시지를 보내 대화를 시작하세요</EmptyState>
            )}
            {chatRoom.messages.map((msg) => {
              const isUser = msg.role === 'user';

              if (msg.status === AiChatMessageStatus.PENDING) {
                return (
                  <MessageRow key={msg.id} $isUser={false}>
                    <AvatarColumn>
                      <AvatarCircle $isUser={false}>AI</AvatarCircle>
                    </AvatarColumn>
                    <LoadingDots>
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                    </LoadingDots>
                  </MessageRow>
                );
              }

              return (
                <MessageRow key={msg.id} $isUser={isUser}>
                  {!isUser && (
                    <AvatarColumn>
                      <AvatarCircle $isUser={false}>AI</AvatarCircle>
                    </AvatarColumn>
                  )}
                  <MessageGroup $isUser={isUser}>
                    <MessageBubble>{msg.content}</MessageBubble>
                    <MessageTime>
                      {new Date(msg.createdAt).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </MessageTime>
                  </MessageGroup>
                  {isUser && (
                    <AvatarColumn>
                      <AvatarCircle $isUser={true}>{chatRoom.member.accountName[0]}</AvatarCircle>
                    </AvatarColumn>
                  )}
                </MessageRow>
              );
            })}
            <div ref={messageEndRef} />
          </MessageList>

          <InputArea>
            <InputBox>
              <textarea
                ref={textareaRef}
                placeholder="메시지를 입력하세요..."
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                disabled={isWaiting}
                rows={1}
              />
            </InputBox>
            <SendButton $active={isActive} onClick={handleSend} disabled={!isActive}>
              <SendIcon />
            </SendButton>
          </InputArea>
        </ChatArea>
      </AiChatRoomContainer>
    </PageContainer>
  );
}

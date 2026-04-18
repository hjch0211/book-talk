import { Box } from '@mui/material';
import type { ChatResponse } from '@src/externals/debate';
import { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage.tsx';

interface ChatMessageListProps {
  chats: ChatResponse;
  isFetching: boolean;
  myAccountId: string;
  members: Array<{ id: string; name: string }>;
  presentations: Array<{ id: string; accountId: string }>;
}

/**
 * 채팅 메시지 리스트 컴포넌트
 * - 채팅 메시지 표시
 * - 새 메시지 시 자동 스크롤
 */
export function ChatMessageList({
  chats,
  isFetching,
  myAccountId,
  members,
  presentations,
}: ChatMessageListProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFetching || chats.length === 0) return;

    let container: HTMLElement | null = chatEndRef.current?.parentElement ?? null;
    while (container) {
      const { overflowY } = window.getComputedStyle(container);
      if (overflowY === 'auto' || overflowY === 'scroll') {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        return;
      }
      container = container.parentElement;
    }
  }, [chats, isFetching]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2.25,
        padding: '12px',
        width: '100%',
      }}
    >
      {chats.map((chat) => (
        <ChatMessage
          key={chat.id}
          chat={chat}
          isMyMessage={chat.accountId === myAccountId}
          members={members}
          presentations={presentations}
        />
      ))}
      <div ref={chatEndRef} />
    </Box>
  );
}

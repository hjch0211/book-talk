import {useEffect, useRef} from 'react';
import {Box} from '@mui/material';
import {ChatMessage} from './ChatMessage';
import type {ChatResponse} from '../../../apis/debate';

interface ChatMessageListProps {
    chats: ChatResponse[];
    myAccountId: string;
}

/**
 * 채팅 메시지 리스트 컴포넌트
 * - 채팅 메시지 표시
 * - 새 메시지 시 자동 스크롤
 */
export function ChatMessageList({chats, myAccountId}: ChatMessageListProps) {
    const chatEndRef = useRef<HTMLDivElement>(null);

    // 새 채팅 시 스크롤 하단 이동
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [chats]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2.25,
                padding: '12px 35px',
                width: '100%'
            }}
        >
            {chats.map((chat) => (
                <ChatMessage
                    key={chat.id}
                    chat={chat}
                    isMyMessage={chat.accountId === myAccountId}
                />
            ))}
            <div ref={chatEndRef}/>
        </Box>
    );
}

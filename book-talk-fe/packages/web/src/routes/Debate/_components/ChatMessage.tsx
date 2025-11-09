import {Avatar, Box, Stack, Typography} from '@mui/material';
import {EditorContent, useEditor} from '@tiptap/react';
import {useCallback, useEffect, useState} from 'react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Heading from '@tiptap/extension-heading';
import type {ChatResponse} from '../../../apis/debate';
import {LinkPreview} from "./LinkPreviewExtension.tsx";
import {createMentionExtension} from './MentionExtension';
import {PresentationViewModal} from './PresentationViewModal';

interface ChatMessageProps {
    chat: ChatResponse;
    isMyMessage: boolean;
    members: Array<{ id: string; name: string }>;
    presentations: Array<{ id: string; accountId: string }>;
}

/**
 * 채팅 메시지 말풍선 컴포넌트
 * - TipTap 읽기 전용 에디터 사용
 * - 내 메시지: 오른쪽 정렬
 * - 다른 사람 메시지: 왼쪽 정렬
 * - 프로필 아바타 표시
 */
export function ChatMessage({chat, isMyMessage, members, presentations}: ChatMessageProps) {
    // 멘션 클릭 시 모달 상태
    const [viewPresentationMember, setViewPresentationMember] = useState<{
        memberId: string;
        memberName: string;
    } | null>(null);

    // 멘션 클릭 핸들러
    const handleMentionClick = useCallback((accountId: string) => {
        const member = members.find(m => m.id === accountId);
        if (member) {
            setViewPresentationMember({
                memberId: member.id,
                memberName: member.name,
            });
        }
    }, [members]);

    const editor = useEditor({
        extensions: [
            createMentionExtension(members, handleMentionClick, false), // 읽기 전용, 클릭 가능
            StarterKit.configure({heading: false}),
            Heading.configure({levels: [1]}),
            Image.configure({HTMLAttributes: {class: 'chat-image'}}),
            Youtube.configure({HTMLAttributes: {class: 'chat-video'}, controls: false, nocookie: true}),
            LinkPreview,
        ],
        editable: false,
        immediatelyRender: false,
        editorProps: {attributes: {class: 'chat-message-editor'}},
        content: ''
    });

    // content 로드
    useEffect(() => {
        if (editor && chat.content) {
            try {
                const parsedContent = JSON.parse(chat.content);
                editor.commands.setContent(parsedContent);
            } catch (e) {
                // JSON 파싱 실패 시 일반 텍스트로 처리
                editor.commands.setContent(chat.content);
            }
        }
    }, [editor, chat.content]);

    return (
        <Stack
            direction="row"
            spacing={2}
            justifyContent={isMyMessage ? 'flex-end' : 'flex-start'}
            sx={{
                width: '100%',
                px: 1.5,
                py: 2.25,
                filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1))'
            }}
        >
            {/* 왼쪽 메시지: 프로필 먼저 */}
            {!isMyMessage && (
                <Stack alignItems="center" spacing={0.375} sx={{minWidth: '60px'}}>
                    <Avatar
                        sx={{
                            width: 36,
                            height: 36,
                            bgcolor: '#EADDFF',
                            color: '#4F378A',
                            fontSize: '14px'
                        }}
                    >
                        {chat.accountName[0]}
                    </Avatar>
                    <Typography
                        variant="caption"
                        sx={{
                            fontSize: '12px',
                            lineHeight: '150%',
                            letterSpacing: '0.3px',
                            color: 'rgba(0, 0, 0, 0.78)',
                            textAlign: 'center',
                            maxWidth: '60px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {chat.accountName}
                    </Typography>
                </Stack>
            )}

            {/* 말풍선 */}
            <Box
                sx={{
                    maxWidth: '700px',
                    p: '30px',
                    bgcolor: '#FFFFFF',
                    boxShadow: '0px 1px 6.8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '24px',
                    ...(isMyMessage && {alignSelf: 'flex-end'}),
                    '& .chat-message-editor': {
                        fontFamily: 'S-Core Dream',
                        fontSize: '16px',
                        lineHeight: '180%',
                        letterSpacing: '0.3px',
                        color: '#262626',
                        '& .chat-image': {
                            maxWidth: '100%',
                            height: 'auto',
                            borderRadius: '8px',
                            my: 1
                        },
                        '& .chat-video': {
                            my: 1
                        },
                        '& .mention': {
                            color: '#5A67D8',
                            fontWeight: '500',
                            padding: '2px 4px',
                            borderRadius: '4px'
                        }
                    }
                }}
            >
                <EditorContent editor={editor}/>
            </Box>

            {/* 오른쪽 메시지: 프로필 나중에 */}
            {isMyMessage && (
                <Stack alignItems="center" spacing={0.375} sx={{minWidth: '60px'}}>
                    <Avatar
                        sx={{
                            width: 36,
                            height: 36,
                            bgcolor: '#EADDFF',
                            color: '#4F378A',
                            fontSize: '14px'
                        }}
                    >
                        {chat.accountName[0]}
                    </Avatar>
                    <Typography
                        variant="caption"
                        sx={{
                            fontSize: '12px',
                            lineHeight: '150%',
                            letterSpacing: '0.3px',
                            color: 'rgba(0, 0, 0, 0.78)',
                            textAlign: 'center',
                            maxWidth: '60px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {chat.accountName}
                    </Typography>
                </Stack>
            )}

            {/* 멘션 클릭 시 발표 페이지 모달 */}
            {viewPresentationMember && (
                <PresentationViewModal
                    open={!!viewPresentationMember}
                    onClose={() => setViewPresentationMember(null)}
                    memberName={viewPresentationMember.memberName}
                    presentationId={presentations.find(
                        p => p.accountId === viewPresentationMember.memberId
                    )?.id}
                    members={members}
                />
            )}
        </Stack>
    );
}

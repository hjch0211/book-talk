import {useCallback, useEffect, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField} from '@mui/material';
import {EditorContent, useEditor} from '@tiptap/react';
import type {JSONContent} from '@tiptap/core';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Heading from '@tiptap/extension-heading';
import Placeholder from '@tiptap/extension-placeholder';
import {createSlashCommandExtension} from './SlashCommandExtension';
import {ChatInputBox, ChatInputContainer} from '../Debate.style';

interface ChatInputProps {
    canSend: boolean;
    isSending: boolean;
    onSend: (content: string) => void;
}

const hasSendableContent = (doc?: JSONContent | null): boolean => {
    if (!doc || !doc.content) return false;

    return doc.content.some((node) => {
        if (node.type === 'paragraph') {
            return node.content?.some((child) => {
                if (child.type !== 'text') {
                    return true;
                }
                return !!child.text?.trim();
            }) ?? false;
        }
        return true;
    });
};

/**
 * 채팅 입력 컴포넌트 (TipTap 에디터)
 * - 리치 텍스트 입력 (이미지, 유튜브 등)
 * - SlashCommand 지원
 * - Enter: 줄바꿈, Ctrl+Enter: 전송
 */
export function ChatInput({canSend, isSending, onSend}: ChatInputProps) {
    const [showYoutubeDialog, setShowYoutubeDialog] = useState(false);
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [showImageDialog, setShowImageDialog] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    // 에디터 콜백들
    const addImage = useCallback(() => {
        setShowImageDialog(true);
    }, []);

    const addYoutube = useCallback(() => {
        setShowYoutubeDialog(true);
    }, []);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({heading: false}),
            Heading.configure({levels: [1]}),
            Image.configure({HTMLAttributes: {class: 'chat-image'}}),
            Youtube.configure({HTMLAttributes: {class: 'chat-video'}, controls: false, nocookie: true}),
            Placeholder.configure({
                placeholder: canSend ? '메시지를 입력하세요... (Ctrl+Enter로 전송, / 를 입력하여 이미지/영상 추가)' : '발표자만 채팅할 수 있습니다'
            }),
            createSlashCommandExtension(addImage, addYoutube),
        ],
        editable: canSend && !isSending,
        immediatelyRender: false,
        editorProps: {
            attributes: {class: 'chat-input-editor'},
            handleKeyDown: (_view, event) => {
                // Ctrl+Enter: 전송, Enter: 줄바꿈 (기본 동작)
                if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
                    event.preventDefault();
                    handleSend();
                    return true;
                }
                return false;
            }
        },
    });

    // 동적으로 editable 상태 업데이트
    useEffect(() => {
        if (!editor) return;

        const shouldBeEditable = canSend && !isSending;

        if (editor.isEditable !== shouldBeEditable) {
            editor.setEditable(shouldBeEditable);
        }
    }, [editor, canSend, isSending]);

    const handleSend = useCallback(() => {
        if (!editor || !canSend || isSending) return;

        const json = editor.getJSON();
        if (!hasSendableContent(json)) return;

        // JSON을 문자열로 변환하여 전송
        onSend(JSON.stringify(json));

        // 에디터 내용 비우기
        editor.commands.clearContent();
    }, [editor, canSend, isSending, onSend]);

    const handleImageAdd = useCallback(() => {
        if (imageUrl && editor) {
            editor.chain().focus().setImage({src: imageUrl}).run();
        }
        setImageUrl('');
        setShowImageDialog(false);
    }, [editor, imageUrl]);

    const handleYoutubeAdd = useCallback(() => {
        if (youtubeUrl && editor) {
            editor.commands.setYoutubeVideo({
                src: youtubeUrl,
                width: 560,
                height: 315,
            });
        }
        setYoutubeUrl('');
        setShowYoutubeDialog(false);
    }, [editor, youtubeUrl]);

    return (
        <>
            <ChatInputContainer>
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="flex-end"
                    sx={{
                        width: '100%',
                        minHeight: '45px'
                    }}
                >
                    <IconButton
                        disabled={!canSend}
                        onClick={addImage}
                        sx={{
                            width: '72px',
                            height: '45px',
                            bgcolor: '#FFFFFF',
                            borderRadius: '24px',
                            '&:hover': {
                                bgcolor: '#F5F5F5'
                            },
                            '&:disabled': {
                                bgcolor: '#E9E9E9'
                            }
                        }}
                    >
                        <AttachFileIcon sx={{color: '#7B7B7B'}}/>
                    </IconButton>

                    <ChatInputBox>
                        <EditorContent editor={editor}/>
                    </ChatInputBox>

                    <IconButton
                        onClick={handleSend}
                        disabled={!canSend || isSending || !hasSendableContent(editor?.getJSON())}
                        sx={{
                            width: '72px',
                            height: '45px',
                            bgcolor: canSend && hasSendableContent(editor?.getJSON()) ? '#6366F1' : '#C4C4C4',
                            borderRadius: '24px',
                            '&:hover': {
                                bgcolor: canSend && hasSendableContent(editor?.getJSON()) ? '#4F46E5' : '#C4C4C4'
                            },
                            '&:disabled': {
                                bgcolor: '#C4C4C4'
                            }
                        }}
                    >
                        <SendIcon sx={{color: canSend && hasSendableContent(editor?.getJSON()) ? '#FFFFFF' : '#9D9D9D'}}/>
                    </IconButton>
                </Stack>
            </ChatInputContainer>

            {/* 이미지 추가 다이얼로그 */}
            <Dialog open={showImageDialog} onClose={() => setShowImageDialog(false)}>
                <DialogTitle>이미지 추가</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="이미지 URL"
                        type="url"
                        fullWidth
                        variant="outlined"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowImageDialog(false)}>취소</Button>
                    <Button onClick={handleImageAdd} variant="contained">추가</Button>
                </DialogActions>
            </Dialog>

            {/* YouTube 추가 다이얼로그 */}
            <Dialog open={showYoutubeDialog} onClose={() => setShowYoutubeDialog(false)}>
                <DialogTitle>YouTube 동영상 추가</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="YouTube URL"
                        type="url"
                        fullWidth
                        variant="outlined"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowYoutubeDialog(false)}>취소</Button>
                    <Button onClick={handleYoutubeAdd} variant="contained">추가</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

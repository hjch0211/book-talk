import {EditorContent, useEditor} from '@tiptap/react';
import {useCallback, useEffect, useState} from 'react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Heading from '@tiptap/extension-heading';
import Placeholder from '@tiptap/extension-placeholder';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from '@mui/material';
import {MainContent, PresentationArea} from '../Debate.style';
import {createSlashCommandExtension} from './SlashCommandExtension';
import {usePresentation} from "../../../hooks/usePresentation.tsx";
import type {CurrentRoundInfo} from '../../../hooks/useDebate';
import {LastModified} from './LastModified';
import {ChatMessageList} from './ChatMessageList';
import {ChatInput} from './ChatInput';

interface CurrentSpeaker {
    accountId: string;
    accountName: string;
    endedAt?: number;
}

interface Props {
    currentRoundInfo: CurrentRoundInfo;
    currentSpeaker?: CurrentSpeaker | null;
    debateId?: string;
    myAccountId?: string;
    onChatMessage?: (chatId: number) => void;
    chat: {
        chats: any[];
        sendChat: (content: string) => void;
        isSending: boolean;
    };
}

export function DebatePresentation({
                                       currentRoundInfo,
                                       currentSpeaker,
                                       debateId,
                                       myAccountId,
                                       onChatMessage,
                                       chat
                                   }: Props) {
    const [showYoutubeDialog, setShowYoutubeDialog] = useState(false);
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [showImageDialog, setShowImageDialog] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    // 발표 페이지 데이터 및 자동 저장 함수
    const {
        currentPresentation,
        autoSave,
        lastSavedAt,
        isSaving
    } = usePresentation(currentRoundInfo.currentPresentationId);

    // 에디터 콜백들
    const addImage = useCallback(() => {
        setShowImageDialog(true);
    }, []);

    const addYoutube = useCallback(() => {
        setShowYoutubeDialog(true);
    }, []);


    // TipTap 에디터 설정
    const editor = useEditor({
        extensions: [
            StarterKit.configure({heading: false}),
            Heading.configure({levels: [1]}),
            Image.configure({HTMLAttributes: {class: 'presentation-image'}}),
            Youtube.configure({HTMLAttributes: {class: 'presentation-video'}, controls: false, nocookie: true}),
            Placeholder.configure({
                placeholder: currentSpeaker
                    ? `${currentSpeaker.accountName}님이 발표 중입니다.`
                    : currentRoundInfo.isEditable
                        ? '이곳을 클릭해 발표페이지를 만들어보세요.\n발표페이지로 자신의 생각을 상대에게 더 명료하게 전달할 수 있어요!'
                        : '현재는 편집할 수 없습니다.'
            }),
            createSlashCommandExtension(addImage, addYoutube),
        ],
        editable: currentRoundInfo.isEditable && !currentSpeaker,
        immediatelyRender: false,
        editorProps: {attributes: {class: 'presentation-editor'}},
        onUpdate: ({editor: editorInstance}) => {
            if (!currentRoundInfo.isEditable || currentSpeaker) return;
            autoSave(editorInstance.getJSON());
        },
    });

    // presentation 데이터 로드시 에디터 내용 업데이트
    useEffect(() => {
        if (editor && currentPresentation?.content !== undefined) {
            const currentContent = editor.getJSON();
            if (JSON.stringify(currentContent) !== JSON.stringify(currentPresentation.content)) {
                // 현재 커서 위치 저장
                const {from, to} = editor.state.selection;

                editor.commands.setContent(JSON.parse(currentPresentation.content));

                // 커서 위치 복원
                editor.commands.setTextSelection({from, to});
            }
        }
    }, [editor, currentPresentation?.content]);


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

    // 채팅 기능 - props에서 받음
    const {chats, sendChat, isSending} = chat;

    // FREE 라운드 && 발표자 존재 → 채팅 모드
    const isChatMode = currentRoundInfo.type === 'FREE' && currentSpeaker && debateId && myAccountId && onChatMessage;

    if (isChatMode) {
        const canSend = currentSpeaker!.accountId === myAccountId;

        return (
            <>
                <MainContent>
                    <PresentationArea $isChatMode={true}>
                        <ChatMessageList
                            chats={chats}
                            myAccountId={myAccountId!}
                        />
                    </PresentationArea>
                </MainContent>
                <ChatInput
                    canSend={canSend}
                    isSending={isSending}
                    onSend={sendChat}
                />
            </>
        );
    }

    // 편집할 수 없는 라운드이거나 현재 발표자가 있으면 메시지 표시
    if (!currentRoundInfo.isEditable && !currentSpeaker) {
        return (
            <MainContent>
                <PresentationArea $isChatMode={false}>
                    <div>{`발표페이지가 없습니다.`}</div>
                </PresentationArea>
            </MainContent>
        );
    }

    // presentationId가 없으면 로딩 표시
    if (!currentRoundInfo.currentPresentationId) {
        return (
            <MainContent>
                <PresentationArea $isChatMode={false}>
                    <div>발표 페이지를 로딩 중...</div>
                </PresentationArea>
            </MainContent>
        );
    }

    return (
        <MainContent>
            <LastModified
                lastSavedAt={lastSavedAt}
                isEditable={currentRoundInfo.isEditable}
                isSaving={isSaving}
            />
            <PresentationArea $isChatMode={false}>
                <EditorContent editor={editor}/>

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
                    <DialogTitle>YouTube 추가</DialogTitle>
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
            </PresentationArea>
        </MainContent>
    );
}
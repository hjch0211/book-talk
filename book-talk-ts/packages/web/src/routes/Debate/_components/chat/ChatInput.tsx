import styled from '@emotion/styled';
import SendIcon from '@mui/icons-material/Send';
import { IconButton } from '@mui/material';
import FileUploadIcon from '@src/assets/file-upload.svg';
import { AppButton } from '@src/components/molecules/AppButton';
import { AppTextField } from '@src/components/molecules/AppTextField';
import Modal from '@src/components/organisms/Modal';
import type { JSONContent } from '@tiptap/core';
import Heading from '@tiptap/extension-heading';
import Placeholder from '@tiptap/extension-placeholder';
import Youtube from '@tiptap/extension-youtube';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { ChatInputBox, ChatInputContainer } from '../../style.ts';
import { createEnterToSendExtension } from '../editor/EnterToSendExtension.ts';
import { ImageWithPaste } from '../editor/ImageExtension.ts';
import { LinkPreview } from '../editor/LinkPreviewExtension.tsx';
import { createMentionExtension } from '../editor/MentionExtension.tsx';
import { createSlashCommandExtension } from '../editor/SlashCommandExtension.tsx';
import { PresentationViewModal } from '../modal/PresentationViewModal.tsx';

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 36px 48px 24px 48px;
  gap: 24px;
`;

const ModalButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

interface ChatInputProps {
  isSending: boolean;
  onSend: (content: string) => void;
  members: Array<{ id: string; name: string }>;
  presentations: Array<{ id: string; accountId: string }>;
}

const hasSendableContent = (doc?: JSONContent | null): boolean => {
  if (!doc || !doc.content) return false;

  return doc.content.some((node) => {
    if (node.type === 'paragraph') {
      return (
        node.content?.some((child) => {
          if (child.type !== 'text') {
            return true;
          }
          return !!child.text?.trim();
        }) ?? false
      );
    }
    return true;
  });
};

/**
 * 채팅 입력 컴포넌트 (TipTap 에디터)
 * - 리치 텍스트 입력 (이미지, 유튜브 등)
 * - SlashCommand 지원
 * - Mention 지원 (@참여자)
 * - Enter: 전송, Shift+Enter: 줄바꿈
 */
export function ChatInput({ isSending, onSend, members, presentations }: ChatInputProps) {
  const [showYoutubeDialog, setShowYoutubeDialog] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  // 멘션 클릭 시 모달 상태
  const [viewPresentationMember, setViewPresentationMember] = useState<{
    memberId: string;
    memberName: string;
  } | null>(null);

  // ref로 최신 값을 참조하도록 함 (Extension이 재생성되지 않도록)
  const stateRef = useRef({ isSending, onSend });

  // props가 변경될 때마다 ref 업데이트
  useEffect(() => {
    stateRef.current = { isSending, onSend };
  }, [isSending, onSend]);

  // 에디터 콜백들
  const addImage = useEffectEvent(() => {
    setShowImageDialog(true);
  });

  const addYoutube = useEffectEvent(() => {
    setShowYoutubeDialog(true);
  });

  // 멘션 클릭 핸들러
  const handleMentionClick = useEffectEvent((accountId: string) => {
    const member = members.find((m) => m.id === accountId);
    if (member) {
      setViewPresentationMember({
        memberId: member.id,
        memberName: member.name,
      });
    }
  });

  const editor = useEditor({
    extensions: [
      // Mention Extension (가장 먼저 추가)
      createMentionExtension(members, handleMentionClick),
      StarterKit.configure({ heading: false }),
      Heading.configure({ levels: [1] }),
      ImageWithPaste.configure({
        HTMLAttributes: { class: 'chat-image' },
        resize: {
          enabled: true,
          directions: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
          minWidth: 50,
          minHeight: 50,
          alwaysPreserveAspectRatio: false,
        },
      }),
      Youtube.configure({
        HTMLAttributes: { class: 'chat-video' },
        controls: false,
        nocookie: true,
        width: 720,
        height: 480,
      }),
      LinkPreview,
      Placeholder.configure({
        placeholder:
          '메시지를 입력하세요... (Enter로 전송, Shift+Enter로 줄바꿈, @로 멘션, /로 이미지/영상 추가)',
      }),
      createSlashCommandExtension(addImage, addYoutube),
      createEnterToSendExtension(stateRef), // SlashCommand 이후에 추가하여 낮은 우선순위
    ],
    editable: !isSending,
    immediatelyRender: false,
    editorProps: {
      attributes: { class: 'chat-input-editor' },
    },
  });

  // 동적으로 editable 상태 업데이트
  useEffect(() => {
    if (!editor) return;

    if (editor.isEditable !== !isSending) {
      editor.setEditable(!isSending);
    }
  }, [editor, isSending]);

  const handleSend = useEffectEvent(() => {
    if (!editor || isSending) return;

    const json = editor.getJSON();
    if (!hasSendableContent(json)) return;

    // JSON을 문자열로 변환하여 전송
    onSend(JSON.stringify(json));
    editor.commands.clearContent();

    // scrollIntoView가 완료된 후 포커스 (ChatMessageList의 smooth scroll 이후)
    setTimeout(() => {
      editor.commands.focus();
    }, 100);
  });

  const handleImageAdd = useEffectEvent(() => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
    }
    setImageUrl('');
    setShowImageDialog(false);
  });

  const handleYoutubeAdd = useEffectEvent(() => {
    if (youtubeUrl && editor) {
      editor.commands.setYoutubeVideo({
        src: youtubeUrl,
        width: 560,
        height: 315,
      });
    }
    setYoutubeUrl('');
    setShowYoutubeDialog(false);
  });

  const hasContent = useEditorState({
    editor,
    selector: (ctx) => hasSendableContent(ctx.editor?.getJSON()),
  });
  const canSend = !isSending && !!hasContent;

  return (
    <>
      <ChatInputContainer>
        <IconButton
          disabled={isSending}
          onClick={addImage}
          sx={{
            width: '72px',
            height: '45px',
            bgcolor: '#FFFFFF',
            borderRadius: '24px',
            '&:hover': {
              bgcolor: '#F5F5F5',
            },
            '&:disabled': {
              bgcolor: '#E9E9E9',
            },
          }}
        >
          <img src={FileUploadIcon} alt="파일 업로드" />
        </IconButton>

        <ChatInputBox>
          <EditorContent editor={editor} />
        </ChatInputBox>

        <IconButton
          onClick={handleSend}
          disabled={!canSend}
          sx={{
            width: '72px',
            height: '45px',
            bgcolor: canSend ? '#E8EBFF' : '#C4C4C4',
            borderRadius: '24px',
            '&:hover': {
              bgcolor: canSend ? '#D8DBFF' : '#C4C4C4',
            },
            '&:disabled': {
              bgcolor: '#C4C4C4',
            },
          }}
        >
          <SendIcon sx={{ color: canSend ? '#434343' : '#9D9D9D' }} />
        </IconButton>
      </ChatInputContainer>

      {/* 이미지 추가 모달 */}
      <Modal open={showImageDialog} onClose={() => setShowImageDialog(false)} inner width={600}>
        <ModalContent>
          <AppTextField
            autoFocus
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="이미지 링크를 복사해주세요"
          />
          <ModalButtonRow>
            <AppButton appVariant="outlined" onClick={() => setShowImageDialog(false)}>
              취소
            </AppButton>
            <AppButton onClick={handleImageAdd}>추가</AppButton>
          </ModalButtonRow>
        </ModalContent>
      </Modal>

      {/* YouTube 추가 모달 */}
      <Modal open={showYoutubeDialog} onClose={() => setShowYoutubeDialog(false)} inner width={600}>
        <ModalContent>
          <AppTextField
            autoFocus
            type="url"
            fullWidth
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="유튜브 링크를 입력해주세요"
          />
          <ModalButtonRow>
            <AppButton appVariant="outlined" onClick={() => setShowYoutubeDialog(false)}>
              취소
            </AppButton>
            <AppButton onClick={handleYoutubeAdd}>추가</AppButton>
          </ModalButtonRow>
        </ModalContent>
      </Modal>

      {/* 멘션 클릭 시 발표 페이지 모달 */}
      {viewPresentationMember && (
        <PresentationViewModal
          open={!!viewPresentationMember}
          onClose={() => setViewPresentationMember(null)}
          memberName={viewPresentationMember.memberName}
          presentationId={
            presentations.find((p) => p.accountId === viewPresentationMember.memberId)?.id
          }
          members={members}
        />
      )}
    </>
  );
}

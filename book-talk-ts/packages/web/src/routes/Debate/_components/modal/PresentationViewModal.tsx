import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Modal as MuiModal, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { usePresentation } from '@src/hooks';
import Heading from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import { LinkPreview } from '../editor/LinkPreviewExtension.tsx';
import { createMentionExtension } from '../editor/MentionExtension.tsx';

interface Props {
  open: boolean;
  onClose: () => void;
  memberName: string;
  presentationId?: string;
  members?: Array<{ id: string; name: string }>;
}

const ModalContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px 80px 80px;
    position: relative;
    width: 1020px;
    background: #FFFFFF;
    box-shadow: 0px 2px 50px 10px #7B7B7B;
    border-radius: 24px;
    outline: none;
    overflow-y: auto;
    overflow-x: hidden;

    /* Hide scrollbar for Chrome, Safari and Opera */

    &::-webkit-scrollbar {
        display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const ModalHeader = styled(Box)`
    position: sticky;
    top: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 40px 0px 32px;
    isolation: isolate;
    width: 1020px;
    height: 96px;
    margin: 0 -80px;
    background: linear-gradient(180deg, #F7F8FF 70.84%, rgba(247, 248, 255, 0) 100%);
    border-radius: 24px 24px 0px 0px;
    flex: none;
    order: 0;
    flex-grow: 0;
    z-index: 10;
`;

const ModalTitle = styled(Typography)`
    height: 24px;
    font-family: 'S-Core Dream';
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 1px;
    color: #555555;
    flex: none;
    order: 0;
    flex-grow: 0;
    z-index: 0;
`;

const CloseButton = styled(IconButton)`
    position: absolute;
    width: 24px;
    height: 24px;
    top: 20px;
    right: 20px;
    padding: 0;
    color: #7B7B7B;
    flex: none;
    order: 1;
    flex-grow: 0;
    z-index: 10;
`;

const EditorContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 70px 0px 0px;
    width: 860px;
    height: 594px;
    overflow-y: auto;
    overflow-x: hidden;
    flex: none;
    order: 1;
    flex-grow: 0;

    /* Hide scrollbar for Chrome, Safari and Opera */

    &::-webkit-scrollbar {
        display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none;
    scrollbar-width: none;

    .presentation-editor {
        outline: none;
        font-family: 'S-Core Dream';
        font-style: normal;
        font-weight: 200;
        font-size: 18px;
        line-height: 180%;
        letter-spacing: 0.3px;
        color: #262626;

        h1 {
            font-size: 32px;
            font-weight: 600;
            margin-bottom: 16px;
            color: #262626;
        }

        p {
            font-size: 18px;
            line-height: 180%;
            letter-spacing: 0.3px;
            color: #262626;
            margin-bottom: 12px;
        }

        .presentation-image {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 16px 0;
        }

        .presentation-video {
            margin: 16px 0;
            border-radius: 8px;
            overflow: hidden;
        }
    }
`;

export function PresentationViewModal({
  open,
  onClose,
  memberName,
  presentationId,
  members = [],
}: Props) {
  const { currentPresentation, isLoading } = usePresentation({ presentationId });

  const editor = useEditor({
    extensions: [
      // Mention Extension for read-only mode (no click handler, editable=false)
      createMentionExtension(members, undefined, false),
      StarterKit.configure({ heading: false }),
      Heading.configure({ levels: [1] }),
      Image.configure({ HTMLAttributes: { class: 'presentation-image' } }),
      Youtube.configure({
        addPasteHandler: true, // YouTube URL 자동 감지 활성화
        HTMLAttributes: { class: 'presentation-video' },
        controls: false,
        nocookie: true,
        width: 720,
        height: 480,
      }),
      LinkPreview,
    ],
    editable: false,
    immediatelyRender: false,
    editorProps: { attributes: { class: 'presentation-editor' } },
  });

  // presentation 데이터 로드시 에디터 내용 업데이트
  useEffect(() => {
    if (editor && currentPresentation?.content) {
      try {
        const content = JSON.parse(currentPresentation.content);
        editor.commands.setContent(content);
      } catch (error) {
        console.error('Failed to parse presentation content:', error);
      }
    }
  }, [editor, currentPresentation?.content]);

  return (
    <MuiModal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>{memberName}님의 발표페이지</ModalTitle>
        </ModalHeader>
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
        <EditorContainer>
          {isLoading ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}
            >
              <Typography>로딩 중...</Typography>
            </Box>
          ) : (
            <EditorContent editor={editor} />
          )}
        </EditorContainer>
      </ModalContainer>
    </MuiModal>
  );
}

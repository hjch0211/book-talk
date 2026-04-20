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

const ModalContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0 80px 80px',
  position: 'relative',
  width: '1020px',
  maxHeight: 'calc(100dvh - 80px)',
  background: '#FFFFFF',
  boxShadow: '0 2px 50px 10px #7B7B7B',
  borderRadius: '24px',
  outline: 'none',
  overflowY: 'auto',
  overflowX: 'hidden',
  '&::-webkit-scrollbar': { display: 'none' },
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  [theme.breakpoints.down('md')]: {
    width: '94vw',
    padding: '0 20px 40px',
    maxHeight: 'calc(100dvh - 120px)',
    borderRadius: '16px',
  },
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '40px 0 32px',
  isolation: 'isolate',
  width: 'calc(100% + 160px)',
  height: '96px',
  margin: '0 -80px',
  background: 'linear-gradient(180deg, #F7F8FF 70.84%, rgba(247, 248, 255, 0) 100%)',
  borderRadius: '24px 24px 0 0',
  flexShrink: 0,
  zIndex: 10,
  [theme.breakpoints.down('md')]: {
    width: 'calc(100% + 40px)',
    height: 'auto',
    margin: '0 -20px',
    padding: '20px 0 16px',
    borderRadius: '16px 16px 0 0',
  },
}));

const ModalTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'S-Core Dream', serif",
  fontWeight: 500,
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'center',
  letterSpacing: '1px',
  color: '#555555',
  zIndex: 0,
  [theme.breakpoints.down('md')]: {
    fontSize: '14px',
  },
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  width: 24,
  height: 24,
  top: 20,
  right: 20,
  padding: 0,
  color: '#7B7B7B',
  zIndex: 10,
  [theme.breakpoints.down('md')]: {
    top: 14,
    right: 14,
  },
}));

const EditorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '70px 0 0',
  width: '860px',
  height: '594px',
  overflowY: 'auto',
  overflowX: 'hidden',
  flexShrink: 0,
  '&::-webkit-scrollbar': { display: 'none' },
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  '.presentation-editor': {
    outline: 'none',
    fontFamily: "'S-Core Dream', serif",
    fontWeight: 200,
    fontSize: '18px',
    lineHeight: '180%',
    letterSpacing: '0.3px',
    color: '#262626',
    h1: {
      fontSize: '32px',
      fontWeight: 600,
      marginBottom: '16px',
      color: '#262626',
    },
    p: {
      fontSize: '18px',
      lineHeight: '180%',
      letterSpacing: '0.3px',
      color: '#262626',
      marginBottom: '12px',
    },
    '.presentation-image': {
      maxWidth: '100%',
      height: 'auto',
      borderRadius: '8px',
      margin: '16px 0',
    },
    '.presentation-video': {
      margin: '16px 0',
      borderRadius: '8px',
      overflow: 'hidden',
    },
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    minHeight: '80%',
    padding: '50px 0 0',
    '.presentation-editor': {
      fontSize: '15px',
      h1: { fontSize: '22px' },
      p: { fontSize: '15px' },
    },
  },
}));

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
      createMentionExtension(members, undefined),
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
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'center',
        paddingTop: { xs: '60px', md: '0' },
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

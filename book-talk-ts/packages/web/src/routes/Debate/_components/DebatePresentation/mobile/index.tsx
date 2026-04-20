import type { CurrentRoundInfo } from '@src/hooks';
import { usePresentation } from '@src/hooks';
import Heading from '@tiptap/extension-heading';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback, useEffect } from 'react';
import { LastModified } from '../../LastModified.tsx';
import { MobileBody, MobileLastModifiedRow, MobilePaper } from '../style.ts';

interface Props {
  currentRoundInfo: CurrentRoundInfo;
}

export function MobilePresentation({ currentRoundInfo }: Props) {
  const { currentPresentation, autoSave, lastSavedAt, isSaving } = usePresentation({
    presentationId: currentRoundInfo.currentPresentationId,
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      Heading.configure({ levels: [1] }),
      Placeholder.configure({
        placeholder: currentRoundInfo.currentSpeaker
          ? `${currentRoundInfo.currentSpeaker.accountName}님이 발표 중입니다.`
          : currentRoundInfo.isEditable
            ? '이곳을 클릭해 발표페이지를 만들어보세요.\n발표페이지로 자신의 생각을 상대에게 더 명료하게 전달할 수 있어요!'
            : '현재는 편집할 수 없습니다.',
      }),
    ],
    editable: currentRoundInfo.isEditable,
    immediatelyRender: false,
    editorProps: { attributes: { class: 'presentation-editor' } },
    onUpdate: ({ editor: editorInstance }) => {
      if (!currentRoundInfo.isEditable || currentRoundInfo.currentSpeaker) return;
      autoSave(editorInstance.getJSON());
    },
  });

  useEffect(() => {
    editor?.setEditable(currentRoundInfo.isEditable);
  }, [currentRoundInfo.isEditable, editor]);

  useEffect(() => {
    if (editor && currentPresentation?.content !== undefined) {
      const currentContent = editor.getJSON();
      if (JSON.stringify(currentContent) !== JSON.stringify(currentPresentation.content)) {
        const { from, to } = editor.state.selection;
        editor.commands.setContent(JSON.parse(currentPresentation.content));
        editor.commands.setTextSelection({ from, to });
      }
    }
  }, [editor, currentPresentation?.content]);

  const handlePaperClick = useCallback(() => {
    if (editor && currentRoundInfo.isEditable && !currentRoundInfo.currentSpeaker) {
      editor.commands.focus();
    }
  }, [editor, currentRoundInfo.isEditable, currentRoundInfo.currentSpeaker]);

  return (
    <MobileBody>
      <MobileLastModifiedRow>
        <LastModified
          lastSavedAt={lastSavedAt}
          isEditable={currentRoundInfo.isEditable}
          isSaving={isSaving}
        />
      </MobileLastModifiedRow>
      <MobilePaper onClick={handlePaperClick}>
        <EditorContent editor={editor} />
      </MobilePaper>
    </MobileBody>
  );
}

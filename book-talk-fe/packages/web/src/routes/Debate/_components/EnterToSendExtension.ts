import { Extension } from '@tiptap/core';
import type { JSONContent } from '@tiptap/core';

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

interface EnterToSendOptions {
    onSend: (content: string) => void;
    canSend: () => boolean;
    isSending: () => boolean;
}

/**
 * Enter 키로 채팅 전송을 처리하는 Extension
 * priority를 낮게 설정하여 SlashCommand가 먼저 처리되도록 함
 */
export const createEnterToSendExtension = (options: EnterToSendOptions) => Extension.create<EnterToSendOptions>({
  name: 'enterToSend',

  // 낮은 priority로 설정 (기본값은 100)
  priority: 50,

  addOptions() {
    return options;
  },

  addKeyboardShortcuts() {
    return {
      'Enter': () => {
        // SlashCommand가 활성화되어 있지 않을 때만 실행됨
        const { onSend, canSend, isSending } = this.options;

        if (!canSend() || isSending()) return false;

        const json = this.editor.getJSON();
        if (!hasSendableContent(json)) return false;

        // JSON을 문자열로 변환하여 전송
        onSend(JSON.stringify(json));
        this.editor.commands.clearContent();

        // scrollIntoView가 완료된 후 포커스
        setTimeout(() => {
          this.editor.commands.focus();
        }, 100);

        return true;
      },
      // Shift+Enter는 기본 동작 (줄바꿈)
      'Shift-Enter': () => false,
    };
  },
});
import type {JSONContent} from '@tiptap/core';
import {Extension} from '@tiptap/core';

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
 * Enter 키로 채팅 전송을 처리하는 Extension
 * priority를 SlashCommand(200)보다 낮고 StarterKit(100)보다 높게 설정
 * ref를 사용하여 항상 최신 상태를 참조
 */
export const createEnterToSendExtension = (stateRef: React.RefObject<{
    isSending: boolean;
    onSend: (content: string) => void
}>) => Extension.create({
    name: 'enterToSend',

    // StarterKit(100)보다 높고 SlashCommand(200)보다 낮게 설정
    priority: 150,

    addKeyboardShortcuts() {
        return {
            'Enter': () => {
                // SlashCommand가 활성화되어 있지 않을 때만 실행됨
                const {onSend, isSending} = stateRef.current;
                if (isSending) return false;

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
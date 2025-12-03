import { Extension } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import Suggestion from '@tiptap/suggestion';
import tippy from 'tippy.js';
import { SlashCommands } from './SlashCommands.tsx';

export interface SlashCommandItem {
  title: string;
  description: string;
  command: ({ editor, range }: any) => void;
}

export const createSlashCommandExtension = (addImage: () => void, addYoutube: () => void) => {
  const items: SlashCommandItem[] = [
    {
      title: '/h1',
      description: '큰 제목 추가',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run();
      },
    },
    {
      title: '/img',
      description: '이미지 추가',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).run();
        addImage();
      },
    },
    {
      title: '/youtube',
      description: 'YouTube 추가',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).run();
        addYoutube();
      },
    },
    {
      title: '/bold',
      description: '굵은 텍스트',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setMark('bold').run();
      },
    },
    {
      title: '/italic',
      description: '기울임 텍스트',
      command: ({ editor, range }) => {
        editor.chain().focus().deleteRange(range).setMark('italic').run();
      },
    },
  ];

  return Extension.create({
    name: 'slashCommands',

    // 높은 priority 설정 (기본값 100보다 높게)
    priority: 200,

    addOptions() {
      return {
        suggestion: {
          char: '/',
          command: ({ editor, range, props }: any) => {
            props.command({ editor, range });
          },
        },
      };
    },

    addProseMirrorPlugins() {
      return [
        Suggestion({
          editor: this.editor,
          ...this.options.suggestion,
        }),
      ];
    },
  }).configure({
    suggestion: {
      items: ({ query }: { query: string }) => {
        return items
          .filter((item) => item.title.toLowerCase().startsWith(query.toLowerCase()))
          .slice(0, 10);
      },

      render: () => {
        let component: ReactRenderer;
        let popup: any;

        return {
          onStart: (props: any) => {
            component = new ReactRenderer(SlashCommands, {
              props,
              editor: props.editor,
            });

            if (!props.clientRect) {
              return;
            }

            popup = tippy('body', {
              getReferenceClientRect: props.clientRect,
              appendTo: () => document.body,
              content: component.element,
              showOnCreate: true,
              interactive: true,
              trigger: 'manual',
              placement: 'bottom-start',
            });
          },

          onUpdate(props: any) {
            component.updateProps(props);

            if (!props.clientRect) {
              return;
            }

            popup[0].setProps({
              getReferenceClientRect: props.clientRect,
            });
          },

          onKeyDown(props: any) {
            if (props.event.key === 'Escape') {
              popup[0].hide();
              return true;
            }

            return component.ref?.onKeyDown(props);
          },

          onExit() {
            popup[0].destroy();
            component.destroy();
          },
        };
      },
    },
  });
};

import Mention from '@tiptap/extension-mention';
import {ReactRenderer} from '@tiptap/react';
import {mergeAttributes} from '@tiptap/core';
import type {Instance} from 'tippy.js';
import tippy from 'tippy.js';
import {MentionList} from './MentionList';

/**
 * Tiptap Mention Extension
 *
 * 토론 참여자를 @멘션할 수 있는 기능을 제공합니다.
 *
 * Features:
 * - @ 입력 시 참여자 목록 표시
 * - 실시간 검색 필터링
 * - 키보드 네비게이션 (Arrow Up/Down, Enter)
 * - 클릭 시 발표 페이지 모달 오픈
 *
 * @param members - 토론 참여자 목록
 * @param onMentionClick - 멘션 클릭 시 콜백 (제공되면 클릭 가능)
 * @param editable - 편집 가능 여부 (false면 @ 입력 불가, 클릭은 가능)
 */
export const createMentionExtension = (
    members: Array<{ id: string; name: string }>,
    onMentionClick?: (accountId: string) => void,
    editable = true
) => {
    return Mention.extend({
        // SlashCommand와 동일한 우선순위 설정 (EnterToSend보다 높음)
        // Priority: Mention(200) > EnterToSend(150) > StarterKit(100)
        priority: 200,
    }).configure({
        HTMLAttributes: {
            class: 'mention',
        },
        // 텍스트로 표시할 때 사용 (예: 일반 텍스트 export)
        renderText({node}: any) {
            return `@${node.attrs.label ?? node.attrs.id}`;
        },
        // HTML 요소로 렌더링 (Tiptap 공식 방법)
        renderHTML({node, HTMLAttributes}: any) {
            return [
                'span',
                mergeAttributes(HTMLAttributes, {
                    'data-type': 'mention',
                    'data-id': node.attrs.id,
                    'data-label': node.attrs.label,
                }),
                `@${node.attrs.label ?? node.attrs.id}`,
            ];
        },
        suggestion: {
            // 멘션 트리거 문자
            char: '@',
            // 검색 항목 필터링
            items: ({query}: { query: string }) => {
                return members
                    .filter(member =>
                        member.name.toLowerCase().includes(query.toLowerCase())
                    )
                    .slice(0, 5); // 최대 5명까지만 표시
            },
            // 멘션 선택 시 실행되는 command (label을 명시적으로 전달)
            command: ({editor, range, props}: any) => {
                editor
                    .chain()
                    .focus()
                    .insertContentAt(range, [
                        {
                            type: 'mention',
                            attrs: {
                                id: props.id,
                                label: props.name, // name을 label로 저장
                            },
                        },
                    ])
                    .run();
            },
            // Suggestion UI 렌더링
            render: () => {
                let component: ReactRenderer;
                let popup: Instance[];

                return {
                    onStart: (props: any) => {
                        component = new ReactRenderer(MentionList, {
                            props,
                            editor: props.editor,
                        });

                        if (!props.clientRect) {
                            return;
                        }

                        popup = tippy('body', {
                            getReferenceClientRect: props.clientRect as any,
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
                            getReferenceClientRect: props.clientRect as any,
                        });
                    },
                    onKeyDown(props: any) {
                        if (props.event.key === 'Escape') {
                            popup[0].hide();
                            return true;
                        }

                        return component.ref?.onKeyDown(props) || false;
                    },
                    onExit() {
                        popup[0].destroy();
                        component.destroy();
                    },
                };
            },
        },
    }).extend({
        // 클릭 가능한 NodeView 추가 (이미 위에서 priority 설정됨)
        addNodeView() {
            return ({node}: any) => {
                const span = document.createElement('span');
                span.className = 'mention';
                span.setAttribute('data-type', 'mention');
                span.setAttribute('data-id', node.attrs.id);
                span.setAttribute('data-label', node.attrs.label);
                span.textContent = `@${node.attrs.label}`;

                // 클릭 핸들러가 있으면 클릭 가능하게 설정 (editable 여부 무관)
                if (onMentionClick) {
                    span.style.cursor = 'pointer';
                    span.style.color = '#5A67D8';
                    span.style.fontWeight = '500';

                    span.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onMentionClick(node.attrs.id);
                    });
                } else {
                    // 클릭 핸들러가 없는 경우
                    span.style.color = '#5A67D8';
                    span.style.fontWeight = '500';
                }

                return {
                    dom: span,
                };
            };
        },
    });
};

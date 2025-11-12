import {mergeAttributes, Node, nodePasteRule} from '@tiptap/core';
import {ReactNodeViewRenderer} from '@tiptap/react';
import {LinkPreviewNode} from './LinkPreviewNode.tsx';

/**
 * URL 패턴 정규식
 * - http(s)로 시작하는 모든 URL 매칭
 * - Priority가 낮아서 ImageWithPaste와 Youtube extension이 먼저 처리하고 남은 URL만 받음
 */
const URL_REGEX = /https?:\/\/[^\s]+/gi;

export const LinkPreview = Node.create({
    name: 'linkPreview',

    group: 'block',

    atom: true,

    addAttributes() {
        return {
            url: {
                default: null,
                parseHTML: element => element.getAttribute('data-url'),
                renderHTML: attributes => ({
                    'data-url': attributes.url,
                }),
            },
            title: {
                default: null,
                parseHTML: element => element.getAttribute('data-title'),
                renderHTML: attributes => ({
                    'data-title': attributes.title,
                }),
            },
            description: {
                default: null,
                parseHTML: element => element.getAttribute('data-description'),
                renderHTML: attributes => ({
                    'data-description': attributes.description,
                }),
            },
            image: {
                default: null,
                parseHTML: element => element.getAttribute('data-image'),
                renderHTML: attributes => ({
                    'data-image': attributes.image,
                }),
            },
            siteName: {
                default: null,
                parseHTML: element => element.getAttribute('data-site-name'),
                renderHTML: attributes => ({
                    'data-site-name': attributes.siteName,
                }),
            },
            type: {
                default: null,
                parseHTML: element => element.getAttribute('data-type'),
                renderHTML: attributes => ({
                    'data-type': attributes.type,
                }),
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-link-preview]',
            },
        ];
    },

    renderHTML({HTMLAttributes}) {
        return ['div', mergeAttributes({'data-link-preview': ''}, HTMLAttributes)];
    },

    addNodeView() {
        return ReactNodeViewRenderer(LinkPreviewNode);
    },

    addPasteRules() {
        return [
            nodePasteRule({
                find: URL_REGEX,
                type: this.type,
                getAttributes: (match) => {
                    const url = match[0];
                    console.log('[LinkPreview] Matched general URL:', url);
                    // Extension 배열 순서상 ImageWithPaste, Youtube보다 나중에 실행되므로
                    // 여기 도달한 URL은 일반 URL임
                    return {
                        url: url,
                    };
                },
            }),
        ];
    },
});

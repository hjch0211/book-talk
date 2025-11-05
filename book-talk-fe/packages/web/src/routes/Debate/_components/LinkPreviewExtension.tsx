import {mergeAttributes, Node, nodePasteRule} from '@tiptap/core';
import {ReactNodeViewRenderer} from '@tiptap/react';
import {LinkPreviewNode} from './LinkPreviewNode';

/**
 * URL 패턴 정규식 (이미지 URL 제외)
 * - http(s)로 시작하는 URL
 * - 이미지 확장자로 끝나지 않는 URL만 매칭
 */
const URL_REGEX = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*(?<!\.(?:jpg|jpeg|png|gif|webp|svg|bmp|ico)))(?:\?[^\s]*)?/gi;

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
                    return {
                        url: match[0],
                    };
                },
            }),
        ];
    },
});

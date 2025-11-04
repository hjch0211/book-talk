import Image from '@tiptap/extension-image';
import { nodePasteRule } from '@tiptap/core';

/**
 * 이미지 URL 패턴 정규식
 * - http(s)로 시작
 * - .jpg, .jpeg, .png, .gif, .webp, .svg 등으로 끝나는 URL
 */
const IMAGE_URL_REGEX = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*\.(?:jpg|jpeg|png|gif|webp|svg|bmp|ico))(?:\?[^\s]*)?/gi;

/**
 * Image extension with auto-paste handler
 * URL을 붙여넣으면 자동으로 이미지 블록으로 변환
 */
export const ImageWithPaste = Image.extend({
  addPasteRules() {
    return [
      nodePasteRule({
        find: IMAGE_URL_REGEX,
        type: this.type,
        getAttributes: (match) => {
          return { src: match[0] };
        },
      }),
    ];
  },
});

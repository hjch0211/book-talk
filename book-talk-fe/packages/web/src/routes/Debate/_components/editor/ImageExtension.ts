import Image from '@tiptap/extension-image';
import { nodePasteRule } from '@tiptap/core';

/**
 * 이미지 URL 패턴 정규식
 * - HTTP(S) URL: http(s)로 시작하고 이미지 확장자로 끝나는 URL
 * - Data URL: data:image/... 형태의 base64 인코딩된 이미지
 * - 쿼리 파라미터도 지원 (예: ?width=500)
 *
 * 매칭 예시:
 * - https://example.com/image.jpg
 * - https://example.com/path/to/image.png?size=large
 * - http://cdn.example.com/assets/photo.webp
 * - data:image/jpeg;base64,/9j/4AAQSkZJRg...
 * - data:image/png;base64,iVBORw0KGgo...
 */
const IMAGE_URL_REGEX = /(?:https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|webp|svg|bmp|ico)(?:\?[^\s]*)?|data:image\/(?:jpeg|jpg|png|gif|webp|svg|bmp|ico);base64,[^\s]+)/gi;

/**
 * Image extension with auto-paste handler
 * URL을 붙여넣으면 자동으로 이미지 블록으로 변환
 *
 * IMPORTANT: 이 extension은 반드시 StarterKit의 Link extension보다 먼저 등록되어야 합니다.
 * Extension 배열의 순서가 paste rule 실행 순서를 결정합니다.
 */
export const ImageWithPaste = Image.extend({
  addPasteRules() {
    return [
      nodePasteRule({
        find: IMAGE_URL_REGEX,
        type: this.type,
        getAttributes: (match) => {
          const src = match[0];
          console.log('[ImageWithPaste] Matched image URL:', src);
          return { src };
        },
      }),
    ];
  },
});

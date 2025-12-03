import { css, Global } from '@emotion/react';

/**
 * @name baseStyles
 * @description 기본 리셋 및 body 스타일
 */
const baseStyles = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    min-height: 100vh;
  }
`;

/**
 * @name tiptapStyles
 * @description Tiptap 에디터 전용 스타일
 * @external @tiptap/react
 */
const tiptapStyles = css`
  /* Resize handles */
  [data-resize-handle] {
    position: absolute;
    width: 12px;
    height: 12px;
    background: #3b82f6;
    border: 2px solid white;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    z-index: 10;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  /* Corner handles */
  [data-resize-handle='top-left'] {
    top: -6px;
    left: -6px;
    cursor: nwse-resize;
  }

  [data-resize-handle='top-right'] {
    top: -6px;
    right: -6px;
    cursor: nesw-resize;
  }

  [data-resize-handle='bottom-left'] {
    bottom: -6px;
    left: -6px;
    cursor: nesw-resize;
  }

  [data-resize-handle='bottom-right'] {
    bottom: -6px;
    right: -6px;
    cursor: nwse-resize;
  }

  /* Edge handles */
  [data-resize-handle='top'] {
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    cursor: ns-resize;
  }

  [data-resize-handle='bottom'] {
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    cursor: ns-resize;
  }

  [data-resize-handle='left'] {
    left: -6px;
    top: 50%;
    transform: translateY(-50%);
    cursor: ew-resize;
  }

  [data-resize-handle='right'] {
    right: -6px;
    top: 50%;
    transform: translateY(-50%);
    cursor: ew-resize;
  }

  /* Show handles on hover */
  [data-node-view-wrapper]:hover [data-resize-handle],
  .ProseMirror-selectednode [data-resize-handle] {
    opacity: 1;
  }

  /* Active resizing state */
  [data-resize-state='resizing'] {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  [data-resize-state='resizing'] [data-resize-handle] {
    opacity: 1;
    background: #2563eb;
  }

  /* Prevent text selection during resize */
  [data-resize-state='resizing'],
  [data-resize-state='resizing'] * {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
  }

  /* Image and iframe styling */
  .ProseMirror img,
  .ProseMirror iframe {
    max-width: 100%;
    height: auto;
    display: block;
  }

  .ProseMirror img.chat-image,
  .ProseMirror img.presentation-image {
    border-radius: 8px;
  }

  .ProseMirror iframe.chat-video,
  .ProseMirror iframe.presentation-video {
    border-radius: 8px;
  }
`;

export const BaseGlobalStyle = () => <Global styles={baseStyles} />;
export const TiptapGlobalStyle = () => <Global styles={tiptapStyles} />;

import { useEffect, useRef } from 'react';
import {
  LogAvatar,
  LogBubble,
  LogContainer,
  LogEmpty,
  LogRow,
  TypingBubble,
  TypingDot,
} from './style';

const MARKDOWN_CHARS = /[*_#`~>|\\]/g;

function filterText(text: string): string {
  return text
    .split('')
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return code > 31 && code !== 127;
    })
    .join('')
    .replace(MARKDOWN_CHARS, '');
}

export type LogEntry = {
  role: 'user' | 'agent';
  text: string;
};

interface Props {
  entries: LogEntry[];
  mode: 'idle' | 'speaking' | 'listening' | 'connecting';
}

export function ConversationLog({ entries, mode }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (entries.length === 0 && mode === 'idle') return;
    let container: HTMLElement | null = bottomRef.current?.parentElement ?? null;
    while (container) {
      const { overflowY } = window.getComputedStyle(container);
      if (overflowY === 'auto' || overflowY === 'scroll') {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        return;
      }
      container = container.parentElement;
    }
  }, [entries, mode]);

  return (
    <LogContainer>
      {entries.length === 0 && mode === 'idle' && (
        <LogEmpty>
          {
            '\uB9C8\uC774\uD06C \uBC84\uD2BC\uC744 \uB180\uB7EC\n\uB300\uD654\uB97C \uC2DC\uC791\uD574\uBCF4\uC138\uC694'
          }
        </LogEmpty>
      )}

      {entries.map((entry, i) => (
        <LogRow key={`${i + 1}`} $role={entry.role}>
          {entry.role === 'agent' && <LogAvatar $role="agent">AI</LogAvatar>}
          <LogBubble $role={entry.role}>{filterText(entry.text)}</LogBubble>
          {entry.role === 'user' && <LogAvatar $role="user">나</LogAvatar>}
        </LogRow>
      ))}

      {mode === 'listening' && entries.length > 2 && (
        <LogRow $role="user">
          <TypingBubble $role="user">
            <TypingDot />
            <TypingDot />
            <TypingDot />
          </TypingBubble>
          <LogAvatar $role="user">나</LogAvatar>
        </LogRow>
      )}

      {mode === 'speaking' && (
        <LogRow $role="agent">
          <LogAvatar $role="agent">AI</LogAvatar>
          <TypingBubble $role="agent">
            <TypingDot />
            <TypingDot />
            <TypingDot />
          </TypingBubble>
        </LogRow>
      )}

      <div ref={bottomRef} />
    </LogContainer>
  );
}

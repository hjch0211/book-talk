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
        <LogEmpty>{'마이크 버튼을 눌러\n대화를 시작해보세요'}</LogEmpty>
      )}

      {entries.map((entry, i) => (
        <LogRow key={`${i + 1}`} $role={entry.role}>
          {entry.role === 'agent' && <LogAvatar $role="agent">AI</LogAvatar>}
          <LogBubble $role={entry.role}>{entry.text}</LogBubble>
          {entry.role === 'user' && <LogAvatar $role="user">나</LogAvatar>}
        </LogRow>
      ))}

      {mode === 'listening' && (
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

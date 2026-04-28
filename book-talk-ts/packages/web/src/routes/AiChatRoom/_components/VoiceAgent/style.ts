import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

export const AgentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 28px 0 20px;
`;


export const MicButton = styled.button`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.35);
  position: relative;
  z-index: 1;

  &:hover {
    box-shadow: 0 6px 28px rgba(99, 102, 241, 0.5);
  }
`;

export const StatusLabel = styled.span<{ $mode: 'idle' | 'speaking' | 'listening' | 'connecting' }>`
  font-family: 'S-Core Dream', sans-serif;
  font-weight: 300;
  font-size: 12px;
  letter-spacing: 0.5px;
  color: ${({ $mode }) => ($mode === 'idle' ? '#9ca3af' : '#6366f1')};
  transition: color 0.3s ease;
`;

export const Divider = styled.div`
  width: calc(100% - 120px);
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(200,210,240,0.5) 20%, rgba(200,210,240,0.5) 80%, transparent 100%);
  margin: 0 60px;
`;

// ── ConversationLog ──────────────────────────────────────────

export const LogPanelHeader = styled.div`
  padding: 20px 16px 12px;
  font-family: 'S-Core Dream', sans-serif;
  font-weight: 500;
  font-size: 12px;
  letter-spacing: 0.8px;
  color: #9ca3af;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(200, 210, 240, 0.35);
  flex-shrink: 0;
`;

export const LogContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 14px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb {
    background: rgba(142, 153, 255, 0.25);
    border-radius: 2px;
  }
`;

export const LogEmpty = styled.p`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  white-space: pre-line;
  color: #d1d5db;
  font-family: 'S-Core Dream', sans-serif;
  font-weight: 300;
  font-size: 12px;
  line-height: 1.7;
  margin: 0;
`;

export const LogRow = styled.div<{ $role: 'user' | 'agent' }>`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  justify-content: ${({ $role }) => ($role === 'user' ? 'flex-end' : 'flex-start')};
`;

export const LogAvatar = styled.div<{ $role: 'user' | 'agent' }>`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'S-Core Dream', sans-serif;
  font-weight: 500;
  font-size: 9px;
  letter-spacing: 0.2px;
  background: ${({ $role }) =>
    $role === 'agent' ? 'rgba(99,102,241,0.12)' : 'rgba(142,153,255,0.18)'};
  color: ${({ $role }) => ($role === 'agent' ? '#6366f1' : '#8E99FF')};
`;

export const LogBubble = styled.div<{ $role: 'user' | 'agent' }>`
  max-width: 72%;
  padding: 8px 11px;
  border-radius: 12px;
  font-family: 'S-Core Dream', sans-serif;
  font-weight: 300;
  font-size: 12.5px;
  line-height: 1.6;
  word-break: break-word;
  background: ${({ $role }) =>
    $role === 'user' ? '#8E99FF' : 'rgba(255,255,255,0.95)'};
  color: ${({ $role }) => ($role === 'user' ? '#fff' : '#374151')};
  border: ${({ $role }) =>
    $role === 'agent' ? '1px solid rgba(200,210,240,0.45)' : 'none'};
`;

const dotBounce = keyframes`
  0%, 60%, 100% { transform: translateY(0);    opacity: 0.35; }
  30%            { transform: translateY(-3px); opacity: 1; }
`;

export const TypingBubble = styled(LogBubble)`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 12px;
`;

export const TypingDot = styled.span`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  display: inline-block;
  opacity: 0.35;
  animation: ${dotBounce} 1.2s ease-in-out infinite;

  &:nth-child(2) { animation-delay: 0.18s; }
  &:nth-child(3) { animation-delay: 0.36s; }
`;

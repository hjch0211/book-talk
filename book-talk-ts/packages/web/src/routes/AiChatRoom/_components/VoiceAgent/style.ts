import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const activePulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.5); }
  50%       { box-shadow: 0 0 0 14px rgba(99,102,241,0); }
`;

const connectingBlink = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
`;

export const AgentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 28px 0 20px;
`;

export const MicButton = styled.button<{ $mode: 'idle' | 'speaking' | 'listening' | 'connecting' }>`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  box-shadow: 0 4px 20px rgba(99,102,241,0.35);
  transition: background 0.3s ease, box-shadow 0.3s ease, transform 0.15s ease;

  ${({ $mode }) =>
    ($mode === 'speaking' || $mode === 'listening') &&
    css`
      animation: ${activePulse} 1.4s ease-in-out infinite;
    `}

  ${({ $mode }) =>
    $mode === 'connecting' &&
    css`
      animation: ${connectingBlink} 1s ease-in-out infinite;
    `}

  &:hover {
    transform: scale(1.06);
    box-shadow: 0 6px 28px rgba(99,102,241,0.5);
  }

  &:active {
    transform: scale(0.96);
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

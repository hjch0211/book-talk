import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const speakingPulse = keyframes`
  0%, 100% { transform: scale(1);    box-shadow: 0 8px 28px rgba(107,140,222,0.25), 0 0 0 0 rgba(107,140,222,0.3); }
  50%       { transform: scale(1.06); box-shadow: 0 12px 40px rgba(107,140,222,0.4), 0 0 0 12px rgba(107,140,222,0); }
`;

const listeningPulse = keyframes`
  0%, 100% { transform: scale(1);    box-shadow: 0 8px 28px rgba(80,200,120,0.25), 0 0 0 0 rgba(80,200,120,0.3); }
  50%       { transform: scale(1.04); box-shadow: 0 12px 36px rgba(80,200,120,0.4), 0 0 0 10px rgba(80,200,120,0); }
`;

const idlePulse = keyframes`
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.02); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const AgentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 28px 0 20px;
  animation: ${fadeIn} 0.4s ease both;
`;

export const OrbButton = styled.button<{ $mode: 'idle' | 'speaking' | 'listening' | 'connecting' }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  position: relative;
  background: ${({ $mode }) => {
    if ($mode === 'speaking') return `
      radial-gradient(circle at 30% 22%, rgba(255,255,255,0.6) 0%, transparent 20%),
      radial-gradient(ellipse at 50% 50%, rgba(120,200,255,0.2) 40%, rgba(107,140,222,0.5) 70%, rgba(80,100,200,0.8) 100%),
      radial-gradient(circle at 50% 50%, #1a3a8a 0%, #3060d0 50%, #6090f0 100%)
    `;
    if ($mode === 'listening') return `
      radial-gradient(circle at 30% 22%, rgba(255,255,255,0.5) 0%, transparent 20%),
      radial-gradient(ellipse at 50% 50%, rgba(120,255,160,0.2) 40%, rgba(80,200,120,0.5) 70%, rgba(40,160,80,0.8) 100%),
      radial-gradient(circle at 50% 50%, #0a3020 0%, #1a7040 50%, #40c060 100%)
    `;
    return `
      radial-gradient(circle at 30% 22%, rgba(255,255,255,0.45) 0%, transparent 20%),
      radial-gradient(ellipse at 50% 50%, rgba(200,210,240,0.3) 40%, rgba(160,180,220,0.5) 70%, rgba(100,130,190,0.7) 100%),
      radial-gradient(circle at 50% 50%, #1a2a5a 0%, #2a4a9a 50%, #4a70d0 100%)
    `;
  }};
  animation: ${({ $mode }) => {
    if ($mode === 'speaking') return css`${speakingPulse} 1.2s ease-in-out infinite`;
    if ($mode === 'listening') return css`${listeningPulse} 1.6s ease-in-out infinite`;
    return css`${idlePulse} 3s ease-in-out infinite`;
  }};
  transition: background 0.4s ease;

  &::before {
    content: '';
    position: absolute;
    top: 10%;
    left: 18%;
    width: 28%;
    height: 18%;
    border-radius: 50%;
    background: radial-gradient(ellipse, rgba(255,255,255,0.7) 0%, transparent 70%);
    transform: rotate(-20deg);
    pointer-events: none;
  }
`;

export const StatusLabel = styled.span<{ $mode: 'idle' | 'speaking' | 'listening' | 'connecting' }>`
  font-family: 'S-Core Dream', sans-serif;
  font-weight: 300;
  font-size: 12px;
  letter-spacing: 0.5px;
  color: ${({ $mode }) => {
    if ($mode === 'speaking') return '#2a5ad0';
    if ($mode === 'listening') return '#1a8040';
    if ($mode === 'connecting') return '#9daac4';
    return '#7a8aaa';
  }};
  transition: color 0.3s ease;
`;

export const Divider = styled.div`
  width: calc(100% - 120px);
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(200,210,240,0.5) 20%, rgba(200,210,240,0.5) 80%, transparent 100%);
  margin: 0 60px;
`;

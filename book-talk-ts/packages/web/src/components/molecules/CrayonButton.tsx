import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const buttonBounce = keyframes`
  0%, 100% { transform: translateY(0); }
  30%       { transform: translateY(-6px); }
  60%       { transform: translateY(-3px); }
`;

export const CrayonButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 4px;
  border: none;
  border-bottom: 2.5px dashed
    ${({ $variant }) =>
      $variant === 'secondary' ? 'rgba(160,160,180,0.45)' : 'rgba(139,124,248,0.5)'};
  background: transparent;
  font-family: 'Gaegu', cursive;
  font-size: 22px;
  color: ${({ $variant }) => ($variant === 'secondary' ? '#a8a8c0' : '#8b7cf8')};
  cursor: pointer;
  letter-spacing: 1px;
  transition: color 0.2s ease, border-color 0.2s ease;

  &:hover:not(:disabled) {
    color: ${({ $variant }) => ($variant === 'secondary' ? '#8888a0' : '#6ec6ea')};
    border-color: ${({ $variant }) =>
      $variant === 'secondary' ? 'rgba(130,130,155,0.6)' : 'rgba(110,198,234,0.7)'};
    animation: ${buttonBounce} 0.5s ease;
  }

  &:active:not(:disabled) {
    transform: scale(0.96);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

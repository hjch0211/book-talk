import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

export const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-12px); }
`;

export const Scene = styled.div<{ $height: number }>`
  position: relative;
  width: 100%;
  height: ${({ $height }) => $height}px;
  perspective: 1200px;
  perspective-origin: 50% 50%;
  overflow: hidden;
`;

export const RotatingGroup = styled.div<{ $deg: number }>`
  position: absolute;
  left: 50%;
  top: 50%;
  transform-style: preserve-3d;
  transform: translateX(-50%) translateY(-50%) rotateY(${({ $deg }) => $deg}deg);
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
`;

export const CardSlot = styled.div<{ $angle: number; $radius: number; $w: number; $h: number }>`
  position: absolute;
  width: ${({ $w }) => $w}px;
  height: ${({ $h }) => $h}px;
  margin-left: ${({ $w }) => -$w / 2}px;
  margin-top: ${({ $h }) => -$h / 2}px;
  transform: rotateY(${({ $angle }) => $angle}deg) translateZ(${({ $radius }) => $radius}px);
`;

export const FloatWrapper = styled.div<{ $delay: string }>`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${floatAnimation} 3.5s ease-in-out ${({ $delay }) => $delay} infinite;
`;

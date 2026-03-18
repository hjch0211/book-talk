import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const blobDrift1 = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(40px, -30px) scale(1.08); }
  66%       { transform: translate(-20px, 20px) scale(0.95); }
`;

const blobDrift2 = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(-30px, 20px) scale(1.05); }
  66%       { transform: translate(25px, -25px) scale(0.97); }
`;

const blobDrift3 = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%       { transform: translate(20px, 30px) scale(1.1); }
`;

const twinkle = keyframes`
  0%, 100% { opacity: 0.15; transform: scale(0.8); }
  50%       { opacity: 0.9;  transform: scale(1.2); }
`;

export const BlobField = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
`;

export const Blob1 = styled.div`
  position: absolute;
  top: -120px;
  left: -100px;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(196,181,253,0.45) 0%, rgba(196,181,253,0) 70%);
  animation: ${blobDrift1} 12s ease-in-out infinite;
`;

export const Blob2 = styled.div`
  position: absolute;
  bottom: -80px;
  right: -80px;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(110,220,210,0.35) 0%, rgba(110,220,210,0) 70%);
  animation: ${blobDrift2} 15s ease-in-out infinite;
`;

export const Blob3 = styled.div`
  position: absolute;
  top: 30%;
  right: 10%;
  width: 320px;
  height: 320px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(147,210,255,0.35) 0%, rgba(147,210,255,0) 70%);
  animation: ${blobDrift3} 10s ease-in-out infinite;
`;

export const Blob4 = styled.div`
  position: absolute;
  bottom: 20%;
  left: 5%;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,185,220,0.3) 0%, rgba(255,185,220,0) 70%);
  animation: ${blobDrift1} 18s ease-in-out infinite reverse;
`;

export const Particle = styled.div<{
  $x: number;
  $y: number;
  $size: number;
  $delay: number;
  $color: string;
}>`
  position: absolute;
  left: ${({ $x }) => $x}%;
  top: ${({ $y }) => $y}%;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  animation: ${twinkle} ${({ $delay }) => 2.5 + $delay}s ease-in-out ${({ $delay }) => $delay}s infinite;
  pointer-events: none;
  z-index: 0;
`;

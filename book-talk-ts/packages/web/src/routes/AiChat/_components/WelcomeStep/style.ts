import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const heroFloat = keyframes`
  0%, 100% { transform: translateY(0px) rotate(-2deg); }
  50%       { transform: translateY(-18px) rotate(2deg); }
`;

const heroGlow = keyframes`
  0%, 100% { filter: drop-shadow(0 0 24px rgba(139,124,248,0.5)) drop-shadow(0 0 60px rgba(96,184,234,0.25)); }
  50%       { filter: drop-shadow(0 0 40px rgba(139,124,248,0.8)) drop-shadow(0 0 80px rgba(96,184,234,0.5)); }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;


export const HeroArea = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  animation: ${fadeUp} 0.7s ease both;
`;

export const HeroImage = styled.img`
  width: 640px;
  height: auto;
  animation: ${heroFloat} 5s ease-in-out infinite, ${heroGlow} 5s ease-in-out infinite;
  pointer-events: none;
  user-select: none;
`;

export const WelcomeSubtitle = styled.p`
  font-family: 'S-Core Dream', sans-serif;
  font-weight: 300;
  font-size: 16px;
  color: #7a8898;
  margin: 0 0 32px;
  line-height: 1.7;
  z-index: 1;
`;


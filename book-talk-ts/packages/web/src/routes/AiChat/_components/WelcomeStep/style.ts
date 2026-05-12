import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  animation: ${fadeUp} 0.7s ease both;
`;

export const WelcomeLogoGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

export const HeroImage = styled.img`
  width: 564px;
  height: auto;
  pointer-events: none;
  user-select: none;
`;

export const WelcomeSubtitle = styled.p`
  font-family: 'S-Core Dream', sans-serif;
  font-weight: 300;
  font-size: 16px;
  color: #262626;
  margin: 0;
  line-height: 27px;
  letter-spacing: 0.3px;
  text-align: center;
`;

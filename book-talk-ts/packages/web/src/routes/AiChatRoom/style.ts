import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const dotPulse = keyframes`
  0%, 80%, 100% { opacity: 0.3; }
  40% { opacity: 1; }
`;

const fadeInUp = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

export const AiChatRoomContainer = styled.div`
  width: 100%;
  max-width: 1440px;
  height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  animation: ${fadeInUp} 0.45s ease both;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  max-width: 1440px;
  width: 100%;
  padding: 60px 24px 24px 24px;
  z-index: 10;
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const HeaderTitle = styled.h1`
  margin: 0;
  font-family: 'S-Core Dream', sans-serif;
  font-weight: 500;
  font-size: 24px;
  line-height: 125%;
  letter-spacing: 0.3px;
  color: #1a2a4a;
`;

export const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  gap: 6px;
  height: 40px;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'S-Core Dream', sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 20px;
  letter-spacing: 1px;
  color: #7b7b7b;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(107, 140, 222, 0.08);
  }
`;

export const ChatArea = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 120px;
  flex: 1;
  max-width: 1440px;
  width: 100%;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(200, 210, 240, 0.4);
  box-shadow:
    0 8px 32px rgba(80, 100, 160, 0.08),
    0 2px 8px rgba(107, 140, 222, 0.1);
  border-radius: 24px;
  align-items: center;
  overflow: hidden;
`;

export const MessageList = styled.div`
  flex: 1;
  min-height: 0;
  width: calc(100% - 120px);
  padding: 10px 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const MessageRow = styled.div<{ $isUser: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: ${({ $isUser }) => ($isUser ? 'flex-end' : 'flex-start')};
  gap: 12px;
  width: 100%;
  padding: 4px 35px;
`;

export const AvatarColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 60px;
`;

export const AvatarCircle = styled.div<{ $isUser: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ $isUser }) => ($isUser ? 'rgba(200, 210, 240, 0.5)' : 'rgba(107, 140, 222, 0.15)')};
  color: ${({ $isUser }) => ($isUser ? '#4a6090' : '#2a4a8a')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'S-Core Dream', sans-serif;
  font-weight: 500;
  font-size: 14px;
`;

export const LoadingDots = styled.div`
  align-self: flex-start;
  padding: 16px 24px;
  border-radius: 24px 24px 24px 2px;
  background: rgba(238, 244, 255, 0.85);
  font-family: 'S-Core Dream', sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: #1a2a4a;
  display: flex;
  gap: 4px;

  & span {
    animation: ${dotPulse} 1.4s infinite ease-in-out both;

    &:nth-of-type(1) { animation-delay: 0s; }
    &:nth-of-type(2) { animation-delay: 0.2s; }
    &:nth-of-type(3) { animation-delay: 0.4s; }
  }
`;

export const ChatInputWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #9daac4;
  font-family: 'S-Core Dream', sans-serif;
  font-weight: 200;
  font-size: 18px;
  line-height: 180%;
  letter-spacing: 0.3px;
`;

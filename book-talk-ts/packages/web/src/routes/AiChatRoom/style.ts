import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const dotPulse = keyframes`
  0%, 80%, 100% { opacity: 0.3; }
  40% { opacity: 1; }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
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
  padding: 60px 60px 24px 60px;
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
  min-height: 0;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(200, 210, 240, 0.4);
  box-shadow:
    0 8px 32px rgba(80, 100, 160, 0.08),
    0 2px 8px rgba(107, 140, 222, 0.1);
  border-radius: 24px;
  overflow: hidden;
`;

export const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 32px 60px;
  display: flex;
  flex-direction: column;
  gap: 20px;

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
  padding: 4px 0;
  filter: drop-shadow(0px 4px 4px rgba(80, 100, 160, 0.08));
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

export const MessageGroup = styled.div<{ $isUser: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ $isUser }) => ($isUser ? 'end' : 'start')};
  gap: 4px;
  max-width: 70%;
`;

export const MessageBubble = styled.div`
  padding: 16px 24px;
  border-radius: 24px;
  font-family: 'S-Core Dream', sans-serif;
  font-weight: 200;
  font-size: 16px;
  line-height: 180%;
  letter-spacing: 0.3px;
  white-space: pre-wrap;
  word-break: break-word;
  background: rgba(238, 244, 255, 0.85);
  color: #1a2a4a;
`;

export const MessageTime = styled.span`
  font-family: 'S-Core Dream', sans-serif;
  font-weight: 200;
  font-size: 11px;
  line-height: 20px;
  letter-spacing: 0.3px;
  color: #9d9d9d;
  padding: 0 8px;
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

export const InputArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 20px 60px;
  background: linear-gradient(360deg, rgba(255, 255, 255, 0.95) 89.9%, rgba(255, 255, 255, 0) 100%);
`;

export const InputBox = styled.div`
  flex: 1;
  background: rgba(238, 244, 255, 0.6);
  border: 1px solid rgba(200, 210, 240, 0.5);
  border-radius: 16px;
  padding: 13px 23px;
  min-height: 45px;
  max-height: 120px;
  display: flex;
  align-items: center;

  & textarea {
    width: 100%;
    border: none;
    background: transparent;
    outline: none;
    resize: none;
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 200;
    font-size: 16px;
    line-height: 180%;
    letter-spacing: 0.3px;
    color: #1a2a4a;
    max-height: 90px;
    overflow-y: auto;

    &::placeholder {
      color: #9daac4;
    }

    &::-webkit-scrollbar {
      display: none;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

export const SendButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 16px;
  cursor: ${({ $active }) => ($active ? 'pointer' : 'not-allowed')};
  background: ${({ $active }) =>
    $active
      ? 'linear-gradient(110deg, #1A00E2 28.5%, #FF7544 86.82%)'
      : 'rgba(200, 210, 240, 0.5)'};
  font-family: 'Gaegu', cursive;
  transition: opacity 0.2s;

  & svg {
    color: #ffffff;
    font-size: 20px;
  }

  &:hover {
    opacity: ${({ $active }) => ($active ? 0.85 : 1)};
  }
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

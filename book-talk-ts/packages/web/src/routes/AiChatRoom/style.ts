import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const dotPulse = keyframes`
  0%, 80%, 100% { opacity: 0.3; }
  40% { opacity: 1; }
`;

export const AiChatRoomContainer = styled.div`
  width: 100%;
  max-width: 1440px;
  height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  max-width: 1440px;
  padding: 80px 120px 24px 120px;
  background: linear-gradient(360deg, rgba(255, 255, 255, 0) 0%, #ffffff 9.13%);
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
  color: #262626;
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
    background-color: rgba(0, 0, 0, 0.04);
  }
`;

export const ChatArea = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 120px;
  flex: 1;
  max-width: 1440px;
  min-height: 0;
  background: #ffffff;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
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
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.1));
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
  background: ${({ $isUser }) => ($isUser ? '#EADDFF' : '#E0F2FE')};
  color: ${({ $isUser }) => ($isUser ? '#4F378A' : '#0369A1')};
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
  background: #f5f5f5;
  color: #262626;
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
  background: #f5f5f5;
  font-family: 'S-Core Dream', sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: #262626;
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
  background: linear-gradient(360deg, #ffffff 89.9%, rgba(255, 255, 255, 0) 100%);
`;

export const InputBox = styled.div`
  flex: 1;
  background-color: #e9e9e9;
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
    color: #262626;
    max-height: 90px;
    overflow-y: auto;

    &::placeholder {
      color: #9d9d9d;
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
    $active ? 'linear-gradient(110deg, #1A00E2 28.5%, #FF7544 86.82%)' : '#c4c4c4'};
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
  color: #9d9d9d;
  font-family: 'S-Core Dream', sans-serif;
  font-weight: 200;
  font-size: 18px;
  line-height: 180%;
  letter-spacing: 0.3px;
`;

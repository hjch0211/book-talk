import styled from '@emotion/styled';

export const AiChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  padding: 40px 20px;
`;

export const AiChatHeader = styled.h1`
  font-family: 'S-Core Dream', sans-serif;
  font-weight: 500;
  font-size: 24px;
  color: #262626;
  margin: 0 0 24px 0;
`;

export const SetupCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 700px;
  margin-bottom: 24px;
`;

export const SetupRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const StatusText = styled.span<{ $connected?: boolean }>`
  font-family: 'S-Core Dream', sans-serif;
  font-size: 14px;
  color: ${({ $connected }) => ($connected ? '#4CAF50' : '#9E9E9E')};
`;

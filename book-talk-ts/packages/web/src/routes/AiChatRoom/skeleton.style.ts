import styled from '@emotion/styled';
import { Skeleton } from '@mui/material';

export const SkeletonPageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  background: radial-gradient(ellipse at 50% 0%, rgba(238, 244, 255, 0.85) 0%, rgba(248, 249, 252, 0.75) 60%, rgba(255, 255, 255, 0.65) 100%);
  display: flex;
  flex-direction: column;
`;

export const SkeletonHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 80px 120px 24px 120px;
`;

export const SkeletonHeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const SkeletonHeaderTitle = styled(Skeleton)`
  width: 280px;
  height: 30px;
  border-radius: 8px;
`;

export const SkeletonHeaderSubtitle = styled(Skeleton)`
  width: 160px;
  height: 20px;
  border-radius: 6px;
`;

export const SkeletonHeaderButton = styled(Skeleton)`
  width: 80px;
  height: 40px;
  border-radius: 4px;
`;

export const SkeletonChatArea = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 120px;
  flex: 1;
  min-height: 0;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(200, 210, 240, 0.4);
  box-shadow:
    0 8px 32px rgba(80, 100, 160, 0.08),
    0 2px 8px rgba(107, 140, 222, 0.1);
  border-radius: 24px;
  overflow: hidden;
`;

export const SkeletonMessageList = styled.div`
  flex: 1;
  overflow: hidden;
  padding: 32px 60px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const SkeletonMessageBubble = styled(Skeleton, {
  shouldForwardProp: (prop) => prop !== '$isUser',
})<{ $isUser: boolean }>`
  border-radius: ${({ $isUser }) => ($isUser ? '24px 24px 2px 24px' : '24px 24px 24px 2px')};
  align-self: ${({ $isUser }) => ($isUser ? 'flex-end' : 'flex-start')};
`;

export const SkeletonInputArea = styled.div`
  display: flex;
  gap: 12px;
  padding: 20px 60px;
  align-items: center;
`;

export const SkeletonInput = styled(Skeleton)`
  flex: 1;
  height: 45px;
  border-radius: 16px;
`;

export const SkeletonSendButton = styled(Skeleton)`
  width: 48px;
  height: 48px;
  border-radius: 16px;
`;

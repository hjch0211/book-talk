import { CircularProgress } from '@mui/material';
import type { VoiceConnectionStatus } from '@src/hooks/domain/useDebateVoiceChat';
import MainContainer from '../../../components/templates/MainContainer';
import {
  LoadingOverlay,
  LoadingSubText,
  LoadingText,
  SkeletonActionButton,
  SkeletonActionButtonContainer,
  SkeletonButton,
  SkeletonButtonGroup,
  SkeletonChatInputBox,
  SkeletonChatInputContainer,
  SkeletonContainer,
  SkeletonMainContent,
  SkeletonMemberAvatar,
  SkeletonMemberInfo,
  SkeletonMemberItem,
  SkeletonMemberListContainer,
  SkeletonMemberListHeader,
  SkeletonMemberName,
  SkeletonMemberRole,
  SkeletonNavContent,
  SkeletonNavigationBar,
  SkeletonPresentationArea,
  SkeletonPresentationLine,
  SkeletonPresentationLineShort,
  SkeletonPresentationTitle,
  SkeletonTitle,
} from '../skeleton.style';

interface DebateSkeletonProps {
  connectionStatus: VoiceConnectionStatus;
}

/** 멤버 아이템 스켈레톤 */
const MemberItemSkeleton = () => (
  <SkeletonMemberItem>
    <SkeletonMemberAvatar variant="rectangular" animation="wave" />
    <SkeletonMemberInfo>
      <SkeletonMemberName variant="text" animation="wave" />
      <SkeletonMemberRole variant="text" animation="wave" />
    </SkeletonMemberInfo>
  </SkeletonMemberItem>
);

/** 연결 상태별 메시지 */
const getConnectionMessage = (status: VoiceConnectionStatus) => {
  switch (status) {
    case 'PENDING':
      return {
        title: '음성 채팅 연결 중...',
        subTitle: '잠시만 기다려주세요',
      };
    case 'FAILED':
      return {
        title: '음성 채팅 연결 실패',
        subTitle: '새로고침을 시도해주세요',
      };
    default:
      return {
        title: '토론방에 입장 중...',
        subTitle: '잠시만 기다려주세요',
      };
  }
};

export const DebateSkeleton = ({ connectionStatus }: DebateSkeletonProps) => {
  const message = getConnectionMessage(connectionStatus);

  return (
    <MainContainer isAuthPage>
      <SkeletonContainer>
        {/* Navigation Bar */}
        <SkeletonNavigationBar>
          <SkeletonNavContent>
            <SkeletonTitle variant="text" animation="wave" />
            <SkeletonButtonGroup>
              <SkeletonButton variant="rectangular" animation="wave" />
              <SkeletonButton variant="rectangular" animation="wave" />
            </SkeletonButtonGroup>
          </SkeletonNavContent>
        </SkeletonNavigationBar>

        {/* Main Content */}
        <SkeletonMainContent>
          <SkeletonPresentationArea>
            <SkeletonPresentationTitle variant="text" animation="wave" />
            <SkeletonPresentationLine variant="text" animation="wave" />
            <SkeletonPresentationLine variant="text" animation="wave" />
            <SkeletonPresentationLineShort variant="text" animation="wave" />
            <SkeletonPresentationLine variant="text" animation="wave" />
            <SkeletonPresentationLineShort variant="text" animation="wave" />
          </SkeletonPresentationArea>
        </SkeletonMainContent>

        {/* Member List */}
        <SkeletonMemberListContainer>
          <SkeletonMemberListHeader variant="text" animation="wave" />
          <MemberItemSkeleton />
          <MemberItemSkeleton />
          <MemberItemSkeleton />
          <MemberItemSkeleton />
        </SkeletonMemberListContainer>

        {/* Chat Input */}
        <SkeletonChatInputContainer>
          <SkeletonChatInputBox variant="rectangular" animation="wave" />
        </SkeletonChatInputContainer>

        {/* Action Button */}
        <SkeletonActionButtonContainer>
          <SkeletonActionButton variant="rectangular" animation="wave" />
        </SkeletonActionButtonContainer>

        {/* Loading Overlay */}
        <LoadingOverlay>
          <CircularProgress
            size={48}
            sx={{
              color: connectionStatus === 'FAILED' ? '#FF7544' : '#1A00E2',
            }}
          />
          <LoadingText>{message.title}</LoadingText>
          <LoadingSubText>{message.subTitle}</LoadingSubText>
        </LoadingOverlay>
      </SkeletonContainer>
    </MainContainer>
  );
};

import { CircularProgress } from '@mui/material';
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

interface Props {
  title: string;
  content: string;
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

export const DebateSkeleton = ({ title, content }: Props) => {
  return (
    <MainContainer>
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
          <CircularProgress size={48} />
          <LoadingText>{title}</LoadingText>
          <LoadingSubText>{content}</LoadingSubText>
        </LoadingOverlay>
      </SkeletonContainer>
    </MainContainer>
  );
};

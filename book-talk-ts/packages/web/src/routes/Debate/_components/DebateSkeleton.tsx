import debateLoadingGif from '@src/assets/debate-loading.gif';
import PageContainer from '../../../components/templates/PageContainer';
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
  SkeletonMobileBarButton,
  SkeletonMobileBottomBar,
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
    <PageContainer>
      <SkeletonContainer>
        <SkeletonNavigationBar>
          <SkeletonNavContent>
            <SkeletonTitle variant="text" animation="wave" />
            <SkeletonButtonGroup>
              <SkeletonButton variant="rectangular" animation="wave" />
              <SkeletonButton variant="rectangular" animation="wave" />
            </SkeletonButtonGroup>
          </SkeletonNavContent>
        </SkeletonNavigationBar>

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

        <SkeletonMemberListContainer>
          <SkeletonMemberListHeader variant="text" animation="wave" />
          <MemberItemSkeleton />
          <MemberItemSkeleton />
          <MemberItemSkeleton />
          <MemberItemSkeleton />
        </SkeletonMemberListContainer>

        <SkeletonChatInputContainer>
          <SkeletonChatInputBox variant="rectangular" animation="wave" />
        </SkeletonChatInputContainer>

        <SkeletonActionButtonContainer>
          <SkeletonActionButton variant="rectangular" animation="wave" />
        </SkeletonActionButtonContainer>

        <SkeletonMobileBottomBar>
          <SkeletonMobileBarButton variant="rectangular" animation="wave" />
          <SkeletonMobileBarButton variant="rectangular" animation="wave" />
          <SkeletonMobileBarButton variant="rectangular" animation="wave" />
        </SkeletonMobileBottomBar>

        <LoadingOverlay>
          <img src={debateLoadingGif} alt="로딩 중" width={316} />
          <LoadingText>{title}</LoadingText>
          <LoadingSubText>{content}</LoadingSubText>
        </LoadingOverlay>
      </SkeletonContainer>
    </PageContainer>
  );
};

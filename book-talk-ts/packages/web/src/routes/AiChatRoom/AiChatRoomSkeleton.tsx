import {
  SkeletonChatArea,
  SkeletonHeader,
  SkeletonHeaderButton,
  SkeletonHeaderLeft,
  SkeletonHeaderSubtitle,
  SkeletonHeaderTitle,
  SkeletonInput,
  SkeletonInputArea,
  SkeletonMessageBubble,
  SkeletonMessageList,
  SkeletonPageContainer,
  SkeletonSendButton,
} from './skeleton.style';

export const AiChatRoomSkeleton = () => {
  return (
    <SkeletonPageContainer>
      <SkeletonHeader>
        <SkeletonHeaderLeft>
          <SkeletonHeaderTitle variant="text" animation="wave" />
          <SkeletonHeaderSubtitle variant="text" animation="wave" />
        </SkeletonHeaderLeft>
        <SkeletonHeaderButton variant="rectangular" animation="wave" />
      </SkeletonHeader>

      <SkeletonChatArea>
        <SkeletonMessageList>
          <SkeletonMessageBubble
            $isUser={false}
            variant="rectangular"
            animation="wave"
            width="55%"
            height={56}
          />
          <SkeletonMessageBubble
            $isUser={true}
            variant="rectangular"
            animation="wave"
            width="40%"
            height={48}
          />
          <SkeletonMessageBubble
            $isUser={false}
            variant="rectangular"
            animation="wave"
            width="65%"
            height={72}
          />
          <SkeletonMessageBubble
            $isUser={true}
            variant="rectangular"
            animation="wave"
            width="45%"
            height={48}
          />
        </SkeletonMessageList>

        <SkeletonInputArea>
          <SkeletonInput variant="rectangular" animation="wave" />
          <SkeletonSendButton variant="rectangular" animation="wave" />
        </SkeletonInputArea>
      </SkeletonChatArea>
    </SkeletonPageContainer>
  );
};

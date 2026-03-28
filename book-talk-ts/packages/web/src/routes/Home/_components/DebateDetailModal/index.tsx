import type { FindAllDebateInfo } from '@src/externals/debate/schema';
import Modal from '../../../../components/organisms/Modal';
import { DebateActionButtons } from './_components/DebateActionButtons';
import {
  BookImageBox,
  BookInfoLink,
  BookProfile,
  ContentArea,
  ContentRow,
  DateTimeGroup,
  DebateDescription,
  DebateTopic,
  Divider,
  InfoColumn,
  InnerWrapper,
  MetaLabel,
  MetaRow,
  MetaSection,
  MetaValue,
  ModalContainer,
  ModalTitle,
  TextSection,
} from './style';
import { useDebateParticipation } from './useDebateParticipation';

interface Props {
  open: boolean;
  onClose: () => void;
  debate: FindAllDebateInfo;
  myId?: string;
}

const KST_OFFSET = 9 * 60 * 60 * 1000;

const toKst = (isoString: string) => new Date(new Date(isoString).getTime() + KST_OFFSET);

const formatDate = (isoString: string): string => {
  const d = toKst(isoString);
  return `${d.getUTCFullYear()}.${String(d.getUTCMonth() + 1).padStart(2, '0')}.${String(d.getUTCDate()).padStart(2, '0')}`;
};

const formatTime = (isoString: string): string => {
  const d = toKst(isoString);
  const h = d.getUTCHours();
  const m = d.getUTCMinutes();
  return m === 0 ? `${h}시` : `${h}시 ${m}분`;
};

const DebateDetailModal = ({ open, onClose, debate, myId }: Props) => {
  const { handleJoin, handleCancel, handleEnter, handleEdit, isJoinPending, isCancelPending } =
    useDebateParticipation(debate, onClose, myId);
  const myRole = debate.members.find((m) => m.id === myId)?.role;
  const isFull = (!myRole && debate.members.length >= debate.maxMemberCount) || !!debate.closedAt;

  return (
    <Modal open={open} onClose={onClose} width={880}>
      <ModalContainer>
        <InnerWrapper>
          <ContentArea>
            <ModalTitle variant="labelL">토론 소개</ModalTitle>

            <ContentRow>
              <BookProfile
                onClick={() =>
                  window.open(debate.bookInfo.detailUrl, '_blank', 'noopener,noreferrer')
                }
              >
                <BookImageBox imageUrl={debate.bookInfo.imageUrl} />
                <BookInfoLink variant="captionS">책 정보보기</BookInfoLink>
              </BookProfile>

              <InfoColumn>
                <TextSection>
                  <DebateTopic variant="labelL">{debate.topic}</DebateTopic>
                  {debate.description && (
                    <DebateDescription variant="body2">{debate.description}</DebateDescription>
                  )}
                </TextSection>

                <Divider />

                <MetaSection>
                  <MetaRow>
                    <MetaLabel variant="labelL">토론일정:</MetaLabel>
                    <DateTimeGroup>
                      <MetaValue variant="body2">{formatDate(debate.startAt)}</MetaValue>
                      <MetaValue variant="body2">|</MetaValue>
                      <MetaValue variant="body2">{formatTime(debate.startAt)}</MetaValue>
                    </DateTimeGroup>
                  </MetaRow>
                  <MetaRow>
                    <MetaLabel variant="labelL">모집 인원수:</MetaLabel>
                    <MetaValue variant="body2">
                      {debate.members.length}/{debate.maxMemberCount} 명
                    </MetaValue>
                  </MetaRow>
                </MetaSection>
              </InfoColumn>
            </ContentRow>
          </ContentArea>

          <DebateActionButtons
            myRole={myRole}
            isFull={isFull}
            onJoin={handleJoin}
            onCancel={handleCancel}
            onEnter={handleEnter}
            onEdit={handleEdit}
            isJoinPending={isJoinPending}
            isCancelPending={isCancelPending}
          />
        </InnerWrapper>
      </ModalContainer>
    </Modal>
  );
};

export default DebateDetailModal;

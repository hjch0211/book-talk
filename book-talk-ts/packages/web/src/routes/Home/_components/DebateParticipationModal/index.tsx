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
  WarningAsterisk,
  WarningNotice,
  WarningText,
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

const DebateParticipationModal = ({ open, onClose, debate, myId }: Props) => {
  const { handleJoin, handleCancel, handleEnter, handleEdit, isJoinPending, isCancelPending } =
    useDebateParticipation(debate, onClose, myId);
  const myRole = debate.members.find((m) => m.id === myId)?.role;
  const isFull = !myRole && debate.members.length >= debate.maxMemberCount;

  return (
    <Modal open={open} onClose={onClose} width={880}>
      <ModalContainer>
        <InnerWrapper>
          <ContentArea>
            <ModalTitle>토론 소개</ModalTitle>

            <ContentRow>
              <BookProfile
                onClick={() =>
                  window.open(debate.bookInfo.detailUrl, '_blank', 'noopener,noreferrer')
                }
              >
                <BookImageBox imageUrl={debate.bookInfo.imageUrl} />
                <BookInfoLink>책 정보보기</BookInfoLink>
              </BookProfile>

              <InfoColumn>
                <TextSection>
                  <DebateTopic>{debate.topic}</DebateTopic>
                  {debate.description && (
                    <DebateDescription>{debate.description}</DebateDescription>
                  )}
                </TextSection>

                <Divider />

                <MetaSection>
                  <MetaRow>
                    <MetaLabel>토론일정:</MetaLabel>
                    <DateTimeGroup>
                      <MetaValue>{formatDate(debate.startAt)}</MetaValue>
                      <MetaValue>|</MetaValue>
                      <MetaValue>{formatTime(debate.startAt)}</MetaValue>
                    </DateTimeGroup>
                  </MetaRow>
                  <MetaRow>
                    <MetaLabel>모집 인원수:</MetaLabel>
                    <MetaValue>
                      {debate.members.length}/{debate.maxMemberCount} 명
                    </MetaValue>
                  </MetaRow>
                </MetaSection>

                {!myRole && !isFull && (
                  <WarningNotice>
                    <WarningAsterisk>*</WarningAsterisk>
                    <WarningText>
                      토론이 시작되기 3일 전부터는 참여신청을 취소할 수 없습니다.
                    </WarningText>
                  </WarningNotice>
                )}
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

export default DebateParticipationModal;

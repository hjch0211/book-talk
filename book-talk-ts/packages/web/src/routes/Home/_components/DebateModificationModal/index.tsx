import { AccessTime, CalendarMonth, DeleteOutline } from '@mui/icons-material';
import { InputAdornment, MenuItem } from '@mui/material';
import { AppButton } from '@src/components/molecules/AppButton';
import { AppFieldMessage } from '@src/components/molecules/AppFieldMessage';
import { AppTextField } from '@src/components/molecules/AppTextField';
import Modal from '@src/components/organisms/Modal';
import type { FindAllDebateInfo } from '@src/externals/debate/schema';
import { useInnerModal } from '@src/hooks/infra/useInnerModal.tsx';
import { Controller } from 'react-hook-form';
import { DebateDeletionModal } from './_components/DebateDeletionModal';
import {
  BookReadOnlyBox,
  BookReadOnlyText,
  ButtonRow,
  FieldHint,
  FieldLabel,
  FieldLabelInner,
  FieldLabelRow,
  FieldSection,
  FormContainer,
  ModalContainer,
  ModalTitle,
  ParticipantSelect,
  RequiredMark,
  ScheduleRow,
  ScheduleTextField,
} from './style';
import { useDebateModification } from './useDebateModification';

interface Props {
  open: boolean;
  onClose: () => void;
  debate: FindAllDebateInfo;
}

const DebateModificationModal = ({ open, onClose, debate }: Props) => {
  const { control, errors, isFormValid, onSubmit, onDelete, isPending, isDeletePending } =
    useDebateModification(debate, onClose);
  const { openModal, closeModal } = useInnerModal();

  const handleDeleteClick = () => {
    openModal(DebateDeletionModal, {
      onConfirm: () => {
        onDelete();
        closeModal();
      },
      isPending: isDeletePending,
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContainer>
        <ModalTitle>토론방 정보</ModalTitle>

        <FormContainer>
          <FieldSection>
            <FieldLabelRow>
              <FieldLabelInner>
                <FieldLabel>책 제목</FieldLabel>
              </FieldLabelInner>
            </FieldLabelRow>
            <BookReadOnlyBox>
              <BookReadOnlyText>{debate.bookInfo.title}</BookReadOnlyText>
            </BookReadOnlyBox>
          </FieldSection>

          <FieldSection>
            <FieldLabelRow>
              <FieldLabelInner>
                <FieldLabel>토론주제</FieldLabel>
                <RequiredMark>*</RequiredMark>
              </FieldLabelInner>
              <FieldHint>(최대 60자)</FieldHint>
            </FieldLabelRow>

            <Controller
              name="topic"
              control={control}
              render={({ field }) => (
                <AppTextField
                  {...field}
                  placeholder="토론 주제를 입력해주세요"
                  error={!!errors.topic}
                  slotProps={{ htmlInput: { maxLength: 60 } }}
                />
              )}
            />

            {errors.topic && <AppFieldMessage type="error">{errors.topic.message}</AppFieldMessage>}
          </FieldSection>

          <FieldSection>
            <FieldLabelRow>
              <FieldLabel>토론설명</FieldLabel>
              <FieldHint>(최대 300자)</FieldHint>
            </FieldLabelRow>

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <AppTextField
                  {...field}
                  multiline
                  minRows={1}
                  maxRows={4}
                  error={!!errors.description}
                  slotProps={{ htmlInput: { maxLength: 300 } }}
                />
              )}
            />

            {errors.description && (
              <AppFieldMessage type="error">{errors.description.message}</AppFieldMessage>
            )}
          </FieldSection>

          <FieldSection>
            <FieldLabelRow>
              <FieldLabelInner>
                <FieldLabel>참여자 수</FieldLabel>
                <RequiredMark>*</RequiredMark>
              </FieldLabelInner>
            </FieldLabelRow>

            <Controller
              name="participantCount"
              control={control}
              render={({ field }) => (
                <ParticipantSelect {...field}>
                  {[2, 3, 4].map((n) => (
                    <MenuItem key={n} value={n}>
                      {n}
                    </MenuItem>
                  ))}
                </ParticipantSelect>
              )}
            />
          </FieldSection>

          <FieldSection>
            <FieldLabelRow>
              <FieldLabelInner>
                <FieldLabel>토론일정</FieldLabel>
                <RequiredMark>*</RequiredMark>
              </FieldLabelInner>
            </FieldLabelRow>

            <ScheduleRow>
              <Controller
                name="scheduledDate"
                control={control}
                render={({ field }) => (
                  <ScheduleTextField
                    {...field}
                    type="date"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <CalendarMonth sx={{ fontSize: 24 }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />

              <Controller
                name="scheduledTime"
                control={control}
                render={({ field }) => (
                  <ScheduleTextField
                    {...field}
                    type="time"
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <AccessTime sx={{ fontSize: 24 }} />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />
            </ScheduleRow>

            {errors.scheduledTime && (
              <AppFieldMessage type="error">{errors.scheduledTime.message}</AppFieldMessage>
            )}
          </FieldSection>
        </FormContainer>

        <ButtonRow>
          <AppButton
            appVariant="transparent"
            onClick={handleDeleteClick}
            loading={isDeletePending}
            sx={{ width: 200, height: 60, borderRadius: '10px', gap: '8px' }}
          >
            <DeleteOutline sx={{ fontSize: 24, color: '#7B7B7B' }} />
            토론방 삭제하기
          </AppButton>
          <AppButton
            appVariant="filled"
            onClick={onSubmit}
            disabled={!isFormValid}
            loading={isPending}
            sx={{ width: 250, height: 60 }}
          >
            저장하기
          </AppButton>
        </ButtonRow>
      </ModalContainer>
    </Modal>
  );
};

export default DebateModificationModal;

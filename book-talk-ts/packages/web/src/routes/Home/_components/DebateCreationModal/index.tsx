import { Search } from '@mui/icons-material';
import { MenuItem, Typography, useMediaQuery, useTheme } from '@mui/material';
import { AppButton } from '@src/components/molecules/AppButton';
import { AppFieldMessage } from '@src/components/molecules/AppFieldMessage';
import { AppTextField } from '@src/components/molecules/AppTextField';
import { AppDatePicker } from '@src/components/organisms/AppDatePicker';
import { AppTimePicker } from '@src/components/organisms/AppTimePicker';
import dayjs from 'dayjs';
import { Controller } from 'react-hook-form';
import Modal from '../../../../components/organisms/Modal';
import {
  BookAuthor,
  BookImage,
  BookInfo,
  BookTitle,
  FieldHint,
  FieldLabel,
  FieldLabelInner,
  FieldLabelRow,
  FieldSection,
  FormContainer,
  InputBox,
  ModalContainer,
  NoResultText,
  ParticipantSelect,
  RequiredMark,
  ScheduleRow,
  SearchDropdown,
  SearchInputWrapper,
  SearchResultItem,
  SearchResultList,
  StyledInput,
} from './style.ts';
import { useDebateCreation } from './useDebateCreation';

interface CreateDebateModalProps {
  open: boolean;
  onClose: () => void;
}

const DebateCreationModal = ({ open, onClose }: CreateDebateModalProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const {
    control,
    errors,
    isFormValid,
    onSubmit,
    searchQuery,
    showDropdown,
    searchResults,
    isSearchLoading,
    isFetchingNextBooks,
    debouncedSearchQuery,
    searchWrapperRef,
    dropdownRef,
    sentinelRef,
    handleSearchChange,
    handleSearchFocus,
    handleBookSelect,
    isPending,
  } = useDebateCreation(onClose);

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContainer>
        <Typography variant="labelL" color="#545454" textAlign="center" alignSelf="stretch">
          토론방 만들기
        </Typography>

        <FormContainer>
          <FieldSection>
            <FieldLabelRow>
              <FieldLabelInner>
                <FieldLabel variant="captionM">책 제목</FieldLabel>
                <RequiredMark variant="captionM">*</RequiredMark>
              </FieldLabelInner>
            </FieldLabelRow>

            <SearchInputWrapper ref={searchWrapperRef}>
              <InputBox>
                <Search sx={{ fontSize: 24, flexShrink: 0 }} />
                <StyledInput
                  placeholder="토론하고 싶은 책을 검색해보세요"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={handleSearchFocus}
                />
              </InputBox>

              {showDropdown && searchQuery && (
                <SearchDropdown ref={dropdownRef}>
                  <SearchResultList>
                    {isSearchLoading ? (
                      <NoResultText variant="captionM">검색 중...</NoResultText>
                    ) : searchResults.length > 0 ? (
                      <>
                        {searchResults.map((book, index) => (
                          <SearchResultItem
                            key={`${book.isbn || index}`}
                            onClick={() => handleBookSelect(book)}
                          >
                            <BookImage
                              sx={{
                                backgroundImage: book.imageUrl
                                  ? `url(${book.imageUrl})`
                                  : undefined,
                              }}
                            />
                            <BookInfo>
                              <BookTitle variant="labelS">{book.title}</BookTitle>
                              <BookAuthor variant="captionS">
                                {book.author} · {book.publisher}
                              </BookAuthor>
                            </BookInfo>
                          </SearchResultItem>
                        ))}
                        {isFetchingNextBooks && (
                          <NoResultText variant="captionM">불러오는 중...</NoResultText>
                        )}
                        <div ref={sentinelRef} style={{ height: 1 }} />
                      </>
                    ) : debouncedSearchQuery ? (
                      <NoResultText variant="captionM">검색 결과가 없습니다</NoResultText>
                    ) : null}
                  </SearchResultList>
                </SearchDropdown>
              )}
            </SearchInputWrapper>

            {errors.bookISBN && (
              <AppFieldMessage type="error">{errors.bookISBN.message}</AppFieldMessage>
            )}
          </FieldSection>

          <FieldSection>
            <FieldLabelRow>
              <FieldLabelInner>
                <FieldLabel variant="captionM">토론주제</FieldLabel>
                <RequiredMark variant="captionM">*</RequiredMark>
              </FieldLabelInner>
              <FieldHint variant="captionS">(최대 60자)</FieldHint>
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
              <FieldLabel variant="captionM">토론설명</FieldLabel>
              <FieldHint variant="captionS">(최대 300자)</FieldHint>
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
                <FieldLabel variant="captionM">참여자 수</FieldLabel>
                <RequiredMark variant="captionM">*</RequiredMark>
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
                <FieldLabel variant="captionM">토론일정</FieldLabel>
                <RequiredMark variant="captionM">*</RequiredMark>
              </FieldLabelInner>
            </FieldLabelRow>

            <ScheduleRow>
              <Controller
                name="scheduledDate"
                control={control}
                render={({ field }) => (
                  <AppDatePicker
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(newValue) => {
                      if (newValue?.isValid()) {
                        field.onChange(newValue.format('YYYY-MM-DD'));
                      }
                    }}
                    disablePast
                  />
                )}
              />

              <Controller
                name="scheduledTime"
                control={control}
                render={({ field }) => (
                  <AppTimePicker
                    value={field.value ? dayjs(`2000-01-01T${field.value}`) : null}
                    onChange={(newValue) => {
                      if (newValue?.isValid()) {
                        field.onChange(newValue.format('HH:mm'));
                      }
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

        <AppButton
          appVariant="filled"
          onClick={onSubmit}
          disabled={!isFormValid}
          loading={isPending}
          sx={{ width: isMobile ? '100%' : 250 }}
        >
          <Typography variant="labelM" color="inherit">
            토론방 생성
          </Typography>
        </AppButton>
      </ModalContainer>
    </Modal>
  );
};

export default DebateCreationModal;

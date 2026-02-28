import { AccessTime, CalendarMonth, Search } from '@mui/icons-material';
import { InputAdornment, MenuItem } from '@mui/material';
import { AppButton } from '@src/components/molecules/AppButton';
import { AppFieldMessage } from '@src/components/molecules/AppFieldMessage';
import { AppTextField } from '@src/components/molecules/AppTextField';
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
  ModalTitle,
  NoResultText,
  ParticipantSelect,
  RequiredMark,
  ScheduleRow,
  ScheduleTextField,
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
    handleSearchChange,
    handleSearchFocus,
    handleBookSelect,
    isPending,
  } = useDebateCreation(onClose);

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContainer>
        <ModalTitle>토론방 만들기</ModalTitle>

        <FormContainer>
          <FieldSection>
            <FieldLabelRow>
              <FieldLabelInner>
                <FieldLabel>책 제목</FieldLabel>
                <RequiredMark>*</RequiredMark>
              </FieldLabelInner>
            </FieldLabelRow>

            <SearchInputWrapper ref={searchWrapperRef}>
              <InputBox highlight={!!searchQuery}>
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
                      <NoResultText>검색 중...</NoResultText>
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
                              <BookTitle>{book.title}</BookTitle>
                              <BookAuthor>
                                {book.author} · {book.publisher}
                              </BookAuthor>
                            </BookInfo>
                          </SearchResultItem>
                        ))}
                        {isFetchingNextBooks && <NoResultText>불러오는 중...</NoResultText>}
                      </>
                    ) : debouncedSearchQuery ? (
                      <NoResultText>검색 결과가 없습니다</NoResultText>
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

        <AppButton
          appVariant="filled"
          onClick={onSubmit}
          disabled={!isFormValid}
          loading={isPending}
          sx={{ width: 250, height: 60 }}
        >
          토론방 생성
        </AppButton>
      </ModalContainer>
    </Modal>
  );
};

export default DebateCreationModal;

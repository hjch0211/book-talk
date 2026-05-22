import { Search } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { AppButton } from '@src/components/molecules/AppButton';
import { AppFieldMessage } from '@src/components/molecules/AppFieldMessage';
import { NameContentCard, NameStepTitle } from '@src/routes/AiChat/style';
import { Controller } from 'react-hook-form';
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
  FieldsContainer,
  FormButtonRow,
  InputBox,
  NoResultText,
  RequiredMark,
  SearchDropdown,
  SearchInputWrapper,
  SearchResultItem,
  SearchResultList,
  StyledInput,
  StyledTextarea,
} from './style';
import { useDebateCreateStep } from './useDebateCreateStep';

interface DebateCreateStepProps {
  onBack: () => void;
  onSuccess: (debateId: string) => void;
}

export function DebateCreateStep({ onBack, onSuccess }: DebateCreateStepProps) {
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
  } = useDebateCreateStep(onSuccess);

  return (
    <>
      <NameStepTitle>토론주제 생성하기</NameStepTitle>

      <NameContentCard
        sx={{ maxWidth: 750, gap: '60px' }}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (
            e.key === 'Enter' &&
            !(e.target instanceof HTMLTextAreaElement) &&
            !showDropdown &&
            isFormValid &&
            !isPending
          ) {
            onSubmit();
          }
        }}
      >
        <FieldsContainer>
          <FieldSection>
            <FieldLabelRow>
              <FieldLabelInner>
                <FieldLabel variant="captionM">책 제목</FieldLabel>
                <RequiredMark variant="captionM">*</RequiredMark>
              </FieldLabelInner>
            </FieldLabelRow>

            <SearchInputWrapper ref={searchWrapperRef}>
              <InputBox
                sx={{ borderColor: '#8E99FF', '&:focus-within': { borderColor: '#8E99FF' } }}
              >
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
                <InputBox sx={{ height: 'auto' }}>
                  <StyledInput
                    {...field}
                    placeholder="토론 주제를 입력해주세요"
                    maxLength={60}
                    style={{ width: '100%' }}
                  />
                </InputBox>
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
                <StyledTextarea
                  {...field}
                  placeholder="토론에 대한 간략한 설명을 입력해주세요 (선택)"
                  maxLength={300}
                  rows={3}
                />
              )}
            />

            {errors.description && (
              <AppFieldMessage type="error">{errors.description.message}</AppFieldMessage>
            )}
          </FieldSection>
        </FieldsContainer>

        <FormButtonRow>
          <AppButton appVariant="white" fullWidth={false} onClick={onBack}>
            ← 토론주제 선택하기
          </AppButton>
          <AppButton
            fullWidth={false}
            disabled={!isFormValid || isPending}
            sx={{ width: 194, height: 52, borderRadius: '18px' }}
            onClick={onSubmit}
          >
            {isPending ? (
              <CircularProgress size={16} sx={{ color: '#fff' }} />
            ) : (
              '토론상대 선택하기 →'
            )}
          </AppButton>
        </FormButtonRow>
      </NameContentCard>
    </>
  );
}

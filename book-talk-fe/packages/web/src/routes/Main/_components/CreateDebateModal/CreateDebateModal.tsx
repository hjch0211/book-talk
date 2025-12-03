import { Search } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type BookData, searchBooksQueryOptions } from '../../../../apis/book';
import {
  type CreateDebateRequest,
  createDebate,
  findOneDebateQueryOptions,
} from '../../../../apis/debate';
import Modal from '../../../../components/organisms/Modal';
import {
  BookAuthor,
  BookImage,
  BookInfo,
  BookTitle,
  FormContainer,
  ModalContainer,
  ModalTitle,
  NoResultText,
  SearchDropdown,
  SearchInputWrapper,
  SearchResultItem,
  SearchResultList,
  StyledTextField,
  SubmitButton,
} from './CreateDebateModal.style';

interface CreateDebateModalProps {
  open: boolean;
  onClose: () => void;
}

const CreateDebateModal = ({ open, onClose }: CreateDebateModalProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [topic, setTopic] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookData | null>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: searchResults, isLoading } = useQuery(
    searchBooksQueryOptions({
      query: debouncedSearchQuery,
      page: 1,
      size: 20,
    })
  );

  const createDebateMutation = useMutation({
    mutationFn: createDebate,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: findOneDebateQueryOptions().queryKey });
      // Reset form
      setTopic('');
      setSearchQuery('');
      setSelectedBook(null);
      setShowDropdown(false);
      onClose();
      navigate(`/debate/${data.id}`);
    },
    onError: (error) => {
      console.error('토론방 생성 실패:', error);
    },
  });

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setShowDropdown(true);
    if (!value) {
      setSelectedBook(null);
    }
  };

  const handleBookSelect = (book: BookData) => {
    setSelectedBook(book);
    setSearchQuery(book.title);
    setShowDropdown(false);
  };

  const handleSubmit = () => {
    if (!selectedBook || !selectedBook.isbn) {
      console.error('ISBN is required to create a debate');
      return;
    }

    const request: CreateDebateRequest = {
      bookTitle: selectedBook.title,
      bookISBN: selectedBook.isbn,
      bookAuthor: selectedBook.author,
      bookDescription: selectedBook.description,
      bookImageUrl: selectedBook.imageUrl,
      topic,
    };
    createDebateMutation.mutate(request);
  };

  const isFormValid = selectedBook && selectedBook.isbn && topic.trim();

  return (
    <Modal open={open} onClose={onClose} width={860} height={568}>
      <ModalContainer>
        <ModalTitle>토론방 생성하기</ModalTitle>

        <FormContainer>
          <SearchInputWrapper ref={searchWrapperRef}>
            <StyledTextField
              label="책 검색"
              placeholder="토론하고 싶은 책을 검색해보세요"
              variant="outlined"
              size="medium"
              fullWidth
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => searchQuery && setShowDropdown(true)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'rgba(0, 0, 0, 0.56)' }} />,
              }}
            />
            {selectedBook && (
              <Typography sx={{ mt: 1, fontSize: '12px', color: '#666' }}>
                선택된 책: {selectedBook.title}
              </Typography>
            )}
            {showDropdown && searchQuery && (
              <SearchDropdown>
                <SearchResultList>
                  {isLoading ? (
                    <NoResultText>검색 중...</NoResultText>
                  ) : searchResults?.content && searchResults.content.length > 0 ? (
                    searchResults.content.map((book, index) => (
                      <SearchResultItem key={index} onClick={() => handleBookSelect(book)}>
                        <BookImage
                          sx={{
                            backgroundImage: book.imageUrl ? `url(${book.imageUrl})` : undefined,
                          }}
                        />
                        <BookInfo>
                          <BookTitle>{book.title}</BookTitle>
                          <BookAuthor>
                            {book.author} · {book.publisher}
                          </BookAuthor>
                        </BookInfo>
                      </SearchResultItem>
                    ))
                  ) : debouncedSearchQuery ? (
                    <NoResultText>검색 결과가 없습니다</NoResultText>
                  ) : null}
                </SearchResultList>
              </SearchDropdown>
            )}
          </SearchInputWrapper>

          <StyledTextField
            label="토론 주제"
            placeholder="토론 주제를 입력해주세요"
            variant="outlined"
            size="medium"
            fullWidth
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </FormContainer>

        <SubmitButton
          onClick={handleSubmit}
          disabled={!isFormValid || createDebateMutation.isPending}
          isValid={!!isFormValid}
        >
          {createDebateMutation.isPending ? '생성 중...' : '토론방 생성'}
        </SubmitButton>
      </ModalContainer>
    </Modal>
  );
};

export default CreateDebateModal;

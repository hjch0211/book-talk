import { Search } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { meQueryOption } from '@src/externals/account';
import { signIn, signUp, validateDuplicateSignIn } from '@src/externals/auth';
import { type BookData, searchBooksQueryOptions } from '@src/externals/book';
import { type ApiError, saveTokens } from '@src/externals/client.ts';
import {
  type CreateDebateRequest,
  createDebate,
  findOneDebateQueryOptions,
} from '@src/externals/debate';
import { useToast } from '@src/hooks';
import { useDebounce } from '@src/hooks/infra/useDebounce';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from './style.ts';

interface CreateDebateModalProps {
  open: boolean;
  onClose: () => void;
}

const DebateCreationModal = ({ open, onClose }: CreateDebateModalProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [topic, setTopic] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookData | null>(null);
  const [nickname, setNickname] = useState('');
  const [nicknameValidation, setNicknameValidation] = useState<{
    status: 'idle' | 'error' | 'success';
    content: string;
  }>({ status: 'idle', content: '' });
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: me } = useQuery(meQueryOption);

  const checkNickname = useCallback(async (name: string) => {
    if (!name.trim()) {
      setNicknameValidation({ status: 'idle', content: '' });
      return;
    }

    try {
      await validateDuplicateSignIn({ name: name.trim() });
      setNicknameValidation({ status: 'success', content: '사용 가능한 닉네임입니다.' });
    } catch (_) {
      setNicknameValidation({
        status: 'error',
        content: '사용중인 닉네임입니다. 다른 닉네임을 입력해주세요.',
      });
    }
  }, []);

  const { debouncedCallback: debouncedCheckNickname } = useDebounce(checkNickname, {
    delay: 1000,
  });

  const signInMutation = useMutation({
    mutationFn: (name: string) => signIn({ name }),
    onSuccess: async (data) => {
      saveTokens(data.accessToken, data.refreshToken);
      await queryClient.invalidateQueries();
      if (selectedBook?.isbn && topic.trim()) {
        const request: CreateDebateRequest = {
          bookTitle: selectedBook.title,
          bookISBN: selectedBook.isbn,
          bookAuthor: selectedBook.author,
          bookDescription: selectedBook.description,
          bookImageUrl: selectedBook.imageUrl,
          topic,
        };
        createDebateMutation.mutate(request);
      }
    },
    onError: (error: ApiError, variables) => {
      if (error?.status === 400 && error?.message === '존재하지 않는 계정입니다.') {
        signUpMutation.mutate(variables);
      } else {
        toast.error('로그인 중 오류가 발생했습니다.');
      }
    },
  });

  const signUpMutation = useMutation({
    mutationFn: (name: string) => signUp({ name }),
    onSuccess: async (data) => {
      saveTokens(data.accessToken, data.refreshToken);
      await queryClient.invalidateQueries();
      if (selectedBook?.isbn && topic.trim()) {
        const request: CreateDebateRequest = {
          bookTitle: selectedBook.title,
          bookISBN: selectedBook.isbn,
          bookAuthor: selectedBook.author,
          bookDescription: selectedBook.description,
          bookImageUrl: selectedBook.imageUrl,
          topic,
        };
        createDebateMutation.mutate(request);
      }
    },
    onError: () => {
      toast.error('회원가입 중 오류가 발생했습니다.');
    },
  });

  const { data: searchResults, isLoading } = useQuery(
    searchBooksQueryOptions({ query: debouncedSearchQuery, page: 1, size: 20 })
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const createDebateMutation = useMutation({
    mutationFn: createDebate,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: findOneDebateQueryOptions().queryKey });
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

  const handleNicknameChange = (value: string) => {
    setNickname(value);
    debouncedCheckNickname(value);
  };

  const handleSubmit = () => {
    if (!selectedBook || !selectedBook.isbn || !topic.trim()) {
      return;
    }

    if (!me) {
      if (!nickname.trim()) {
        toast.error('닉네임을 입력해주세요.');
        return;
      }

      signInMutation.mutate(nickname.trim());
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

  const isFormValid =
    selectedBook?.isbn &&
    topic.trim() &&
    (me || (nickname.trim() && nicknameValidation.status !== 'error'));

  return (
    <Modal open={open} onClose={onClose} width={860} height={me ? 548 : 568}>
      <ModalContainer>
        <ModalTitle>토론방 생성하기</ModalTitle>

        <FormContainer>
          {!me && (
            <StyledTextField
              label="사용할 닉네임을 입력해주세요"
              placeholder="최대 5글자"
              variant="outlined"
              width="300px"
              value={nickname}
              onChange={(e) => handleNicknameChange(e.target.value)}
              error={nicknameValidation.status === 'error'}
              helperText={nicknameValidation.content}
            />
          )}

          <SearchInputWrapper ref={searchWrapperRef}>
            <StyledTextField
              label="책 제목"
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
                      <SearchResultItem key={`${index + 1}`} onClick={() => handleBookSelect(book)}>
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
          disabled={!isFormValid || createDebateMutation.isPending || signInMutation.isPending}
          isValid={!!isFormValid}
        >
          {createDebateMutation.isPending || signInMutation.isPending
            ? '생성 중...'
            : '토론방 생성'}
        </SubmitButton>
      </ModalContainer>
    </Modal>
  );
};

export default DebateCreationModal;

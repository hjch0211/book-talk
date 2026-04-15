import { zodResolver } from '@hookform/resolvers/zod';
import { type BookData, infiniteSearchBooksQueryOptions } from '@src/externals/book';
import { createDebate } from '@src/externals/debate';
import { useToast } from '@src/hooks';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const AiDebateFormSchema = z.object({
  bookISBN: z.string().min(1, { message: '책을 선택해주세요' }),
  topic: z
    .string()
    .min(1, { message: '토론 주제를 입력해주세요' })
    .max(60, { message: '토론 주제는 60자 이내로 입력해주세요' }),
  description: z.string().max(300, { message: '토론 설명은 300자 이내로 입력해주세요' }).optional(),
});

type AiDebateForm = z.infer<typeof AiDebateFormSchema>;

export function useDebateCreateStep(onSuccess: (debateId: string) => void) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookData | null>(null);

  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(infiniteSearchBooksQueryOptions(debouncedSearchQuery, 20));

  const searchResults = searchData?.pages.flatMap((p) => p.content) ?? [];

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<AiDebateForm>({
    resolver: zodResolver(AiDebateFormSchema),
    defaultValues: { bookISBN: '', topic: '', description: '' },
    mode: 'onChange',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !showDropdown) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { root: dropdownRef.current, threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [showDropdown, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const createDebateMutation = useMutation({
    mutationFn: createDebate,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries();
      onSuccess(data.id);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : '토론방 생성에 실패했습니다.');
    },
  });

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setShowDropdown(true);
    if (!value) {
      setSelectedBook(null);
      setValue('bookISBN', '');
    }
  };

  const handleSearchFocus = () => {
    if (searchQuery) setShowDropdown(true);
  };

  const handleBookSelect = (book: BookData) => {
    setSelectedBook(book);
    setSearchQuery(book.title);
    setShowDropdown(false);
    setValue('bookISBN', book.isbn, { shouldValidate: true });
  };

  const onSubmit = handleSubmit((data) => {
    if (!selectedBook) return;

    const startAt = new Date(Date.now() + 60_000).toISOString();

    createDebateMutation.mutate({
      bookTitle: selectedBook.title,
      bookISBN: selectedBook.isbn,
      bookAuthor: selectedBook.author,
      bookDescription: selectedBook.description,
      detailUrl: selectedBook.detailUrl,
      bookImageUrl: selectedBook.imageUrl,
      topic: data.topic,
      description: data.description || undefined,
      maxMemberCount: 2,
      startAt,
    });
  });

  return {
    control,
    errors,
    isFormValid: isValid,
    onSubmit,
    searchQuery,
    showDropdown,
    selectedBook,
    searchResults,
    isSearchLoading,
    isFetchingNextBooks: isFetchingNextPage,
    debouncedSearchQuery,
    searchWrapperRef,
    dropdownRef,
    sentinelRef,
    handleSearchChange,
    handleSearchFocus,
    handleBookSelect,
    isPending: createDebateMutation.isPending,
  };
}

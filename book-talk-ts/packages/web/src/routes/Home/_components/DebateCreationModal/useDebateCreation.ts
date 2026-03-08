import { zodResolver } from '@hookform/resolvers/zod';
import { meQueryOption } from '@src/externals/account';
import { type BookData, infiniteSearchBooksQueryOptions } from '@src/externals/book';
import { createDebate, type DebateForm, DebateFormSchema } from '@src/externals/debate';
import { useToast } from '@src/hooks';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export function useDebateCreation(onClose: () => void) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookData | null>(null);

  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: me } = useQuery(meQueryOption);

  const {
    data: searchData,
    isLoading: isSearchLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(infiniteSearchBooksQueryOptions(debouncedSearchQuery, 20));

  const searchResults = searchData?.pages.flatMap((p) => p.content) ?? [];

  const handleDropdownScroll = useEffectEvent(() => {
    const el = dropdownRef.current;
    if (!el || !hasNextPage || isFetchingNextPage) return;

    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 60) {
      void fetchNextPage();
    }
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<DebateForm>({
    resolver: zodResolver(DebateFormSchema),
    defaultValues: {
      topic: '',
      description: '',
      bookISBN: '',
      scheduledDate: new Date().toLocaleDateString('en-CA'),
      scheduledTime: '',
      participantCount: 2,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!showDropdown) return;
    const el = dropdownRef.current;
    if (!el) return;

    el.addEventListener('scroll', handleDropdownScroll);
    return () => el.removeEventListener('scroll', handleDropdownScroll);
  }, [showDropdown]);

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

      reset();
      setSearchQuery('');
      setSelectedBook(null);
      setShowDropdown(false);

      onClose();
      navigate(`/debate/${data.id}`);
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

    const startAt = new Date(`${data.scheduledDate}T${data.scheduledTime}`).toISOString();

    createDebateMutation.mutate({
      bookTitle: selectedBook.title,
      bookISBN: selectedBook.isbn,
      bookAuthor: selectedBook.author,
      bookDescription: selectedBook.description,
      detailUrl: selectedBook.detailUrl,
      bookImageUrl: selectedBook.imageUrl,
      topic: data.topic,
      description: data.description || undefined,
      maxMemberCount: data.participantCount,
      startAt,
    });
  });

  return {
    me,
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
    handleSearchChange,
    handleSearchFocus,
    handleBookSelect,
    isPending: createDebateMutation.isPending,
  };
}

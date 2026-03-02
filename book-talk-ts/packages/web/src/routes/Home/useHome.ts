import { meQueryOption } from '@src/externals/account';
import type { FindAllDebateInfo } from '@src/externals/debate/schema';
import { useModal, useToast } from '@src/hooks';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DebateCreationModal from './_components/DebateCreationModal';
import DebateParticipationModal from './_components/DebateParticipationModal';

export function useHome() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { openModal } = useModal();
  const { toast } = useToast();
  const { data: me } = useQuery(meQueryOption);

  const queryKeyword = searchParams.get('keyword') ?? '';
  const page = Number(searchParams.get('page') ?? '1');

  const [searchValue, setSearchValue] = useState(queryKeyword);

  const handleCreateDebate = () => {
    if (!me) {
      toast.warning('로그인이 필요합니다.');
      navigate('/sign-in');
      return;
    }
    openModal(DebateCreationModal);
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleSearch = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (searchValue) {
        next.set('keyword', searchValue);
      } else {
        next.delete('keyword');
      }
      next.set('page', '1');
      return next;
    });
  };

  const setPage = (nextPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(nextPage));
      return next;
    });
  };

  const openDebateParticipationModal = (debate: FindAllDebateInfo) => {
    if (!me) {
      toast.warning('로그인이 필요합니다.');
      navigate('/sign-in');
      return;
    }
    openModal(DebateParticipationModal, { debate, myId: me.id });
  };

  return {
    searchValue,
    handleSearchChange,
    queryKeyword,
    page,
    setPage,
    handleCreateDebate,
    handleSearch,
    openDebateParticipationModal,
  };
}

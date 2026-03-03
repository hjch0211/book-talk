import { meQueryOption } from '@src/externals/account';
import { findOneDebate } from '@src/externals/debate';
import type { FindAllDebateInfo } from '@src/externals/debate/schema';
import { useModal, useToast } from '@src/hooks';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useEffectEvent, useState } from 'react';
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
  const debateIdFromUrl = searchParams.get('debateId');

  const [searchValue, setSearchValue] = useState(queryKeyword);

  const { data: debateFromUrl } = useQuery({
    queryKey: ['debates', debateIdFromUrl, 'modal'],
    queryFn: () => findOneDebate(debateIdFromUrl!),
    enabled: !!debateIdFromUrl,
    staleTime: 1000 * 60 * 5,
  });

  const openDebateParticipationModalInner = useEffectEvent((debate: FindAllDebateInfo) => {
    openModal(DebateParticipationModal, { debate, myId: me?.id });
  });

  useEffect(() => {
    if (!debateFromUrl) return;
    openDebateParticipationModalInner({
      id: debateFromUrl.id,
      bookInfo: debateFromUrl.bookInfo,
      topic: debateFromUrl.topic,
      currentRound: debateFromUrl.currentRound?.type ?? null,
      description: debateFromUrl.description ?? null,
      maxMemberCount: debateFromUrl.maxMemberCount,
      members: debateFromUrl.members,
      closedAt: debateFromUrl.closedAt ?? null,
      startAt: debateFromUrl.startAt,
      createdAt: debateFromUrl.createdAt,
    });
  }, [debateFromUrl]);

  const handleCreateDebate = () => {
    if (!me) {
      toast.warning('로그인이 필요합니다.');
      navigate('/sign-in', {
        state: { redirect: window.location.pathname + window.location.search },
      });
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
    openModal(DebateParticipationModal, { debate, myId: me?.id });
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

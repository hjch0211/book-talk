import { meQueryOption } from '@src/externals/account';
import { findOneDebateQueryOptions, joinDebate } from '@src/externals/debate';
import { useModal, useToast } from '@src/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DebateCreationModal from './_components/DebateCreationModal';

export function useHome() {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { toast } = useToast();
  const { data: me } = useQuery(meQueryOption);
  const [searchValue, setSearchValue] = useState('');
  const [queryKeyword, setQueryKeyword] = useState('');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const handleCreateDebate = () => {
    if (!me) {
      toast.warning('로그인이 필요합니다.');
      navigate('/sign-in');
      return;
    }
    openModal(DebateCreationModal);
  };

  const handleSearch = () => {
    setQueryKeyword(searchValue);
    setPage(1);
  };

  /** 토론 참여 */
  const joinDebateMutation = useMutation({
    mutationFn: (debateId: string) => joinDebate({ debateId }),
    onSuccess: (_, debateId) => {
      void queryClient.invalidateQueries({
        queryKey: findOneDebateQueryOptions(debateId).queryKey,
      });
    },
    onError: () => {
      navigate('/debate-full');
    },
  });

  const handleApply = (id: string) => {
    // TODO: call joinDebate API then navigate
    navigate(`/debate/${id}`);
  };

  const handleEnter = (id: string) => {
    navigate(`/debate/${id}`);
  };

  return {
    searchValue,
    setSearchValue,
    queryKeyword,
    page,
    setPage,
    joinDebateMutation,
    handleCreateDebate,
    handleSearch,
    handleApply,
    handleEnter,
  };
}
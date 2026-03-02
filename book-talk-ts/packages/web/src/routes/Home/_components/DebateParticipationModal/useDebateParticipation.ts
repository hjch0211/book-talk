import { cancelDebate, findOneDebateQueryOptions, joinDebate } from '@src/externals/debate';
import type { FindAllDebateInfo } from '@src/externals/debate/schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export function useDebateParticipation(debate: FindAllDebateInfo, onClose: () => void) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const joinMutation = useMutation({
    mutationFn: () => joinDebate({ debateId: debate.id }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: findOneDebateQueryOptions(debate.id).queryKey,
      });
      onClose();
      navigate(`/debate/${debate.id}`);
    },
    onError: () => {
      navigate('/debate-full');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelDebate(debate.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['debates', 'all'] });
      onClose();
    },
  });

  return {
    handleJoin: () => joinMutation.mutate(),
    handleCancel: () => cancelMutation.mutate(),
    handleEnter: () => navigate(`/debate/${debate.id}`),
    isJoinPending: joinMutation.isPending,
    isCancelPending: cancelMutation.isPending,
  };
}

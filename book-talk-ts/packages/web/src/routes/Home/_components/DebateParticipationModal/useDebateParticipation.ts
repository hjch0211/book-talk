import { cancelDebate, joinDebate } from '@src/externals/debate';
import type { FindAllDebateInfo } from '@src/externals/debate/schema';
import { useToast } from '@src/hooks';
import { useInnerModal } from '@src/hooks/infra/useInnerModal.tsx';
import { useModal } from '@src/hooks/infra/useModal';
import DebateModificationModal from '@src/routes/Home/_components/DebateModificationModal';
import { CancelDebateModal } from '@src/routes/MyPage/_components/CancelDebateModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export function useDebateParticipation(
  debate: FindAllDebateInfo,
  onClose: () => void,
  myId?: string
) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { openModal, closeModal } = useInnerModal();
  const { openModal: openGlobalModal } = useModal();

  const handleAuthGuard = () => {
    if (!myId) {
      toast.warning('로그인이 필요합니다.');
      onClose();
      navigate('/sign-in', {
        state: { redirect: window.location.pathname + window.location.search },
      });
      return true;
    }
    return false;
  };

  const joinMutation = useMutation({
    mutationFn: () => joinDebate({ debateId: debate.id }),
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      toast.success('참여 신청이 완료되었습니다.');
      onClose();
      navigate(`/debate/${debate.id}`);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : '참여 신청에 실패했습니다.');
      onClose();
      navigate('/debate-full');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => cancelDebate(debate.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      toast.success('참여가 취소되었습니다.');
      onClose();
      await queryClient.invalidateQueries();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : '참여 취소에 실패했습니다.');
      onClose();
    },
  });

  const handleEnter = () => {
    navigate(`/debate/${debate.id}`);
    onClose();
  };

  return {
    handleJoin: () => {
      if (!handleAuthGuard()) joinMutation.mutate();
    },
    handleCancel: () => {
      if (!handleAuthGuard())
        openModal(CancelDebateModal, {
          onConfirm: () => {
            cancelMutation.mutate();
            closeModal();
          },
          isPending: cancelMutation.isPending,
        });
    },
    handleEnter: () => {
      if (!handleAuthGuard()) handleEnter();
    },
    handleEdit: () => {
      onClose();
      openGlobalModal(DebateModificationModal, { debate });
    },
    isJoinPending: joinMutation.isPending,
    isCancelPending: cancelMutation.isPending,
  };
}

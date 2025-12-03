import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchMyAccount } from '../../../../apis/account';
import type { ApiError } from '../../../../apis/client';
import { useToast } from '../../../../hooks/infra/useToast.tsx';
import NicknameModal from './NicknameModal';

interface UpdateNicknameModalProps {
  open: boolean;
  onClose: () => void;
}

const UpdateNicknameModal = ({ open, onClose }: UpdateNicknameModalProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (name: string) => patchMyAccount({ name }),
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      toast.success('닉네임이 변경되었습니다.');
      onClose();
    },
    onError: (error: ApiError) => {
      if (error?.status === 400) {
        toast.error(error?.message || '닉네임 변경 중 오류가 발생했습니다.');
      } else {
        toast.error('닉네임 변경 중 오류가 발생했습니다.');
      }
    },
  });

  const handleSubmit = (nickname: string) => {
    updateMutation.mutate(nickname);
  };

  return (
    <NicknameModal
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      isLoading={updateMutation.isPending}
      loadingMessage="닉네임을 변경하고 있습니다..."
    />
  );
};

export default UpdateNicknameModal;

import { zodResolver } from '@hookform/resolvers/zod';
import { deleteDebate, updateDebate } from '@src/externals/debate';
import {
  type DebateModificationForm,
  DebateModificationFormSchema,
  type FindAllDebateInfo,
} from '@src/externals/debate/schema';
import { useToast } from '@src/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

const KST_OFFSET = 9 * 60 * 60 * 1000;

const toKSTDateString = (isoString: string) => {
  const d = new Date(new Date(isoString).getTime() + KST_OFFSET);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
};

const toKSTTimeString = (isoString: string) => {
  const d = new Date(new Date(isoString).getTime() + KST_OFFSET);
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
};

export function useDebateModification(debate: FindAllDebateInfo, onClose: () => void) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<DebateModificationForm>({
    resolver: zodResolver(DebateModificationFormSchema),
    defaultValues: {
      topic: debate.topic,
      description: debate.description ?? '',
      participantCount: debate.maxMemberCount,
      scheduledDate: toKSTDateString(debate.startAt),
      scheduledTime: toKSTTimeString(debate.startAt),
    },
    mode: 'onChange',
  });

  const updateMutation = useMutation({
    mutationFn: (data: DebateModificationForm) => {
      const startAt = new Date(`${data.scheduledDate}T${data.scheduledTime}`).toISOString();
      return updateDebate({
        debateId: debate.id,
        roundType: debate.currentRound ?? 'PREPARATION',
        ended: false,
        topic: data.topic,
        description: data.description || undefined,
        maxMemberCount: data.participantCount,
        startAt,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      toast.success('토론 정보가 수정되었습니다.');
      onClose();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : '토론 정보 수정에 실패했습니다.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteDebate(debate.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      toast.success('토론이 삭제되었습니다.');
      onClose();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : '토론 삭제에 실패했습니다.');
    },
  });

  const onSubmit = handleSubmit((data) => updateMutation.mutate(data));

  return {
    control,
    errors,
    isFormValid: isValid,
    onSubmit,
    onDelete: () => deleteMutation.mutate(),
    isPending: updateMutation.isPending,
    isDeletePending: deleteMutation.isPending,
  };
}

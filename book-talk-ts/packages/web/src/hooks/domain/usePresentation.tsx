import {
  findOnePresentation,
  findOnePresentationQueryOptions,
  type PatchContentRequest,
  patchPresentationContent,
} from '@src/externals/presentation';
import { useJsonPatch } from '@src/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useDebounce } from '../infra/useDebounce';

interface Props {
  /** 발표 ID */
  presentationId?: string;
}

/** 발표 페이지를 저장 및 관리 */
export const usePresentation = (props: Props) => {
  const { presentationId } = props;
  const queryClient = useQueryClient();
  const queryResult = useQuery({
    ...findOnePresentationQueryOptions(presentationId),
    enabled: !!presentationId,
  });
  const { compare } = useJsonPatch();

  const fetchPresentation = useCallback(
    async (id: string) => {
      return await queryClient.fetchQuery({
        queryKey: ['presentation', id],
        queryFn: () => findOnePresentation(id),
      });
    },
    [queryClient]
  );

  const patchPresentation = useMutation({
    mutationFn: ({ id, patches }: { id: string; patches: PatchContentRequest[] }) =>
      patchPresentationContent(id, patches),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['presentation', variables.id],
      });
    },
  });

  const savePresentation = useCallback(
    async (editorJsonData: any) => {
      if (!editorJsonData || !presentationId) return;

      await patchPresentation.mutateAsync({
        id: presentationId,
        patches: compare(JSON.parse(queryResult.data?.content || '{}'), editorJsonData),
      });
    },
    [compare, patchPresentation, presentationId, queryResult.data?.content]
  );

  const { debouncedCallback: autoSave, isDebouncing } = useDebounce(savePresentation, {
    delay: 1000,
  });

  const lastSavedAt = useMemo(() => {
    if (queryResult.data?.lastUpdatedAt) {
      return new Date(queryResult.data.lastUpdatedAt);
    }
    return null;
  }, [queryResult.data?.lastUpdatedAt]);

  return {
    currentPresentation: queryResult.data,
    fetchPresentation,
    autoSave,
    lastSavedAt,
    isSaving: patchPresentation.isPending || isDebouncing,
    isLoading: queryResult.isLoading,
  };
};

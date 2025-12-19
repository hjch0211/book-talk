import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useRef, useState } from 'react';
import {
  findOnePresentation,
  findOnePresentationQueryOptions,
  type PatchContentRequest,
  patchPresentationContent,
} from '../../apis/presentation';
import { useJsonPatch } from '../infra/useJsonPatch.tsx';

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
  const debounceTimerRef = useRef<number | null>(null);
  const [isDebouncing, setIsDebouncing] = useState(false);
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

  const autoSave = useCallback(
    (editorJsonData: any) => {
      if (!editorJsonData || !presentationId) return;

      // 디바운스 시작 플래그 설정
      setIsDebouncing(true);

      // 기존 타이머 클리어
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // 1초 후 자동 저장
      debounceTimerRef.current = window.setTimeout(async () => {
        try {
          await patchPresentation.mutateAsync({
            id: presentationId,
            patches: compare(JSON.parse(queryResult.data?.content || '{}'), editorJsonData),
          });
        } catch (error) {
          console.error('Auto save failed:', error);
        } finally {
          setIsDebouncing(false);
        }
      }, 1000);
    },
    [compare, patchPresentation, presentationId, queryResult.data?.content]
  );

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

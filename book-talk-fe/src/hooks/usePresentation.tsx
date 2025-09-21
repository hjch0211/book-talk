import {useMutation, useQueryClient, useSuspenseQuery} from '@tanstack/react-query';
import {
    findOnePresentation,
    findOnePresentationQueryOptions,
    type PatchContentRequest,
    patchPresentationContent
} from '../apis/presentation';
import {useCallback, useMemo, useRef} from 'react';
import {useJsonPatch} from "./useJsonPatch.tsx";

export const usePresentation = (
    presentationId: string | null,
) => {
    const queryClient = useQueryClient();
    const suspenseResult = useSuspenseQuery(findOnePresentationQueryOptions(presentationId ?? undefined));
    const debounceTimerRef = useRef<number | null>(null);
    const {compare} = useJsonPatch()

    const fetchPresentation = useCallback(async (id: string) => {
        return await queryClient.fetchQuery({
            queryKey: ['presentation', id],
            queryFn: () => findOnePresentation(id),
        });
    }, [queryClient]);

    const patchPresentation = useMutation({
        mutationFn: ({id, patches}: { id: string; patches: PatchContentRequest[] }) =>
            patchPresentationContent(id, patches),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['presentation', variables.id]
            });
        },
    });

    const autoSave = useCallback((editorJsonData: any) => {
        if (!editorJsonData || !presentationId) return;

        // 기존 타이머 클리어
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // 1초 후 자동 저장
        debounceTimerRef.current = window.setTimeout(async () => {
            const res = compare(JSON.parse(suspenseResult.data.content), editorJsonData);
            console.log(suspenseResult.data.content, editorJsonData, res)

            try {
                await patchPresentation.mutateAsync({
                    id: presentationId,
                    patches: compare(JSON.parse(suspenseResult.data.content), editorJsonData)
                });
            } catch (error) {
                console.error('Auto save failed:', error);
            }
        }, 1000);
    }, [compare, patchPresentation, presentationId, suspenseResult.data.content]);

    const lastSavedAt = useMemo(() => {
        if (suspenseResult.data?.lastUpdatedAt) {
            return new Date(suspenseResult.data.lastUpdatedAt);
        }
        return null;
    }, [suspenseResult.data?.lastUpdatedAt]);

    return {
        currentPresentation: suspenseResult.data,
        fetchPresentation,
        autoSave,
        lastSavedAt
    };
};
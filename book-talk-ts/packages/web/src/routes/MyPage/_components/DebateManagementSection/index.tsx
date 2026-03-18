import { Box, CircularProgress } from '@mui/material';
import { AppButton } from '@src/components/molecules/AppButton';
import { SuspenseErrorBoundary } from '@src/components/molecules/SuspenseErrorBoundary';
import { DebateCard } from '@src/components/organisms/DebateCard';
import { DebateCardSkeleton } from '@src/components/organisms/DebateCard/skeleton.tsx';
import { type FindAllDebateInfo, myPageDebatesQueryOptions } from '@src/externals/debate';
import { cancelDebate } from '@src/externals/debate/api.ts';
import { useToast } from '@src/hooks';
import { useInnerModal } from '@src/hooks/infra/useInnerModal';
import {
  CardGrid,
  CardRow,
  DebateListSectionRoot,
} from '@src/routes/Home/_components/DebateListSection/style.ts';
import { CancelDebateModal } from '@src/routes/MyPage/_components/CancelDebateModal';
import {
  DebateSection,
  EmptyText,
  SectionTitle,
} from '@src/routes/MyPage/_components/DebateManagementSection/style.ts';
import { ChipGroup, FilterChipBox, FilterChipText } from '@src/routes/MyPage/style.ts';
import { useMutation, useQueryClient, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useEffectEvent, useRef, useState } from 'react';

type FilterChip = 'applied' | 'created' | 'joined';
const SECTION_TITLES: Record<FilterChip, string> = {
  applied: '신청한 토론방',
  created: '생성한 토론방',
  joined: '참여 완료한 토론방',
};

interface MyProfileDebateListSectionProps {
  debates: FindAllDebateInfo[];
  myId: string;
  filterChip: FilterChip;
  onCardClick: (debate: FindAllDebateInfo) => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

function MyProfileDebateListSection({
  debates,
  myId,
  filterChip,
  onCardClick,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: MyProfileDebateListSectionProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { openModal, closeModal } = useInnerModal();

  const handleLoadMore = useEffectEvent(() => onLoadMore());

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) handleLoadMore();
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage]);

  const cancelMutation = useMutation({
    mutationFn: (debateId: string) => cancelDebate(debateId),
    onSuccess: async () => {
      await queryClient.invalidateQueries();
      closeModal();
      toast.success('신청이 취소되었습니다.');
    },
    onError: () => {
      closeModal();
    },
  });

  const rows: FindAllDebateInfo[][] = [];
  for (let i = 0; i < debates.length; i += 4) {
    rows.push(debates.slice(i, i + 4));
  }

  return (
    <DebateListSectionRoot>
      <CardGrid>
        {rows.map((row, rowIndex) => (
          <CardRow key={`${rowIndex + 1}`}>
            {row.map((debate) => (
              <DebateCard key={debate.id} data={debate}>
                {filterChip === 'joined' ? null : filterChip === 'applied' ? (
                  <Box sx={{ display: 'flex', gap: '6px' }}>
                    <AppButton
                      appVariant="transparent"
                      fullWidth={false}
                      style={{ width: 98, height: 36, borderRadius: 10, fontSize: 12 }}
                      onClick={() =>
                        openModal(CancelDebateModal, {
                          onConfirm: () => cancelMutation.mutate(debate.id),
                          isPending: cancelMutation.isPending,
                        })
                      }
                    >
                      신청 취소
                    </AppButton>
                    <AppButton
                      appVariant="debate-join"
                      fullWidth={false}
                      style={{ width: 150, height: 36, borderRadius: 10, fontSize: 12 }}
                      onClick={() => onCardClick(debate)}
                    >
                      토론방 입장
                    </AppButton>
                  </Box>
                ) : (
                  <AppButton
                    appVariant={
                      debate.members.some((m) => m.id === myId) ? 'debate-enter' : 'debate-join'
                    }
                    onClick={() => onCardClick(debate)}
                  >
                    {debate.members.some((m) => m.id === myId) ? '토론방 입장하기' : '참여신청하기'}
                  </AppButton>
                )}
              </DebateCard>
            ))}
          </CardRow>
        ))}
      </CardGrid>
      <div ref={sentinelRef} style={{ height: 1 }} />
      {isFetchingNextPage && <CircularProgress size={24} sx={{ alignSelf: 'center' }} />}
    </DebateListSectionRoot>
  );
}

interface DebateManagementContentProps {
  myId: string;
  filterChip: FilterChip;
  onCardClick: (debate: FindAllDebateInfo) => void;
}

function DebateManagementContent({ myId, filterChip, onCardClick }: DebateManagementContentProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(
    myPageDebatesQueryOptions({ size: 8, hostId: myId })
  );

  const allDebates = data.pages.flatMap((p) => p.page.content);

  const filteredDebates = allDebates.filter((debate) => {
    if (filterChip === 'applied')
      return debate.members.some((m) => m.id === myId && m.role === 'MEMBER') && !debate.closedAt;
    if (filterChip === 'created')
      return debate.members.some((m) => m.id === myId && m.role === 'HOST') && !debate.closedAt;
    if (filterChip === 'joined')
      return debate.members.some((m) => m.id === myId) && !!debate.closedAt;
    return false;
  });

  if (filteredDebates.length === 0 && !hasNextPage) {
    return <EmptyText>표시할 토론방이 없습니다.</EmptyText>;
  }

  return (
    <MyProfileDebateListSection
      debates={filteredDebates}
      myId={myId}
      filterChip={filterChip}
      onCardClick={onCardClick}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      onLoadMore={fetchNextPage}
    />
  );
}

interface Props {
  myId?: string;
  onCardClick: (debate: FindAllDebateInfo) => void;
}

export const DebateManagementSection = ({ myId, onCardClick }: Props) => {
  const [filterChip, setFilterChip] = useState<FilterChip>('applied');

  return (
    <DebateSection>
      <ChipGroup>
        {(['applied', 'created', 'joined'] as FilterChip[]).map((chip) => (
          <FilterChipBox
            key={chip}
            active={filterChip === chip}
            onClick={() => setFilterChip(chip)}
          >
            <FilterChipText active={filterChip === chip}>{SECTION_TITLES[chip]}</FilterChipText>
          </FilterChipBox>
        ))}
      </ChipGroup>
      <SectionTitle>{SECTION_TITLES[filterChip]}</SectionTitle>
      <SuspenseErrorBoundary onSuspense={<DebateListSkeleton />} onError={<DebateListSkeleton />}>
        <DebateManagementContent myId={myId!} filterChip={filterChip} onCardClick={onCardClick} />
      </SuspenseErrorBoundary>
    </DebateSection>
  );
};

function DebateListSkeleton() {
  return (
    <DebateListSectionRoot>
      <CardGrid>
        <CardRow>
          {[0, 1, 2, 3].map((i) => (
            <DebateCardSkeleton key={i} />
          ))}
        </CardRow>
        <CardRow>
          {[4, 5, 6, 7].map((i) => (
            <DebateCardSkeleton key={i} />
          ))}
        </CardRow>
      </CardGrid>
    </DebateListSectionRoot>
  );
}

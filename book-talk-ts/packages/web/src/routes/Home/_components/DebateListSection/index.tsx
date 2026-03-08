import { CircularProgress } from '@mui/material';
import { AppButton } from '@src/components/molecules/AppButton';
import { AppPagination } from '@src/components/molecules/AppPagination';
import { DebateCard } from '@src/components/organisms/DebateCard';
import { DebateCardSkeleton } from '@src/components/organisms/DebateCard/skeleton.tsx';
import type { FindAllDebateInfo } from '@src/externals/debate/schema.ts';
import { useEffect, useEffectEvent, useRef } from 'react';
import { CardGrid, CardRow, DebateListSectionRoot, PaginationWrapper } from './style.ts';

interface DebateListSectionProps {
  debates: FindAllDebateInfo[];
  totalPages: number;
  page: number;
  myId?: string;
  onButtonClick: (debate: FindAllDebateInfo) => void;
  onPageChange: (page: number) => void;
}

export function DebateListSection({
  debates,
  totalPages,
  page,
  myId,
  onButtonClick,
  onPageChange,
}: DebateListSectionProps) {
  const row1 = debates.slice(0, 4);
  const row2 = debates.slice(4, 8);

  return (
    <DebateListSectionRoot>
      <CardGrid>
        {row1.length > 0 && (
          <CardRow>
            {row1.map((debate) => {
              const isEntered = !!debate.members.find((m) => m.id === myId);
              return (
                <DebateCard key={debate.id} data={debate}>
                  {!debate.closedAt && (
                    <AppButton
                      appVariant={isEntered ? 'debate-enter' : 'debate-join'}
                      onClick={() => onButtonClick(debate)}
                    >
                      {isEntered ? '토론방 입장하기' : '참여신청하기'}
                    </AppButton>
                  )}
                </DebateCard>
              );
            })}
          </CardRow>
        )}
        {row2.length > 0 && (
          <CardRow>
            {row2.map((debate) => {
              const isEntered = !!debate.members.find((m) => m.id === myId);
              return (
                <DebateCard key={debate.id} data={debate}>
                  {!debate.closedAt && (
                    <AppButton
                      appVariant={isEntered ? 'debate-enter' : 'debate-join'}
                      onClick={() => onButtonClick(debate)}
                    >
                      {isEntered ? '토론방 입장하기' : '참여신청하기'}
                    </AppButton>
                  )}
                </DebateCard>
              );
            })}
          </CardRow>
        )}
      </CardGrid>
      <PaginationWrapper>
        <AppPagination count={totalPages} page={page} onChange={onPageChange} />
      </PaginationWrapper>
    </DebateListSectionRoot>
  );
}

interface InfiniteDebateListSectionProps {
  debates: FindAllDebateInfo[];
  myId: string;
  onButtonClick: (debate: FindAllDebateInfo) => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  showButton?: boolean;
}

export function InfiniteDebateListSection({
  debates,
  myId,
  onButtonClick,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  showButton = true,
}: InfiniteDebateListSectionProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleLoadMore = useEffectEvent(() => onLoadMore());

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage]);

  const rows: FindAllDebateInfo[][] = [];
  for (let i = 0; i < debates.length; i += 4) {
    rows.push(debates.slice(i, i + 4));
  }

  return (
    <DebateListSectionRoot>
      <CardGrid>
        {rows.map((row, rowIndex) => (
          <CardRow key={`${rowIndex + 1}`}>
            {row.map((debate) => {
              const isEntered = !!debate.members.find((m) => m.id === myId);
              return (
                <DebateCard key={debate.id} data={debate}>
                  {showButton && !debate.closedAt && (
                    <AppButton
                      appVariant={isEntered ? 'debate-enter' : 'debate-join'}
                      onClick={() => onButtonClick(debate)}
                    >
                      {isEntered ? '토론방 입장하기' : '참여신청하기'}
                    </AppButton>
                  )}
                </DebateCard>
              );
            })}
          </CardRow>
        ))}
      </CardGrid>
      <div ref={sentinelRef} style={{ height: 1 }} />
      {isFetchingNextPage && <CircularProgress size={24} sx={{ alignSelf: 'center' }} />}
    </DebateListSectionRoot>
  );
}

export function DebateListSkeleton() {
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

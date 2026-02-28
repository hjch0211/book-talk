import { AppPagination } from '@src/components/molecules/AppPagination';
import { DebateCard } from '@src/components/organisms/DebateCard';
import { DebateCardSkeleton } from '@src/components/organisms/DebateCard/skeleton';
import type { FindAllDebateInfo } from '@src/externals/debate/schema';
import { CardGrid, CardRow, DebateListSectionRoot, PaginationWrapper } from './style';

interface DebateListSectionProps {
  debates: FindAllDebateInfo[];
  totalPages: number;
  page: number;
  onApply: (id: string) => void;
  onEnter: (id: string) => void;
  onPageChange: (page: number) => void;
}

export function DebateListSection({
  debates,
  totalPages,
  page,
  onApply,
  onEnter,
  onPageChange,
}: DebateListSectionProps) {
  const row1 = debates.slice(0, 4);
  const row2 = debates.slice(4, 8);

  return (
    <DebateListSectionRoot>
      <CardGrid>
        {row1.length > 0 && (
          <CardRow>
            {row1.map((debate) => (
              <DebateCard key={debate.id} data={debate} onApply={onApply} onEnter={onEnter} />
            ))}
          </CardRow>
        )}
        {row2.length > 0 && (
          <CardRow>
            {row2.map((debate) => (
              <DebateCard key={debate.id} data={debate} onApply={onApply} onEnter={onEnter} />
            ))}
          </CardRow>
        )}
      </CardGrid>
      <PaginationWrapper>
        <AppPagination count={totalPages} page={page} onChange={onPageChange} />
      </PaginationWrapper>
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

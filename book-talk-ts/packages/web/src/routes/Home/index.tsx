import { AppButton } from '@src/components/molecules/AppButton';
import { SearchInput } from '@src/components/molecules/SearchInput';
import AppHeader from '@src/components/organisms/AppHeader';
import { DebateListSection, DebateListSkeleton } from '@src/components/templates/DebateListSection';
import PageContainer from '@src/components/templates/PageContainer';
import { findAllDebatesQueryOptions } from '@src/externals/debate/queryOptions';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ContentWrapper, CreateButtonWrapper, SearchRow } from './style';
import { useHome } from './useHome';

const CARDS_PER_PAGE = 8;

interface DebateListLoaderProps {
  page: number;
  queryKeyword: string;
  onApply: (id: string) => void;
  onEnter: (id: string) => void;
  onPageChange: (page: number) => void;
}

function DebateListContent({
  page,
  queryKeyword,
  onApply,
  onEnter,
  onPageChange,
}: DebateListLoaderProps) {
  const { data } = useSuspenseQuery(
    findAllDebatesQueryOptions({ page: page - 1, size: CARDS_PER_PAGE, keyword: queryKeyword })
  );

  return (
    <DebateListSection
      debates={data.page.content}
      totalPages={data.page.totalPages}
      page={page}
      onApply={onApply}
      onEnter={onEnter}
      onPageChange={onPageChange}
    />
  );
}

export function HomePage() {
  const {
    searchValue,
    setSearchValue,
    queryKeyword,
    page,
    setPage,
    handleCreateDebate,
    handleSearch,
    handleApply,
    handleEnter,
  } = useHome();

  return (
    <PageContainer bgColor="#FFFFFF" isRelative>
      <AppHeader />

      <ContentWrapper>
        <SearchRow>
          <SearchInput value={searchValue} onChange={setSearchValue} onSearch={handleSearch} />
          <CreateButtonWrapper>
            <AppButton appVariant="filled" onClick={handleCreateDebate}>
              + 토론방 만들기
            </AppButton>
          </CreateButtonWrapper>
        </SearchRow>

        <Suspense fallback={<DebateListSkeleton />}>
          <DebateListContent
            page={page}
            queryKeyword={queryKeyword}
            onApply={handleApply}
            onEnter={handleEnter}
            onPageChange={setPage}
          />
        </Suspense>
      </ContentWrapper>
    </PageContainer>
  );
}

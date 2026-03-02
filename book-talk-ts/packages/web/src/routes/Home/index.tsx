import { AppButton } from '@src/components/molecules/AppButton';
import { SearchInput } from '@src/components/molecules/SearchInput';
import AppHeader from '@src/components/organisms/AppHeader';
import PageContainer from '@src/components/templates/PageContainer';
import { meQueryOption } from '@src/externals/account';
import { findAllDebatesQueryOptions } from '@src/externals/debate/queryOptions';
import type { FindAllDebateInfo } from '@src/externals/debate/schema';
import {
  DebateListSection,
  DebateListSkeleton,
} from '@src/routes/Home/_components/DebateListSection';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ContentWrapper, CreateButtonWrapper, SearchResultLabel, SearchRow } from './style';
import { useHome } from './useHome';

const CARDS_PER_PAGE = 8;

interface DebateListLoaderProps {
  page: number;
  queryKeyword: string;
  onButtonClick: (debate: FindAllDebateInfo) => void;
  onPageChange: (page: number) => void;
}

function DebateListContent({
  page,
  queryKeyword,
  onButtonClick,
  onPageChange,
}: DebateListLoaderProps) {
  const { data } = useSuspenseQuery(
    findAllDebatesQueryOptions({ page: page - 1, size: CARDS_PER_PAGE, keyword: queryKeyword })
  );
  const { data: me } = useSuspenseQuery(meQueryOption);
  if (!me) return null;

  return (
    <DebateListSection
      debates={data.page.content}
      totalPages={data.page.totalPages}
      page={page}
      myId={me?.id}
      onButtonClick={onButtonClick}
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
    openDebateParticipationModal,
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

        {queryKeyword && (
          <SearchResultLabel>{`'${queryKeyword}' 검색어에 대한 결과`}</SearchResultLabel>
        )}

        <Suspense fallback={<DebateListSkeleton />}>
          <DebateListContent
            page={page}
            queryKeyword={queryKeyword}
            onButtonClick={openDebateParticipationModal}
            onPageChange={setPage}
          />
        </Suspense>
      </ContentWrapper>
    </PageContainer>
  );
}

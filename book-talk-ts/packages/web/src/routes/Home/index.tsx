import { SuspenseErrorBoundary } from '@src/components';
import { AppButton } from '@src/components/molecules/AppButton';
import { SearchInput } from '@src/components/molecules/SearchInput';
import AppHeader from '@src/components/organisms/AppHeader';
import { DebateCard } from '@src/components/organisms/DebateCard';
import { MobileUnsupportedModal } from '@src/components/organisms/MobileUnsupportedModal';
import PageContainer from '@src/components/templates/PageContainer';
import { meQueryOption } from '@src/externals/account';
import { findAllDebatesQueryOptions } from '@src/externals/debate/queryOptions';
import type { FindAllDebateInfo } from '@src/externals/debate/schema';
import {
  DebateListSection,
  DebateListSkeleton,
} from '@src/routes/Home/_components/DebateListSection';
import { CardRow } from '@src/routes/Home/_components/DebateListSection/style';
import { useSuspenseQuery } from '@tanstack/react-query';
import {
  ContentWrapper,
  CreateButtonWrapper,
  DebateSectionWrapper,
  EmptyStateText,
  EmptyStateWrapper,
  SearchResultLabel,
  SearchRow,
  TwoSectionWrapper,
} from './style';
import { useHome } from './useHome';

const CARDS_PER_PAGE = 8;

interface OtherDebatesSectionProps {
  excludeIds: Set<string>;
  myId?: string;
  onButtonClick: (debate: FindAllDebateInfo) => void;
}

function OtherDebatesSection({ excludeIds, myId, onButtonClick }: OtherDebatesSectionProps) {
  const { data } = useSuspenseQuery(findAllDebatesQueryOptions({ page: 0, size: 8 }));
  const others = data.page.content.filter((d) => !excludeIds.has(d.id)).slice(0, 4);

  if (others.length === 0) return null;

  return (
    <DebateSectionWrapper>
      <SearchResultLabel>이 외의 모집중인 토론방</SearchResultLabel>
      <CardRow>
        {others.map((debate) => {
          const isEntered = !!debate.members.find((m) => m.id === myId);
          return (
            <DebateCard key={debate.id} data={debate}>
              <AppButton
                appVariant={isEntered ? 'debate-enter' : 'debate-join'}
                onClick={() => onButtonClick(debate)}
              >
                {isEntered ? '토론방 입장하기' : '참여신청하기'}
              </AppButton>
            </DebateCard>
          );
        })}
      </CardRow>
    </DebateSectionWrapper>
  );
}

interface DebateListLoaderProps {
  page: number;
  queryKeyword: string;
  onButtonClick: (debate: FindAllDebateInfo) => void;
  onPageChange: (page: number) => void;
  onCreateDebate: () => void;
}

function DebateListContent({
  page,
  queryKeyword,
  onButtonClick,
  onPageChange,
  onCreateDebate,
}: DebateListLoaderProps) {
  const { data } = useSuspenseQuery(
    findAllDebatesQueryOptions({
      page: page - 1,
      size: CARDS_PER_PAGE,
      keyword: queryKeyword,
    })
  );
  const { data: me } = useSuspenseQuery(meQueryOption);

  if (data.page.content.length === 0) {
    return (
      <EmptyStateWrapper>
        <EmptyStateText>
          검색결과가 없습니다.
          <br />
          토론방 만들기를 통해 원하는 책의 토론방을 직접 만들어보세요!
        </EmptyStateText>
        <AppButton appVariant="filled" onClick={onCreateDebate} sx={{ width: 180, height: 48 }}>
          + 토론방 만들기
        </AppButton>
      </EmptyStateWrapper>
    );
  }

  if (queryKeyword && data.page.content.length <= 4) {
    const searchIds = new Set(data.page.content.map((d) => d.id));
    return (
      <TwoSectionWrapper>
        <CardRow>
          {data.page.content.map((debate) => {
            const isEntered = !!debate.members.find((m) => m.id === me?.id);
            return (
              <DebateCard key={debate.id} data={debate}>
                <AppButton
                  appVariant={isEntered ? 'debate-enter' : 'debate-join'}
                  onClick={() => onButtonClick(debate)}
                >
                  {isEntered ? '토론방 입장하기' : '참여신청하기'}
                </AppButton>
              </DebateCard>
            );
          })}
        </CardRow>
        <SuspenseErrorBoundary onSuspense={null} onError={null}>
          <OtherDebatesSection excludeIds={searchIds} myId={me?.id} onButtonClick={onButtonClick} />
        </SuspenseErrorBoundary>
      </TwoSectionWrapper>
    );
  }

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
    handleSearchChange,
    queryKeyword,
    page,
    setPage,
    handleCreateDebate,
    handleSearch,
    openDebateParticipationModal,
  } = useHome();

  return (
    <PageContainer bgColor="#FFFFFF" isRelative>
      <MobileUnsupportedModal />
      <AppHeader />

      <ContentWrapper>
        <SearchRow>
          <SearchInput value={searchValue} onChange={handleSearchChange} onSearch={handleSearch} />
          <CreateButtonWrapper>
            <AppButton appVariant="filled" onClick={handleCreateDebate}>
              + 토론방 만들기
            </AppButton>
          </CreateButtonWrapper>
        </SearchRow>

        {queryKeyword && (
          <SearchResultLabel>{`'${queryKeyword}' 검색어에 대한 결과`}</SearchResultLabel>
        )}

        <SuspenseErrorBoundary onSuspense={<DebateListSkeleton />} onError={<DebateListSkeleton />}>
          <DebateListContent
            page={page}
            queryKeyword={queryKeyword}
            onButtonClick={openDebateParticipationModal}
            onPageChange={setPage}
            onCreateDebate={handleCreateDebate}
          />
        </SuspenseErrorBoundary>
      </ContentWrapper>
    </PageContainer>
  );
}

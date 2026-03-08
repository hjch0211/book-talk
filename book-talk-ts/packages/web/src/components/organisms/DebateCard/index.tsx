import type { FindAllDebateInfo } from '@src/externals/debate/schema';
import type { ReactNode } from 'react';
import {
  CardBody,
  CardClubTitle,
  CardCountGroup,
  CardCurrentCount,
  CardDate,
  CardDescription,
  CardDivider,
  CardImage,
  CardImageWrapper,
  CardMaxCount,
  CardMaxCountWrapper,
  CardPeopleRow,
  CardPersonIcon,
  CardRoot,
  CardTitleSection,
  CardTopic,
} from './style.ts';

function formatKoreanDate(isoString: string): string {
  const date = new Date(isoString);
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const month = kstDate.getUTCMonth() + 1;
  const day = kstDate.getUTCDate();
  const hour = kstDate.getUTCHours();
  return `${month}월 ${day}일 ${hour}시`;
}

interface DebateCardProps {
  data: FindAllDebateInfo;
  children: ReactNode;
}

export function DebateCard({ data, children }: DebateCardProps) {
  const scheduledAt = formatKoreanDate(data.startAt);

  return (
    <CardRoot>
      <CardImageWrapper>
        <CardImage imageUrl={data.bookInfo.imageUrl} />
      </CardImageWrapper>

      <CardBody>
        <CardTitleSection>
          <CardClubTitle>{data.bookInfo.title}</CardClubTitle>
          <CardDivider />
        </CardTitleSection>
        <CardTopic>{data.topic}</CardTopic>
        <CardDescription>{data.description}</CardDescription>
        <CardPeopleRow>
          <CardCountGroup>
            <CardPersonIcon />
            <CardCurrentCount>{data.members.length}</CardCurrentCount>
            <CardMaxCountWrapper>
              <CardMaxCount>/{data.maxMemberCount}</CardMaxCount>
            </CardMaxCountWrapper>
          </CardCountGroup>
          <CardDate>{scheduledAt}</CardDate>
        </CardPeopleRow>

        {children}
      </CardBody>
    </CardRoot>
  );
}

import type { FindAllDebateInfo } from '@src/externals/debate/schema';
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
  DebateCardButton,
} from './style.ts';

export type DebateCardData = FindAllDebateInfo;

function formatKoreanDate(isoString: string): string {
  const date = new Date(isoString);
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const month = kstDate.getUTCMonth() + 1;
  const day = kstDate.getUTCDate();
  const hour = kstDate.getUTCHours();
  return `${month}월 ${day}일 ${hour}시`;
}

interface DebateCardProps {
  data: DebateCardData;
  onApply?: (id: string) => void;
  onEnter?: (id: string) => void;
}

export function DebateCard({ data, onApply, onEnter }: DebateCardProps) {
  const isActive = data.closedAt === null;
  const scheduledAt = formatKoreanDate(data.startAt);

  const handleButtonClick = () => {
    if (isActive) {
      onEnter?.(data.id);
    } else {
      onApply?.(data.id);
    }
  };

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
            <CardCurrentCount>{data.currentMemberCount}</CardCurrentCount>
            <CardMaxCountWrapper>
              <CardMaxCount>/{data.maxMemberCount}</CardMaxCount>
            </CardMaxCountWrapper>
          </CardCountGroup>
          <CardDate>{scheduledAt}</CardDate>
        </CardPeopleRow>

        <DebateCardButton isActive={isActive} onClick={handleButtonClick} disableRipple>
          {isActive ? '토론방 입장하기' : '참여신청하기'}
        </DebateCardButton>
      </CardBody>
    </CardRoot>
  );
}

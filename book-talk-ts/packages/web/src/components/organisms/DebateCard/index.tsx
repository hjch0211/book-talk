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

function formatKoreanDate(isoString: string): string {
  const date = new Date(isoString);
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const month = kstDate.getUTCMonth() + 1;
  const day = kstDate.getUTCDate();
  const hour = kstDate.getUTCHours();
  return `${month}월 ${day}일 ${hour}시`;
}

interface DebateCardProps {
  myId: string;
  data: FindAllDebateInfo;
  onButtonClick?: (debate: FindAllDebateInfo) => void;
}

export function DebateCard({ myId, data, onButtonClick }: DebateCardProps) {
  const isEntered = !!data.members.find((m) => m.id === myId);
  const scheduledAt = formatKoreanDate(data.startAt);

  const handleButtonClick = () => {
    onButtonClick?.(data);
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
            <CardCurrentCount>{data.members.length}</CardCurrentCount>
            <CardMaxCountWrapper>
              <CardMaxCount>/{data.maxMemberCount}</CardMaxCount>
            </CardMaxCountWrapper>
          </CardCountGroup>
          <CardDate>{scheduledAt}</CardDate>
        </CardPeopleRow>

        <DebateCardButton isEntered={isEntered} onClick={handleButtonClick} disableRipple>
          {isEntered ? '참여신청하기' : '토론방 입장하기'}
        </DebateCardButton>
      </CardBody>
    </CardRoot>
  );
}

import { Typography } from '@mui/material';
import type { FindAllDebateInfo } from '@src/externals/debate/schema';
import type { ReactNode } from 'react';
import {
  CardBody,
  CardCountGroup,
  CardDivider,
  CardImage,
  CardImageWrapper,
  CardMaxCount,
  CardMaxCountWrapper,
  CardPeopleRow,
  CardPersonIcon,
  CardRoot,
  CardTitleSection,
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
          <Typography variant="labelS" color="#000000" noWrap sx={{ flexShrink: 0 }}>
            {data.bookInfo.title}
          </Typography>
          <CardDivider />
        </CardTitleSection>

        <Typography variant="labelM" color="#000000" noWrap sx={{ flexShrink: 0 }}>
          {data.topic}
        </Typography>

        <Typography
          variant="captionS"
          color="#000000"
          sx={{
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {data.description}
        </Typography>

        <CardPeopleRow>
          <CardCountGroup>
            <CardPersonIcon />
            <Typography variant="labelL" color="#262626" textAlign="center">
              {data.members.length}
            </Typography>
            <CardMaxCountWrapper>
              <CardMaxCount>
                <Typography variant="captionS" color="#262626" textAlign="center">
                  /{data.maxMemberCount}
                </Typography>
              </CardMaxCount>
            </CardMaxCountWrapper>
          </CardCountGroup>
          <Typography variant="captionS" color="#262626">
            {scheduledAt}
          </Typography>
        </CardPeopleRow>

        {children}
      </CardBody>
    </CardRoot>
  );
}

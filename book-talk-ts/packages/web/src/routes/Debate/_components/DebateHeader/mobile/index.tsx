import { Typography } from '@mui/material';
import aiBotSvg from '@src/assets/ai-bot.svg';
import { AppTooltip } from '@src/components/organisms/AppTooltip';
import {
  MobileAiBoogieButton,
  MobileNavBarStyled,
  MobileNavIcons,
  MobileNavTitle,
} from '../style.ts';

interface Props {
  topic: string;
  isHost: boolean;
  isDebateActive: boolean;
  onOpenAiSummarization: () => void;
  onShareLink: () => void;
  onLeave: () => void;
  onEndDebate: () => Promise<void>;
}

export function MobileNavBar({
  topic,
  isHost,
  isDebateActive,
  onOpenAiSummarization,
  onShareLink,
  onLeave,
  onEndDebate,
}: Props) {
  return (
    <MobileNavBarStyled>
      <MobileNavTitle>
        <Typography variant="labelS">{topic}</Typography>
      </MobileNavTitle>
      <MobileNavIcons>
        <MobileAiBoogieButton onClick={onOpenAiSummarization}>
          <img src={aiBotSvg} alt="AI Bot" width={40} height={40} />
        </MobileAiBoogieButton>
        <AppTooltip>
          <AppTooltip.Item onClick={onShareLink}>초대링크 복사</AppTooltip.Item>
          <AppTooltip.Item onClick={onLeave}>토론방 나가기</AppTooltip.Item>
          <AppTooltip.Item show={isHost && isDebateActive} onClick={() => void onEndDebate()}>
            토론 종료
          </AppTooltip.Item>
        </AppTooltip>
      </MobileNavIcons>
    </MobileNavBarStyled>
  );
}

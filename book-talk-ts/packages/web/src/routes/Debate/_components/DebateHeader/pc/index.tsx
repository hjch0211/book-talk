import { Divider } from '@mui/material';
import type { Debate } from '@src/externals/debate';
import aiBotSvg from '@src/assets/ai-bot.svg';
import leaveIconSvg from '@src/assets/leave.svg';
import userAddIconSvg from '@src/assets/user-add.svg';
import {
  DebateTitle,
  NavButton,
  NavButtonGroup,
  NavButtonsSubGroup,
  NavContent,
  NavigationBar,
} from '../style.ts';

interface Props {
  debate: Debate;
  isHost: boolean;
  endDebate: () => Promise<void>;
  onOpenAiSummarization: () => void;
  onShareLink: () => void;
  onLeave: () => void;
}

export function DebateHeader({
  debate,
  onOpenAiSummarization,
  onShareLink,
  onLeave,
}: Props) {
  return (
    <NavigationBar>
      <NavContent>
        <DebateTitle>{debate.topic}</DebateTitle>
        <NavButtonGroup>
          <NavButton
            onClick={onOpenAiSummarization}
            startIcon={<img src={aiBotSvg} alt="AI Bot Icon" width={42} height={39} />}
          />
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ borderColor: '#CCCEEE' }}
          />
          <NavButtonsSubGroup>
            <NavButton
              onClick={onShareLink}
              startIcon={<img src={userAddIconSvg} alt="User Add Icon" width={24} height={24} />}
            />
            <NavButton
              onClick={onLeave}
              startIcon={<img src={leaveIconSvg} alt="Leave Icon" width={24} height={24} />}
            />
          </NavButtonsSubGroup>
        </NavButtonGroup>
      </NavContent>
    </NavigationBar>
  );
}

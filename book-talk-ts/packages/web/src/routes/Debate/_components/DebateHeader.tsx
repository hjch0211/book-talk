import { Divider } from '@mui/material';
import type { Debate } from '@src/externals/debate';
import { useModal, useToast } from '@src/hooks';
import AiSummarizationModal from '@src/routes/Debate/_components/modal/AiSummarizationModal.tsx';
import { useNavigate } from 'react-router-dom';
import aiBotSvg from '../../../assets/ai-bot.svg';
import leaveIconSvg from '../../../assets/leave.svg';
import userAddIconSvg from '../../../assets/user-add.svg';
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
  endDebate: () => Promise<void>;
  isHost: boolean;
}

export function DebateHeader({ debate, isHost, endDebate }: Props) {
  const { toast } = useToast();
  const { openModal } = useModal();
  const navigate = useNavigate();

  const handleOpenAiSummarizationModal = () => {
    openModal(AiSummarizationModal, {
      bookTitle: `${debate.bookInfo.title} - ${debate.bookInfo.author}`,
      topic: debate.topic,
      bookImageUrl: debate.bookInfo.imageUrl || '',
      summarization: debate.aiSummarized ?? '',
    });
  };

  const handleShareLink = async () => {
    if (!navigator.clipboard) {
      toast.error('클립보드 API를 지원하지 않는 환경입니다.');
      return;
    }

    try {
      const url = `${window.location.origin}/home?debateId=${debate.id}`;
      await navigator.clipboard.writeText(url);
      toast.info('클립보드에 복사되었습니다.');
    } catch {
      toast.error('클립보드 복사에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleLeave = () => {
    if (isHost && debate.currentRoundInfo.type !== 'PREPARATION') void endDebate();
    else navigate('/home');
  };

  return (
    <NavigationBar>
      <NavContent>
        <DebateTitle>{debate.topic}</DebateTitle>
        <NavButtonGroup>
          <NavButton
            onClick={handleOpenAiSummarizationModal}
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
              onClick={handleShareLink}
              startIcon={<img src={userAddIconSvg} alt="User Add Icon" width={24} height={24} />}
            />
            <NavButton
              onClick={handleLeave}
              startIcon={<img src={leaveIconSvg} alt="Leave Icon" width={24} height={24} />}
            />
          </NavButtonsSubGroup>
        </NavButtonGroup>
      </NavContent>
    </NavigationBar>
  );
}

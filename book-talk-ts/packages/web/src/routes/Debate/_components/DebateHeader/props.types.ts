import type { Debate } from '@src/externals/debate';

export interface DebateHeaderProps {
  debate: Debate;
  isHost: boolean;
  isDebateActive?: boolean;
  onOpenAiSummarization: () => void;
  onShareLink: () => void;
  onLeave: () => void;
  onEndDebate: () => Promise<void>;
}

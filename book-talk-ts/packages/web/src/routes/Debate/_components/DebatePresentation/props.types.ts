import type { CurrentRoundInfo } from '@src/hooks';

export interface DebatePresentationProps {
  currentRoundInfo: CurrentRoundInfo;
  debateId?: string;
  myAccountId?: string;
  onChatMessage?: (chatId: number) => void;
  chat: {
    chats: unknown[];
    sendChat: (content: string) => void;
    isSending: boolean;
    isFetching: boolean;
  };
  members: Array<{ id: string; name: string }>;
  presentations: Array<{ id: string; accountId: string }>;
}

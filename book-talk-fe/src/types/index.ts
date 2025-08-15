export interface Participant {
  id: string;
  name: string;
  avatar: string;
  status: 'preparing' | 'ready' | 'offline';
}

export interface ContentBlock {
  id: string;
  type: 'text' | 'image';
  content: string;
  timestamp: number;
}

export interface Article {
  title: string;
  blocks: ContentBlock[];
}

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: number;
  type: 'command' | 'content';
}

export interface Room {
  id: string;
  name: string;
  topic: string;
  countdownText: string;
  currentSpeaker: Participant;
  participants: Participant[];
}
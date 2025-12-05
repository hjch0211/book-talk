import { Logger } from '@nestjs/common';
import axios from 'axios';

export const DEBATE_CLIENT = Symbol.for('DEBATE_CLIENT');

/** 토론방 정보 */
export interface DebateInfo {
  id: string;
  members: MemberInfo[];
  presentations: PresentationInfo[];
  currentRound?: RoundInfo;
  bookInfo: BookInfo;
  topic: string;
  description?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
}

/** 책 정보 */
export interface BookInfo {
  title: string;
  author: string;
  description?: string;
  imageUrl?: string;
}

/** 멤버 정보 */
export interface MemberInfo {
  id: string;
  name: string;
  role: 'HOST' | 'GUEST';
}

/** 발표 정보 */
export interface PresentationInfo {
  id: string;
  accountId: string;
}

/** 라운드 정보 */
export interface RoundInfo {
  id: number;
  type: 'OPENING' | 'FREE_DISCUSSION' | 'CLOSING';
  currentSpeakerId?: string;
  nextSpeakerId?: string;
  currentSpeakerEndedAt?: string;
  createdAt: string;
  endedAt?: string;
}

/** Debate Client 인터페이스 */
export interface DebateClient {
  /** 토론방 단건 조회 */
  findOne(debateId: string): Promise<DebateInfo | null>;
}

/** Booktalk API 설정 */
export interface BooktalkConfig {
  baseUrl: string;
}

/** Booktalk Debate Client 구현체 */
export class BooktalkDebateClient implements DebateClient {
  constructor(private readonly config: BooktalkConfig) {}

  async findOne(debateId: string): Promise<DebateInfo | null> {
    try {
      const { data } = await axios.get<{ data: DebateInfo }>(
        `${this.config.baseUrl}/debates/${debateId}`,
      );
      return data.data;
    } catch (error) {
      Logger.error(`토론방 조회 중 오류 발생: ${error}`);
      return null;
    }
  }
}

/** NoOp Debate Client */
export class NoOpDebateClient implements DebateClient {
  async findOne(_debateId: string): Promise<null> {
    return null;
  }
}

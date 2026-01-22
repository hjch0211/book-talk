import { queryOptions } from '@tanstack/react-query';
import { findOneDebate, getChats } from './api';
import type { FindOneDebateResponse, MemberInfo } from './schema';

/** 프론트에서 사용하는 라운드 타입 (서버의 null을 PREPARATION으로 변환) */
export type RoundType = 'PREPARATION' | 'PRESENTATION' | 'FREE';

/** 현재 라운드 정보 */
export interface CurrentRoundInfo {
  id: number | null;
  type: RoundType;
  currentPresentationId?: string;
  currentSpeaker: { accountId: string; accountName: string; endedAt: Date } | null;
  nextSpeaker: { accountId: string } | null;
  createdAt: string | null;
  endedAt?: string | null;
  isEditable: boolean;
}

/** select로 변환된 토론 데이터 타입 */
export type Debate = FindOneDebateResponse & {
  currentRoundInfo: CurrentRoundInfo;
  myMemberInfo: MemberInfo | undefined;
};

function resolveCurrentSpeaker(debate: FindOneDebateResponse): CurrentRoundInfo['currentSpeaker'] {
  const currentRound = debate.currentRound;
  if (!currentRound || !currentRound.currentSpeakerAccountId) return null;

  const speaker = debate.members.find((m) => m.id === currentRound.currentSpeakerAccountId);
  if (!speaker || !currentRound.currentSpeakerEndedAt) return null;

  return {
    accountId: speaker.id,
    accountName: speaker.name,
    endedAt: new Date(currentRound.currentSpeakerEndedAt),
  };
}

function resolveNextSpeaker(debate: FindOneDebateResponse): CurrentRoundInfo['nextSpeaker'] {
  const round = debate.currentRound;
  if (!round?.nextSpeakerAccountId) return null;

  return {
    accountId: round.nextSpeakerAccountId,
  };
}

/** 서버 응답을 CurrentRoundInfo로 변환 */
function transformToCurrentRoundInfo(
  debate: FindOneDebateResponse,
  myAccountId?: string
): CurrentRoundInfo {
  if (debate.currentRound) {
    const round = debate.currentRound;
    const currentPresentationId = debate.presentations.find(
      (p) => p.accountId === round.currentSpeakerAccountId
    )?.id;

    return {
      id: round.id,
      type: round.type ?? 'PREPARATION',
      currentPresentationId,
      currentSpeaker: resolveCurrentSpeaker(debate),
      nextSpeaker: resolveNextSpeaker(debate),
      createdAt: round.createdAt,
      endedAt: round.endedAt,
      isEditable: false,
    };
  }

  /** PREPARATION 라운드 */
  const myPresentation = debate.presentations.find((p) => p.accountId === myAccountId);
  return {
    id: null,
    type: 'PREPARATION',
    currentPresentationId: myPresentation?.id,
    currentSpeaker: null,
    nextSpeaker: null,
    createdAt: null,
    isEditable: true,
  };
}

export const findOneDebateQueryOptions = (debateId?: string, myAccountId?: string) =>
  queryOptions({
    queryKey: ['debates', debateId],
    queryFn: () => findOneDebate(debateId!),
    enabled: !!debateId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 3,
    select: (data) => ({
      ...data,
      currentRoundInfo: transformToCurrentRoundInfo(data, myAccountId),
      myMemberInfo: data.members.find((m) => m.id === myAccountId),
    }),
  });

export const getChatsQueryOptions = (
  debateId?: string,
  isFreeRound?: boolean,
  isAlreadyMember?: boolean
) =>
  queryOptions({
    queryKey: ['debates', debateId, 'chats', isFreeRound],
    queryFn: () => getChats(debateId!),
    enabled: !!debateId && isFreeRound && isAlreadyMember,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: 3,
  });

import { Person } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import hostIconSvg from '@src/assets/host-icon.svg';
import raiseHandSvg from '@src/assets/raise-hand.svg';
import { AppTooltip } from '@src/components/organisms/AppTooltip';
import type { CurrentRoundInfo, PresentationInfo, RoundType } from '@src/externals/debate';
import type { RaisedHandInfo } from '@src/externals/websocket';
import type { OnlineMember } from '@src/hooks/domain/useDebateRealtimeConnection';
import { useState } from 'react';
import { PresentationViewModal } from '../../modal/PresentationViewModal.tsx';
import {
  AvatarContainer,
  BookCrownIcon,
  CurrentUserIndicator,
  MemberInfo,
  MemberItem,
  MemberList,
  MemberListContainer,
  MemberListGradient,
  MemberListHeader,
  MemberListHeaderText,
  MemberName,
  MemberOrder,
  MemberOrderContainer,
  MemberProfile,
  MemberProfileBox,
  MemberProfileFrame,
  RaisedHandIcon,
  StateTimeBadge,
} from '../style.ts';

interface Props {
  members: OnlineMember[];
  currentSpeaker: CurrentRoundInfo['currentSpeaker'];
  nextSpeaker: CurrentRoundInfo['nextSpeaker'];
  realTimeRemainingSeconds: number;
  raisedHands: RaisedHandInfo[];
  currentRoundType: RoundType;
  myAccountId?: string;
  onPassSpeaker: (memberId: string) => void;
  presentations: PresentationInfo[];
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function PCDebateMemberList({
  members,
  currentSpeaker,
  nextSpeaker,
  realTimeRemainingSeconds,
  raisedHands = [],
  currentRoundType,
  myAccountId,
  onPassSpeaker,
  presentations,
}: Props) {
  const [viewPresentationMember, setViewPresentationMember] = useState<{
    memberId: string;
    memberName: string;
  } | null>(null);

  const handlePassSpeaker = (memberId: string) => () => {
    onPassSpeaker(memberId);
  };

  const handleViewPresentation = (memberId: string) => () => {
    const member = members.find((m) => m.id === memberId);
    if (member) {
      setViewPresentationMember({ memberId: member.id, memberName: member.name });
    }
  };

  return (
    <MemberListContainer>
      <MemberListHeader>
        <MemberListHeaderText>참여자</MemberListHeaderText>
      </MemberListHeader>

      <MemberList>
        {members.map((member, index) => {
          const isCurrent = currentSpeaker?.accountId === member.id;
          const isNext = nextSpeaker?.accountId === member.id;
          const hasRaisedHand = raisedHands.some((hand) => hand.accountId === member.id);
          const isConnectingVoice = member.isConnecting;
          const isMe = member.id === myAccountId;

          return (
            <MemberItem key={member.id}>
              <MemberOrderContainer>
                <MemberOrder>{index + 1}</MemberOrder>
                <RaisedHandIcon sx={{ opacity: hasRaisedHand ? 1 : 0 }}>
                  <img src={raiseHandSvg} alt={'손들기'} width={16.5} height={24} />
                </RaisedHandIcon>
              </MemberOrderContainer>
              <MemberProfile $isCurrentSpeaker={isCurrent}>
                <MemberProfileFrame>
                  <MemberProfileBox>
                    <AvatarContainer>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: '#FFFFFF',
                          border: '1px solid #F7F8FF',
                          borderRadius: '100px',
                        }}
                      >
                        <Person sx={{ color: '#BDBDBD', width: 20, height: 20 }} />
                      </Avatar>
                      {member.role === 'HOST' && (
                        <BookCrownIcon>
                          <img src={hostIconSvg} alt="Host Icon" width={40} height={26} />
                        </BookCrownIcon>
                      )}
                    </AvatarContainer>
                    <MemberInfo>
                      {isConnectingVoice && (
                        <StateTimeBadge $variant="connecting">연결중...</StateTimeBadge>
                      )}
                      {isCurrent && (
                        <StateTimeBadge $variant="current">
                          발표중
                          {realTimeRemainingSeconds > 0 && (
                            <span>{formatTime(realTimeRemainingSeconds)}</span>
                          )}
                        </StateTimeBadge>
                      )}
                      {isNext && currentRoundType !== 'FREE' && (
                        <StateTimeBadge $variant="next">다음 발표자</StateTimeBadge>
                      )}
                      <MemberName>
                        {member.name}
                        {member.isMe && <CurrentUserIndicator>(나)</CurrentUserIndicator>}
                      </MemberName>
                    </MemberInfo>
                  </MemberProfileBox>

                  {!isMe && (
                    <AppTooltip>
                      <AppTooltip.Item
                        show={currentSpeaker?.accountId === myAccountId}
                        onClick={handlePassSpeaker(member.id)}
                      >
                        발표 넘겨주기
                      </AppTooltip.Item>
                      <AppTooltip.Item onClick={handleViewPresentation(member.id)}>
                        발표페이지 보기
                      </AppTooltip.Item>
                    </AppTooltip>
                  )}
                </MemberProfileFrame>
              </MemberProfile>
            </MemberItem>
          );
        })}
      </MemberList>
      <MemberListGradient />

      {viewPresentationMember && (
        <PresentationViewModal
          open={!!viewPresentationMember}
          onClose={() => setViewPresentationMember(null)}
          memberName={viewPresentationMember.memberName}
          presentationId={
            presentations.find((p) => p.accountId === viewPresentationMember.memberId)?.id
          }
          members={members}
        />
      )}
    </MemberListContainer>
  );
}

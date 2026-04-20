import { Person } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import hostIconSvg from '@src/assets/host-icon.svg';
import raiseHandSvg from '@src/assets/raise-hand.svg';
import { AppTooltip } from '@src/components/organisms/AppTooltip';
import type { CurrentRoundInfo, PresentationInfo } from '@src/externals/debate';
import type { RaisedHandInfo } from '@src/externals/websocket';
import type { OnlineMember } from '@src/hooks/domain/useDebateRealtimeConnection';
import { useState } from 'react';
import { PresentationViewModal } from '../../modal/PresentationViewModal.tsx';
import {
  AvatarContainer,
  BookCrownIcon,
  RaisedHandIcon,
  StateTimeBadge,
} from '../style.ts';
import {
  MobilePartyCurrentUserIndicator,
  MobilePartyGradient,
  MobilePartyList as MobilePartyListStyled,
  MobilePartyListHeader,
  MobilePartyListHeaderText,
  MobilePartyMemberInfo,
  MobilePartyMemberName,
  MobilePartyMemberRow,
  MobilePartyOrder,
  MobilePartyOrderContainer,
  MobilePartyProfile,
  MobilePartyProfileList,
} from '../style.ts';

interface Props {
  members: OnlineMember[];
  myAccountId?: string;
  currentSpeaker: CurrentRoundInfo['currentSpeaker'];
  nextSpeaker: CurrentRoundInfo['nextSpeaker'];
  raisedHands: RaisedHandInfo[];
  realTimeRemainingSeconds: number;
  onPassSpeaker: (memberId: string) => void;
  presentations: PresentationInfo[];
  roundType: string;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function MobilePartyList({
  members,
  myAccountId,
  currentSpeaker,
  nextSpeaker,
  raisedHands,
  realTimeRemainingSeconds,
  onPassSpeaker,
  presentations,
  roundType,
}: Props) {
  const [viewPresentationMember, setViewPresentationMember] = useState<{
    memberId: string;
    memberName: string;
  } | null>(null);

  return (
    <MobilePartyListStyled>
      <MobilePartyListHeader>
        <MobilePartyListHeaderText>참여자</MobilePartyListHeaderText>
      </MobilePartyListHeader>

      <MobilePartyProfileList>
        {members.map((member, index) => {
          const isCurrent = currentSpeaker?.accountId === member.id;
          const isNext = nextSpeaker?.accountId === member.id;
          const hasRaisedHand = raisedHands.some((hand) => hand.accountId === member.id);
          const isConnectingVoice = member.isConnecting;
          const isMe = member.id === myAccountId;

          return (
            <MobilePartyMemberRow key={member.id}>
              <MobilePartyOrderContainer>
                <MobilePartyOrder>{index + 1}</MobilePartyOrder>
                <RaisedHandIcon sx={{ opacity: hasRaisedHand ? 1 : 0 }}>
                  <img src={raiseHandSvg} alt="손들기" width={14} height={20} />
                </RaisedHandIcon>
              </MobilePartyOrderContainer>

              <MobilePartyProfile $isCurrentSpeaker={isCurrent}>
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

                <MobilePartyMemberInfo>
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
                  {isNext && roundType !== 'FREE' && (
                    <StateTimeBadge $variant="next">다음 발표자</StateTimeBadge>
                  )}
                  <MobilePartyMemberName>
                    {member.name}
                    {isMe && (
                      <MobilePartyCurrentUserIndicator>(나)</MobilePartyCurrentUserIndicator>
                    )}
                  </MobilePartyMemberName>
                </MobilePartyMemberInfo>

                {!isMe && (
                  <AppTooltip>
                    <AppTooltip.Item
                      show={currentSpeaker?.accountId === myAccountId}
                      onClick={() => onPassSpeaker(member.id)}
                    >
                      발표 넘겨주기
                    </AppTooltip.Item>
                    <AppTooltip.Item
                      onClick={() =>
                        setViewPresentationMember({ memberId: member.id, memberName: member.name })
                      }
                    >
                      발표페이지 보기
                    </AppTooltip.Item>
                  </AppTooltip>
                )}
              </MobilePartyProfile>
            </MobilePartyMemberRow>
          );
        })}
      </MobilePartyProfileList>

      <MobilePartyGradient />

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
    </MobilePartyListStyled>
  );
}

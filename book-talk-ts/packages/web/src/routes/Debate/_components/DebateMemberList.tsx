import {MoreVert, Person} from '@mui/icons-material';
import {Avatar, Menu, MenuItem} from '@mui/material';
import {type MouseEvent, useState} from 'react';
import hostIconSvg from '../../../assets/host-icon.svg';
import raiseHandSvg from '../../../assets/raise-hand.svg';
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
  MemberMenuButton,
  MemberName,
  MemberOrder,
  MemberOrderContainer,
  MemberProfile,
  MemberProfileBox,
  MemberStatus,
  RaisedHandIcon,
  SpeakerTimer,
} from '../style.ts';
import {PresentationViewModal} from './modal/PresentationViewModal.tsx';

interface Props {
  members: Array<{
    id: string;
    name: string;
    role: 'HOST' | 'MEMBER';
    isMe?: boolean;
    isConnecting: boolean;
  }>;
  currentSpeaker: {
    accountId: string;
    accountName: string;
    endedAt?: number;
  } | null;
  nextSpeaker: {
    accountId: string;
    accountName: string;
  } | null;
  realTimeRemainingSeconds: number;
  raisedHands: Array<{
    accountId: string;
    raisedAt: number;
  }>;
  currentRoundType: 'PREPARATION' | 'PRESENTATION' | 'FREE';
  myAccountId?: string;
  onPassSpeaker: (memberId: string) => void;
  presentations: Array<{
    id: string;
    accountId: string;
  }>;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function DebateMemberList({
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
  const [menuAnchorEl, setMenuAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});
  const [viewPresentationMember, setViewPresentationMember] = useState<{
    memberId: string;
    memberName: string;
  } | null>(null);

  const handleMenuOpen = (memberId: string) => (event: MouseEvent<HTMLElement>) => {
    setMenuAnchorEl((prev) => ({ ...prev, [memberId]: event.currentTarget }));
  };

  const handleMenuClose = (memberId: string) => {
    setMenuAnchorEl((prev) => ({ ...prev, [memberId]: null }));
  };

  const handlePassSpeaker = (memberId: string) => () => {
    onPassSpeaker(memberId);
    handleMenuClose(memberId);
  };

  const handleViewPresentation = (memberId: string) => () => {
    const member = members.find((m) => m.id === memberId);
    if (member) {
      setViewPresentationMember({
        memberId: member.id,
        memberName: member.name,
      });
    }
    handleMenuClose(memberId);
  };

  const shouldShowMenu = (memberId: string) => {
    // FREE 라운드에서 메뉴 표시
    if (currentRoundType === 'FREE') {
      return memberId !== myAccountId; // 자기 자신 제외
    }
    return false;
  };
  return (
    <MemberListContainer>
      <MemberListHeader>
        <MemberListHeaderText>참여자 목록</MemberListHeaderText>
      </MemberListHeader>

      <MemberList>
        {members.map((member, index) => {
          const isCurrent = currentSpeaker?.accountId === member.id;
          const isNext = nextSpeaker?.accountId === member.id;
          const hasRaisedHand = raisedHands.some((hand) => hand.accountId === member.id);
          const isConnectingVoice = member.isConnecting;

          return (
            <MemberItem key={member.id}>
              <MemberOrderContainer>
                <MemberOrder>{index + 1}</MemberOrder>
                <RaisedHandIcon sx={{ opacity: hasRaisedHand ? 1 : 0 }}>
                  <img src={raiseHandSvg} alt={'손들기'} width={16.5} height={24} />
                </RaisedHandIcon>
              </MemberOrderContainer>
              <MemberProfile $isCurrentSpeaker={isCurrent}>
                <MemberProfileBox>
                  <AvatarContainer>
                    <Avatar
                      sx={{ width: 40, height: 40, bgcolor: '#BDBDBD', borderRadius: '100px' }}
                    >
                      <Person sx={{ color: '#FFFFFF' }} />
                    </Avatar>
                    {member.role === 'HOST' && (
                      <BookCrownIcon>
                        <img src={hostIconSvg} alt="Host Icon" width={40} height={26} />
                      </BookCrownIcon>
                    )}
                  </AvatarContainer>
                  <MemberInfo>
                    <MemberName>
                      {member.name}
                      {member.isMe && <CurrentUserIndicator>(나)</CurrentUserIndicator>}
                    </MemberName>
                    {isConnectingVoice && <MemberStatus>연결중...</MemberStatus>}
                    {isCurrent && <MemberStatus>발표중...</MemberStatus>}
                    {isNext && <MemberStatus>다음 발표자</MemberStatus>}
                  </MemberInfo>
                  {isCurrent && realTimeRemainingSeconds > 0 && (
                    <SpeakerTimer>{formatTime(realTimeRemainingSeconds)}</SpeakerTimer>
                  )}
                </MemberProfileBox>

                {shouldShowMenu(member.id) && (
                  <>
                    <MemberMenuButton onClick={handleMenuOpen(member.id)}>
                      <MoreVert />
                    </MemberMenuButton>
                    <Menu
                      anchorEl={menuAnchorEl[member.id]}
                      open={Boolean(menuAnchorEl[member.id])}
                      onClose={() => handleMenuClose(member.id)}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      slotProps={{
                        paper: {
                          sx: {
                            width: '165px',
                            boxShadow:
                              '0px 1px 14px rgba(0, 0, 0, 0.12), 0px 5px 8px rgba(0, 0, 0, 0.14), 0px 3px 5px -1px rgba(0, 0, 0, 0.2)',
                            borderRadius: '4px',
                            padding: '8px 0px',
                          },
                        },
                      }}
                    >
                      {currentSpeaker?.accountId === myAccountId && (
                        <MenuItem
                          onClick={handlePassSpeaker(member.id)}
                          sx={{
                            height: '32px',
                            padding: '6px 16px',
                            fontFamily: 'S-Core Dream',
                            fontWeight: 200,
                            fontSize: '14px',
                            lineHeight: '20px',
                            letterSpacing: '0.3px',
                            color: 'rgba(0, 0, 0, 0.87)',
                          }}
                        >
                          발표 넘겨주기
                        </MenuItem>
                      )}
                      <MenuItem
                        onClick={handleViewPresentation(member.id)}
                        sx={{
                          height: '32px',
                          padding: '6px 16px',
                          fontFamily: 'S-Core Dream',
                          fontWeight: 200,
                          fontSize: '14px',
                          lineHeight: '20px',
                          letterSpacing: '0.3px',
                          color: 'rgba(0, 0, 0, 0.87)',
                        }}
                      >
                        발표페이지 보기
                      </MenuItem>
                    </Menu>
                  </>
                )}
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

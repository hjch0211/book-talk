import {Avatar, Box} from '@mui/material';
import {MoreVert, Person} from '@mui/icons-material';
import hostIconSvg from '../../../assets/host-icon.svg';
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
    MemberProfile,
    MemberProfileBox,
    SpeakerTimer
} from '../Debate.style';
import raiseHandSvg from "../../../assets/raise-hand.svg";

interface CurrentSpeaker {
    accountId: string;
    accountName: string;
    endedAt?: number;
}

interface NextSpeaker {
    accountId: string;
    accountName: string;
}

interface Props {
    members: Array<{
        id: string;
        name: string;
        role: 'HOST' | 'MEMBER';
        isCurrentUser?: boolean;
    }>;
    currentSpeaker?: CurrentSpeaker | null;
    nextSpeaker?: NextSpeaker | null;
    realTimeRemainingSeconds: number;
    raisedHands?: Array<{
        accountId: string;
        accountName: string;
        raisedAt: number;
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
                                     raisedHands = []
                                 }: Props) {
    const isCurrentSpeaker = (memberId: string) => currentSpeaker?.accountId === memberId;
    const isNextSpeaker = (memberId: string) => nextSpeaker?.accountId === memberId;
    const isHandRaised = (memberId: string) => raisedHands.some(hand => hand.accountId === memberId);
    return (
        <MemberListContainer>
            <MemberListHeader>
                <MemberListHeaderText>
                    참여자 목록
                </MemberListHeaderText>
            </MemberListHeader>

            <MemberList>
                {members.map((member, index) => {
                    const isCurrent = isCurrentSpeaker(member.id);
                    const isNext = isNextSpeaker(member.id);
                    const hasRaisedHand = isHandRaised(member.id);
                    const profileBackgroundColor = isCurrent ? '#F5F5F5' : '#FFFFFF';

                    return (
                        <MemberItem key={member.id}>
                            <Box style={{position: 'relative'}}>
                                <MemberOrder>{index + 1}</MemberOrder>
                                <Box
                                    style={{
                                        position: 'absolute',
                                        top: -30,
                                        left: 2,
                                        opacity: hasRaisedHand ? 1 : 0,
                                        transition: 'opacity 0.3s ease-in-out',
                                        pointerEvents: 'none'
                                    }}
                                >
                                    <img src={raiseHandSvg} alt={"손들기"} width={16.5} height={24}/>
                                </Box>
                            </Box>
                            <MemberProfile style={{backgroundColor: profileBackgroundColor}}>
                                <MemberProfileBox>
                                    <AvatarContainer>
                                        <Avatar sx={{width: 40, height: 40, bgcolor: '#BDBDBD', borderRadius: '100px'}}>
                                            <Person sx={{color: '#FFFFFF'}}/>
                                        </Avatar>
                                        {member.role === 'HOST' && (
                                            <BookCrownIcon>
                                                <img src={hostIconSvg} alt="Host Icon" width={40} height={26}/>
                                            </BookCrownIcon>
                                        )}
                                    </AvatarContainer>
                                    <MemberInfo>
                                        <MemberName>
                                            {member.name}
                                            {member.isCurrentUser && (
                                                <CurrentUserIndicator>(나)</CurrentUserIndicator>
                                            )}
                                        </MemberName>
                                        {isCurrent && (
                                            <div style={{
                                                fontSize: '12px',
                                                lineHeight: '150%',
                                                letterSpacing: '0.3px',
                                                color: '#7B7B7B',
                                                fontWeight: 200
                                            }}>
                                                발표중...
                                            </div>
                                        )}
                                        {isNext && (
                                            <div style={{
                                                fontSize: '12px',
                                                lineHeight: '150%',
                                                letterSpacing: '0.3px',
                                                color: '#7B7B7B',
                                                fontWeight: 200
                                            }}>
                                                다음 발표자
                                            </div>
                                        )}
                                    </MemberInfo>
                                    {isCurrent && realTimeRemainingSeconds > 0 && (
                                        <SpeakerTimer>
                                            {formatTime(realTimeRemainingSeconds)}
                                        </SpeakerTimer>
                                    )}
                                </MemberProfileBox>

                                <MemberMenuButton style={{display: 'none'}}>
                                    <MoreVert/>
                                </MemberMenuButton>
                            </MemberProfile>
                        </MemberItem>
                    );
                })}
            </MemberList>
            <MemberListGradient/>
        </MemberListContainer>
    );
}
import {Avatar} from '@mui/material';
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
    MemberProfileBox
} from '../Debate.style';

interface Props {
    members: Array<{
        id: string;
        name: string;
        role: 'HOST' | 'MEMBER';
        isCurrentUser?: boolean;
    }>;
}

export function DebateMemberList({members}: Props) {
    return (
        <MemberListContainer>
            <MemberListHeader>
                <MemberListHeaderText>
                    참여자 목록
                </MemberListHeaderText>
            </MemberListHeader>

            <MemberList>
                {members.map((member, index) => (
                    <MemberItem key={member.id}>
                        <MemberProfile>
                            <MemberOrder>{index + 1}</MemberOrder>
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
                                </MemberInfo>
                            </MemberProfileBox>
                            <MemberMenuButton>
                                <MoreVert/>
                            </MemberMenuButton>
                        </MemberProfile>
                    </MemberItem>
                ))}
            </MemberList>
            <MemberListGradient/>
        </MemberListContainer>
    );
}
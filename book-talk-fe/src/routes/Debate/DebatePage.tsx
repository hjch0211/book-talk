import {Suspense, useMemo} from 'react';
import {useParams} from 'react-router-dom';
import MainContainer from '../../components/MainContainer/MainContainer';
import {DebateHeader} from './_components/DebateHeader';
import {DebatePresentation} from './_components/DebatePresentation';
import {DebateMemberList} from './_components/DebateMemberList';
import {ActionButton, DebateContainer} from './Debate.style';
import {useDebate} from "../../hooks/useDebate.tsx";
import {useDebateOnlineAccounts} from "../../hooks/usePresence.tsx";

interface Props {
    debateId?: string
}

function DebatePageContent({debateId}: Props) {
    const {debate, myMemberData, currentRoundInfo} = useDebate({debateId});
    const {isAccountOnline} = useDebateOnlineAccounts(debateId || null);

    const membersWithPresence = useMemo(() => {
        return debate.members.filter(member => isAccountOnline(member.id));
    }, [debate.members, isAccountOnline]);

    if (!debateId) {
        return <div>Invalid debate ID</div>;
    }

    return (
        <MainContainer isAuthPage>
            <DebateContainer>
                <DebateHeader
                    topic={debate.topic}
                />
                <DebatePresentation
                    currentRoundInfo={currentRoundInfo}
                />
                <DebateMemberList
                    members={membersWithPresence}
                />
                {
                    currentRoundInfo.type === "PREPARATION" &&
                    myMemberData.role === 'HOST' &&
                    <ActionButton>토론 시작하기</ActionButton>
                }
                {
                    currentRoundInfo.type === "PRESENTATION" &&
                    <ActionButton>발표 끝내기</ActionButton>
                }
            </DebateContainer>
        </MainContainer>
    );
}

export function DebatePage() {
    const {debateId} = useParams<{ debateId: string }>();

    return (
        <Suspense key={debateId} fallback={<></>}>
            <DebatePageContent debateId={debateId}/>
        </Suspense>
    );
}

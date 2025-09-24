import {DebateTitle, NavButton, NavButtonGroup, NavContent, NavigationBar} from '../Debate.style';
import leaveIconSvg from "../../../assets/leave.svg";
import userAddIconSvg from "../../../assets/user-add.svg";

interface Props {
    topic: string;
}

export function DebateHeader({topic}: Props) {
    return (
        <NavigationBar>
            <NavContent>
                <DebateTitle>
                    {topic}
                </DebateTitle>
                <NavButtonGroup>
                    <NavButton startIcon={<img src={userAddIconSvg} alt="User Add Icon" width={24} height={24}/>}>
                        링크 공유
                    </NavButton>
                    <NavButton startIcon={<img src={leaveIconSvg} alt="Leave Icon" width={24} height={24}/>}>
                        나가기
                    </NavButton>
                </NavButtonGroup>
            </NavContent>
        </NavigationBar>
    );
}
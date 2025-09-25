import {DebateTitle, NavButton, NavButtonGroup, NavContent, NavigationBar} from '../Debate.style';
import leaveIconSvg from "../../../assets/leave.svg";
import userAddIconSvg from "../../../assets/user-add.svg";
import {useToast} from "../../../hooks/useToast.tsx";
import {useNavigate} from "react-router-dom";

interface Props {
    topic: string;
}

export function DebateHeader({topic}: Props) {
    const {toast} = useToast()
    const navigate = useNavigate()

    const handleShareLink = async () => {
        if (!navigator.clipboard) {
            toast.error("클립보드 API를 지원하지 않는 환경입니다.");
            return;
        }

        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.info("클립보드에 복사되었습니다.");
        } catch {
            toast.error("클립보드 복사에 실패했습니다. 다시 시도해주세요.");
        }
    }

    const handleLeave = () => {
        navigate("/")
    }

    return (
        <NavigationBar>
            <NavContent>
                <DebateTitle>
                    {topic}
                </DebateTitle>
                <NavButtonGroup>
                    <NavButton
                        onClick={handleShareLink}
                        startIcon={<img src={userAddIconSvg} alt="User Add Icon" width={24} height={24}/>}
                    >
                        링크 공유
                    </NavButton>
                    <NavButton
                        onClick={handleLeave}
                        startIcon={<img src={leaveIconSvg} alt="Leave Icon" width={24} height={24}/>}>
                        나가기
                    </NavButton>
                </NavButtonGroup>
            </NavContent>
        </NavigationBar>
    );
}
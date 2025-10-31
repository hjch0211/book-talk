import {useVoiceChat} from "../../../hooks/useVoiceChat";
import {ActionButton} from "../Debate.style";
import micOffSvg from "../../../assets/mic-off.svg";
import micOnSvg from "../../../assets/mic-on.svg";

/**
 * MicrophoneControl - 음소거/음소거 해제 토글
 * 토론방 입장 시 자동으로 연결되며, 기본 음소거 상태로 시작
 */
export function MicrophoneControl() {
    const {isActive, isMuted, toggleMute} = useVoiceChat();

    const handleClick = () => {
        if (!isActive) {
            console.log('⚠️ Voice chat not active yet');
            return;
        }

        toggleMute();
    };

    const getMicIcon = () => {
        if (!isActive || isMuted) {
            return <img src={micOffSvg} alt="마이크 끄기" width={14} height={19}/>;
        } else {
            return <img src={micOnSvg} alt="마이크 켜기" width={14} height={19}/>;
        }
    };

    const getTitle = () => {
        if (!isActive) {
            return "음성 채팅 연결 중...";
        }
        return isMuted ? "음소거 해제" : "음소거";
    };

    return (
        <ActionButton
            onClick={handleClick}
            title={getTitle()}
            borderColor={'#FF8E66'}
            backgroundColor={"#FFFFFF"}
            disabled={!isActive}
        >
            {getMicIcon()}
        </ActionButton>
    );
}

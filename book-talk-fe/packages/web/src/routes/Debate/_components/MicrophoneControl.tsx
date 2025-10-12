import {useVoiceChat} from "../../../hooks/useVoiceChat";
import {ActionButton} from "../Debate.style";
import micOffSvg from "../../../assets/mic-off.svg";
import micOnSvg from "../../../assets/mic-on.svg";

export function MicrophoneControl() {
    const {isJoined, isMuted, toggleMute, joinVoiceChat, isConnecting} = useVoiceChat();

    const handleClick = async () => {
        try {
            if (!isJoined) {
                await joinVoiceChat();
            } else {
                toggleMute();
            }
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                    alert('마이크 권한이 필요합니다. 브라우저 설정에서 마이크 권한을 허용해주세요.');
                } else {
                    console.error('Failed to join voice chat:', error);
                    alert('음성 채팅 연결에 실패했습니다.');
                }
            }
        }
    };

    const getMicIcon = () => {
        if (!isJoined) {
            return <img src={micOffSvg} alt="음성 채팅 참여" width={14} height={19}/>;
        } else if (isMuted) {
            return <img src={micOffSvg} alt="마이크 켜기" width={14} height={19}/>;
        } else {
            return <img src={micOnSvg} alt="마이크 끄기" width={14} height={19}/>;
        }
    };

    return (
        <ActionButton
            onClick={handleClick}
            disabled={isConnecting}
            title={!isJoined ? "음성 채팅 참여" : (isMuted ? "마이크 켜기" : "마이크 끄기")}
            borderColor={'#FF8E66'}
            backgroundColor={"#FFFFFF"}
        >
            {getMicIcon()}
        </ActionButton>
    );
}
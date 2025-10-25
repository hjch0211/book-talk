import {useVoiceChat} from "../../../hooks/useVoiceChat";
import {ActionButton} from "../Debate.style";
import micOffSvg from "../../../assets/mic-off.svg";
import micOnSvg from "../../../assets/mic-on.svg";

export function MicrophoneControl() {
    const {
        isJoined,
        isMuted,
        toggleMute,
        isConnecting,
        hasMicPermission,
        requestMicPermission
    } = useVoiceChat();

    const handleClick = async () => {
        // 음성 채팅에 참여하지 않았거나 권한이 없는 경우
        if (!isJoined || !hasMicPermission) {
            // 권한 요청
            const granted = await requestMicPermission();
            if (!granted) {
                alert('마이크 권한이 필요합니다. 브라우저 설정에서 마이크 권한을 허용해주세요.\n권한을 허용하면 자동으로 음성 채팅에 참여됩니다.');
            }
            // 권한이 승인되면 자동 참여 로직이 실행됨 (VoiceChatContext의 useEffect)
            return;
        }

        // 음성 채팅 참여 중: 음소거만 토글
        toggleMute();
    };

    const getMicIcon = () => {
        if (!isJoined || !hasMicPermission) {
            return <img src={micOffSvg} alt="마이크 권한 필요" width={14} height={19}/>;
        } else if (isMuted) {
            return <img src={micOffSvg} alt="마이크 켜기" width={14} height={19}/>;
        } else {
            return <img src={micOnSvg} alt="마이크 끄기" width={14} height={19}/>;
        }
    };

    const getTitle = () => {
        if (!isJoined || !hasMicPermission) {
            return "마이크 권한을 허용하면 자동으로 음성 채팅에 참여됩니다";
        }
        return isMuted ? "마이크 켜기" : "마이크 끄기";
    };

    return (
        <ActionButton
            onClick={handleClick}
            disabled={isConnecting}
            title={getTitle()}
            borderColor={'#FF8E66'}
            backgroundColor={"#FFFFFF"}
        >
            {getMicIcon()}
        </ActionButton>
    );
}
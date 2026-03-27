import { AppButton } from '@src/components/molecules/AppButton';
import micOffSvg from '../../../assets/mic-off.svg';
import micOnSvg from '../../../assets/mic-on.svg';

type Props = {
  isActive: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
};

export const MicrophoneControlButton = ({ isActive, isMuted, onToggleMute }: Props) => {
  const getMicIcon = () => {
    if (!isActive || isMuted) {
      return <img src={micOffSvg} alt="마이크 끄기" width={14} height={19} />;
    } else {
      return <img src={micOnSvg} alt="마이크 켜기" width={14} height={19} />;
    }
  };

  const getTitle = () => {
    if (!isActive) {
      return '음성 채팅 연결 중...';
    }
    return isMuted ? '음소거 해제' : '음소거';
  };

  return (
    <AppButton
      appVariant="rounded"
      fullWidth
      onClick={onToggleMute}
      title={getTitle()}
      disabled={!isActive}
      sx={{
        height: '60px',
        borderRadius: '50px',
        background: '#FFFFFF',
        border: '1px solid #8E99FF',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
      }}
    >
      {getMicIcon()}
    </AppButton>
  );
};

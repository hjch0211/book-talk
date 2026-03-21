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
      fullWidth={false}
      onClick={onToggleMute}
      title={getTitle()}
      disabled={!isActive}
      sx={{
        background:
          'linear-gradient(#FFFFFF, #FFFFFF) padding-box, linear-gradient(183.73deg, #FF8E66 50.78%, #FF5500 96.94%) border-box',
      }}
      style={{ width: '100%' }}
    >
      {getMicIcon()}
    </AppButton>
  );
};

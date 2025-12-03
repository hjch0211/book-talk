import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import {Toast} from '../Toast';

interface AudioActivationBannerProps {
    /** 배너 표시 여부 */
    open: boolean;
    /** 클릭 시 오디오 활성화 */
    onActivate: () => void;
}

export function AudioActivationBanner({open, onActivate}: AudioActivationBannerProps) {
    return (
        <Toast
            open={open}
            message="음성을 들으려면 클릭하세요"
            icon={<VolumeUpIcon/>}
            onClick={onActivate}
            sx={{cursor: 'pointer', '&:hover': {backgroundColor: '#7A86E8'}}}
        />
    );
}

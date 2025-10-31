/**
 * 화상 채팅 참여 확인 Modal
 *
 * audio.play() autoplay가 차단되었을 때 표시됩니다.
 * 사용자가 "참여" 버튼을 클릭하면 user gesture로 인식되어 audio가 재생됩니다.
 */

import {Box, Button, Typography} from '@mui/material';
import Modal from '../../../components/Modal';

interface VoiceChatJoinModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function VoiceChatJoinModal({open, onClose, onConfirm}: VoiceChatJoinModalProps) {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose} width={500} height={250} showCloseButton={false}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    padding: 4,
                    gap: 3
                }}
            >
                <Typography variant="h6" component="h2" sx={{fontWeight: 600}}>
                    화상 채팅에 참여하시겠습니까?
                </Typography>

                <Typography variant="body2" color="text.secondary" textAlign="center">
                    토론 참여자와 실시간 음성 통화를 시작합니다.
                    <br/>
                    마이크는 기본적으로 음소거 상태입니다.
                </Typography>

                <Box sx={{display: 'flex', gap: 2, marginTop: 2}}>
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        sx={{minWidth: 100}}
                    >
                        나중에
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleConfirm}
                        sx={{minWidth: 100}}
                    >
                        참여
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

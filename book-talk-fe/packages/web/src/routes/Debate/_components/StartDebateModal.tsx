import {Box, Button, Typography} from '@mui/material';
import Modal from '../../../components/templates/Modal';

interface Props {
    onConfirm: () => void;
    isLoading?: boolean;
    onClose: () => void;
    open: boolean;
}

function StartDebateModal({onConfirm, isLoading = false, onClose, open}: Props) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            width={472}
            height={322}
            showCloseButton={false}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '90px 120px 59px',
                    gap: '80px',
                    height: '100%'
                }}
            >
                <Typography
                    sx={{
                        height: '27px',
                        fontFamily: 'S-Core Dream',
                        fontWeight: 500,
                        fontSize: '18px',
                        lineHeight: '150%',
                        display: 'flex',
                        alignItems: 'center',
                        textAlign: 'center',
                        letterSpacing: '1px',
                        color: '#555555'
                    }}
                >
                    토론을 시작하시겠어요?
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '30px',
                        width: '276px',
                        height: '66px'
                    }}
                >
                    <Button
                        onClick={onClose}
                        disabled={isLoading}
                        sx={{
                            width: '123px',
                            height: '66px',
                            background: '#FFFFFF',
                            border: '1px solid #9D9D9D',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                            borderRadius: '8px',
                            fontFamily: 'S-Core Dream',
                            fontWeight: 500,
                            fontSize: '20px',
                            lineHeight: '170%',
                            letterSpacing: '0.3px',
                            color: '#262626',
                            '&:hover': {
                                background: '#f5f5f5',
                                border: '1px solid #9D9D9D',
                            },
                            '&:disabled': {
                                opacity: 0.5
                            }
                        }}
                    >
                        아니오
                    </Button>

                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        sx={{
                            width: '123px',
                            height: '66px',
                            background: '#D8DBFF',
                            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                            borderRadius: '4px',
                            fontFamily: 'S-Core Dream',
                            fontWeight: 500,
                            fontSize: '20px',
                            lineHeight: '170%',
                            textAlign: 'center',
                            letterSpacing: '0.3px',
                            color: '#262626',
                            border: 'none',
                            '&:hover': {
                                background: '#c5c9ff',
                                border: 'none',
                            },
                            '&:disabled': {
                                opacity: 0.5
                            }
                        }}
                    >
                        {isLoading ? '시작 중...' : '예'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default StartDebateModal;
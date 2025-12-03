import {Box, Button, Typography} from '@mui/material';
import Modal from '../../../../components/organisms/Modal';

interface AuthRequiredModalProps {
    open: boolean;
    onClose: () => void;
    onLoginClick?: () => void;
}

const AuthRequiredModal = ({open, onClose, onLoginClick}: AuthRequiredModalProps) => {
    const handleLoginClick = () => {
        onClose();
        if (onLoginClick) {
            onLoginClick();
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            width={640}
            height={441}
            showCloseButton={true}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    gap: '64px',
                    padding: '0'
                }}
            >
                <Typography
                    sx={{
                        fontFamily: 'S-Core Dream',
                        fontWeight: 500,
                        fontSize: '24px',
                        lineHeight: '170%',
                        letterSpacing: '0.3px',
                        textAlign: 'center',
                        color: '#000000',
                        width: '303px'
                    }}
                >
                    토론방에 입장하려면<br/>
                    먼저 닉네임이 필요해요.
                </Typography>

                <Button
                    onClick={handleLoginClick}
                    sx={{
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '8px 20px',
                        width: '280px',
                        height: '70px',
                        background: '#D8DBFF',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                        borderRadius: '8px',
                        fontFamily: 'S-Core Dream',
                        fontWeight: 500,
                        fontSize: '20px',
                        lineHeight: '170%',
                        letterSpacing: '0.3px',
                        textAlign: 'center',
                        color: '#262626',
                        textTransform: 'none',
                        '&:hover': {
                            background: '#C4CBFF'
                        }
                    }}
                >
                    닉네임 만들기
                </Button>
            </Box>
        </Modal>
    );
};

export default AuthRequiredModal;

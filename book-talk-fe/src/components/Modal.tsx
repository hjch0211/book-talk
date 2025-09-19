import {Box, IconButton, Modal as MuiModal,} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type {ReactNode} from "react";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    width?: number;
    height?: number;
    children: ReactNode;
    showCloseButton?: boolean;
}

const Modal = ({
                   open,
                   onClose,
                   width = 808,
                   height = 548,
                   children,
                   showCloseButton = true
               }: ModalProps) => {
    return (
        <MuiModal
            open={open}
            onClose={onClose}
            slotProps={{
                backdrop: {
                    invisible: true
                }
            }}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    width,
                    height,
                    bgcolor: '#FFFFFF',
                    boxShadow: '0px 2px 50px rgba(0, 0, 0, 0.1)',
                    borderRadius: '24px',
                    outline: 'none'
                }}
            >
                {showCloseButton && (
                    <IconButton
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            width: 24,
                            height: 24,
                            right: 45,
                            top: 45,
                            color: 'rgba(0, 0, 0, 0.56)',
                            p: 0
                        }}
                    >
                        <CloseIcon/>
                    </IconButton>
                )}
                {children}
            </Box>
        </MuiModal>
    );
};

export default Modal;
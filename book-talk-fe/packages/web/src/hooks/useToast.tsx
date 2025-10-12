import {useCallback, useState} from 'react';
import {Alert, Snackbar} from '@mui/material';
import {createRoot} from 'react-dom/client';

interface ToastOptions {
    message: string;
    duration?: number;
    action?: React.ReactNode;
}

interface ToastState {
    open: boolean;
    message: string;
    duration: number;
    action?: React.ReactNode;
    onClose: () => void;
}

export const useToast = () => {
    const [toastRoot, setToastRoot] = useState<HTMLElement | null>(null);

    const showToast = useCallback((options: ToastOptions) => {
        const {
            message,
            duration = 3000,
            action
        } = options;

        // Remove existing toast if any
        if (toastRoot && toastRoot.parentNode) {
            toastRoot.parentNode.removeChild(toastRoot);
        }

        const container = document.createElement('div');
        const modalRootElement = document.getElementById('modal-root') || document.body;
        modalRootElement.appendChild(container);

        const root = createRoot(container);
        setToastRoot(container);

        const handleClose = () => {
            root.unmount();
            if (container.parentNode) {
                container.parentNode.removeChild(container);
            }
            setToastRoot(null);
        };

        const ToastComponent = ({open, message, duration, action, onClose}: ToastState) => {
            return (
                <Snackbar
                    open={open}
                    autoHideDuration={duration}
                    onClose={onClose}
                    anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                >
                    <Alert
                        onClose={onClose}
                        severity="info"
                        variant="filled"
                        action={action}
                        sx={{
                            width: '100%',
                            backgroundColor: '#8E99FF',
                            color: '#fff',
                            '& .MuiAlert-icon': {
                                color: '#fff'
                            },
                            '& .MuiAlert-action': {
                                color: '#fff'
                            }
                        }}
                    >
                        {message}
                    </Alert>
                </Snackbar>
            );
        };

        root.render(
            <ToastComponent
                open={true}
                message={message}
                duration={duration}
                action={action}
                onClose={handleClose}
            />
        );
    }, [toastRoot]);

    const toast = {
        success: (message: string, options?: Omit<ToastOptions, 'message'>) =>
            showToast({message, ...options}),
        error: (message: string, options?: Omit<ToastOptions, 'message'>) =>
            showToast({message, ...options}),
        warning: (message: string, options?: Omit<ToastOptions, 'message'>) =>
            showToast({message, ...options}),
        info: (message: string, options?: Omit<ToastOptions, 'message'>) =>
            showToast({message, ...options}),
        show: (message: string, options?: Omit<ToastOptions, 'message'>) =>
            showToast({message, ...options}),
    };

    return {showToast, toast};
};
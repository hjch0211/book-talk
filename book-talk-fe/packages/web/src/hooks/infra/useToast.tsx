import {useCallback, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Toast} from '../../components/organisms/Toast';

interface ToastOptions {
    message: string;
    duration?: number;
    action?: React.ReactNode;
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

        root.render(
            <Toast
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
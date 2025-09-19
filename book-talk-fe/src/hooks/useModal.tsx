import {type ComponentType, useCallback, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {QueryClientProvider, useQueryClient} from '@tanstack/react-query';

interface ModalProps {
    open: boolean;
    onClose: () => void;
}

export const useModal = () => {
    const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);
    const queryClient = useQueryClient();

    const openModal = useCallback(<T extends ModalProps>(
        Component: ComponentType<T>,
        props?: Omit<T, keyof ModalProps>
    ) => {
        const container = document.createElement('div');
        const modalRootElement = document.getElementById('modal-root') || document.body;
        modalRootElement.appendChild(container);

        const root = createRoot(container);
        setModalRoot(container);

        const handleClose = () => {
            root.unmount();
            if (container.parentNode) {
                container.parentNode.removeChild(container);
            }
            setModalRoot(null);
        };

        root.render(
            <QueryClientProvider client={queryClient}>
                <Component
                    {...(props as T)}
                    open={true}
                    onClose={handleClose}
                />
            </QueryClientProvider>
        );
    }, [queryClient]);

    const closeModal = useCallback(() => {
        if (modalRoot && modalRoot.parentNode) {
            modalRoot.parentNode.removeChild(modalRoot);
            setModalRoot(null);
        }
    }, [modalRoot]);

    return {openModal, closeModal};
};
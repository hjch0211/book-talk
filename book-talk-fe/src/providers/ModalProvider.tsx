import {type ComponentType, createContext, useCallback, useContext, useState, type ReactNode} from 'react';
import {createPortal} from 'react-dom';

interface ModalProps {
    open: boolean;
    onClose: () => void;
}

interface ModalContextType {
    openModal: <T extends ModalProps>(
        Component: ComponentType<T>,
        props?: Omit<T, keyof ModalProps>
    ) => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [modalState, setModalState] = useState<{
        Component: ComponentType<ModalProps>;
        props: Record<string, unknown>;
    } | null>(null);

    const openModal = useCallback(<T extends ModalProps>(
        Component: ComponentType<T>,
        props?: Omit<T, keyof ModalProps>
    ) => {
        setModalState({
            Component: Component as ComponentType<ModalProps>,
            props: props ? props as Record<string, unknown> : {}
        });
    }, []);

    const closeModal = useCallback(() => {
        setModalState(null);
    }, []);

    const modalRoot = document.getElementById('modal-root') || document.body;

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}
            {modalState && createPortal(
                <modalState.Component
                    {...modalState.props}
                    open={true}
                    onClose={closeModal}
                />,
                modalRoot
            )}
        </ModalContext.Provider>
    );
}

export const useModalContext = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModalContext must be used within a ModalProvider');
    }
    return context;
};
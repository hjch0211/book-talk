import { type ComponentType, createContext, type ReactNode, useCallback, useState } from 'react';

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

export const ModalContext = createContext<ModalContextType | null>(null);

interface ModalProviderProps {
  children: ReactNode;
}

/**
 * @name ModalProvider
 * @description 전역 모달 상태 관리 및 동적 모달 렌더링 제공
 * @external none
 */
export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalState, setModalState] = useState<{
    Component: ComponentType<ModalProps>;
    props: Record<string, unknown>;
  } | null>(null);

  const openModal = useCallback(
    <T extends ModalProps>(Component: ComponentType<T>, props?: Omit<T, keyof ModalProps>) => {
      setModalState({
        Component: Component as ComponentType<ModalProps>,
        props: props ? (props as Record<string, unknown>) : {},
      });
    },
    []
  );

  const closeModal = useCallback(() => {
    setModalState(null);
  }, []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modalState && (
        <modalState.Component {...modalState.props} open={true} onClose={closeModal} />
      )}
    </ModalContext.Provider>
  );
};

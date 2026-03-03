import { type ComponentType, createContext, type ReactNode, useCallback, useState } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
}

interface InnerModalContextType {
  openModal: <T extends ModalProps>(
    Component: ComponentType<T>,
    props?: Omit<T, keyof ModalProps>
  ) => void;
  closeModal: () => void;
}

export const InnerModalContext = createContext<InnerModalContextType | null>(null);

/**
 * @name InnerModalProvider
 * @description 외부 모달 위에 내부 모달을 렌더링하기 위한 컨텍스트 제공
 * inner={true} 모달을 사용하는 컴포넌트를 감싸서 사용
 */
export const InnerModalProvider = ({ children }: { children: ReactNode }) => {
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
    <InnerModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modalState && (
        <modalState.Component {...modalState.props} open={true} onClose={closeModal} />
      )}
    </InnerModalContext.Provider>
  );
};

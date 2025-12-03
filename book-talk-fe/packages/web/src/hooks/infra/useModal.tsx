import { useModalContext } from '../../providers/ModalProvider.tsx';

export const useModal = () => {
  return useModalContext();
};

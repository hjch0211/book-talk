import { ModalContext } from '@src/providers';
import { useContext } from 'react';

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
};

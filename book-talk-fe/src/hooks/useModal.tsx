import {useModalContext} from '../providers/ModalProvider';

export const useModal = () => {
    return useModalContext();
};
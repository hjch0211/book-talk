import { Modal } from './Modal';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteModal({ isOpen, onClose, onConfirm }: DeleteModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="내용 삭제">
      <p>이 내용을 삭제하시겠습니까?</p>
      <div className="modal-buttons">
        <button className="modal-btn cancel" onClick={onClose}>
          취소
        </button>
        <button className="modal-btn confirm" onClick={handleConfirm}>
          삭제
        </button>
      </div>
    </Modal>
  );
}
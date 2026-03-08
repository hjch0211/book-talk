import { DeleteAccountButton, DeleteAccountRow } from '../../style.ts';

interface Props {
  onDeleteClick: () => void;
}

export function DeleteAccountSection({ onDeleteClick }: Props) {
  return (
    <DeleteAccountRow>
      <DeleteAccountButton type="button" onClick={onDeleteClick}>
        회원 탈퇴
      </DeleteAccountButton>
    </DeleteAccountRow>
  );
}

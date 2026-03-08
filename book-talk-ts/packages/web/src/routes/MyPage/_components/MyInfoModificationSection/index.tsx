import { FilterChipBox, FilterChipText } from '@src/routes/MyPage/style.ts';
import { DeleteAccountSection } from './_components/DeleteAccountSection';
import { NicknameChangeForm } from './_components/NicknameChangeForm';
import { PasswordChangeForm } from './_components/PasswordChangeForm';
import { WithdrawalSection } from './_components/WithdrawalSection';
import { PasswordSection, ProfileChipGroup, SectionTitle } from './style.ts';
import { type ProfileChip, useMyInfoModificationSection } from './useMyInfoModificationSection.ts';

const VISIBLE_CHIPS: ProfileChip[] = ['nickname', 'password'];

const CHIP_LABELS: Record<ProfileChip, string> = {
  nickname: '닉네임 변경',
  password: '비밀번호 변경',
  withdrawal: '회원 탈퇴',
};

export const MyInfoModificationSection = () => {
  const { chip, setChip, nicknameForm, passwordForm, deleteAccount, withdrawal } =
    useMyInfoModificationSection();

  if (chip === 'withdrawal') {
    return (
      <PasswordSection>
        <WithdrawalSection
          onCancel={withdrawal.onCancel}
          onConfirm={withdrawal.onConfirm}
          isPending={withdrawal.isPending}
        />
      </PasswordSection>
    );
  }

  return (
    <PasswordSection>
      <ProfileChipGroup>
        {VISIBLE_CHIPS.map((c) => (
          <FilterChipBox key={c} active={chip === c} onClick={() => setChip(c)}>
            <FilterChipText active={chip === c}>{CHIP_LABELS[c]}</FilterChipText>
          </FilterChipBox>
        ))}
      </ProfileChipGroup>
      <SectionTitle>{CHIP_LABELS[chip]}</SectionTitle>
      {chip === 'nickname' ? (
        <NicknameChangeForm
          control={nicknameForm.control}
          errors={nicknameForm.errors}
          onSubmit={nicknameForm.onSubmit}
          isPending={nicknameForm.isPending}
        />
      ) : (
        <PasswordChangeForm
          control={passwordForm.control}
          errors={passwordForm.errors}
          onSubmit={passwordForm.onSubmit}
          isPending={passwordForm.isPending}
        />
      )}
      <DeleteAccountSection onDeleteClick={deleteAccount.onDeleteClick} />
    </PasswordSection>
  );
};

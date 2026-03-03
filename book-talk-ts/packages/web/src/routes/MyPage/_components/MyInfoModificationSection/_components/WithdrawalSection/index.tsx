import { Checkbox } from '@mui/material';
import { AppButton } from '@src/components/molecules/AppButton';
import { useState } from 'react';
import {
  ButtonRow,
  CheckboxLabel,
  CheckboxRow,
  HeaderGroup,
  NoticeBox,
  NoticeList,
  NoticeListItem,
  NoticeSection,
  NoticeSectionTitle,
  WithdrawalContainer,
  WithdrawalSubtitle,
  WithdrawalTitle,
} from './style.ts';

interface Props {
  onCancel: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function WithdrawalSection({ onCancel, onConfirm, isPending }: Props) {
  const [checked, setChecked] = useState(false);

  return (
    <WithdrawalContainer>
      <HeaderGroup>
        <WithdrawalTitle>BOOKTALK 회원 탈퇴 안내</WithdrawalTitle>
        <WithdrawalSubtitle>탈퇴 전 아래의 유의사항을 반드시 확인해 주세요.</WithdrawalSubtitle>
      </HeaderGroup>

      <NoticeBox>
        <NoticeSection>
          <NoticeSectionTitle>계정 정보 및 데이터 삭제</NoticeSectionTitle>
          <NoticeList>
            <NoticeListItem>
              탈퇴 즉시 이메일 주소, 닉네임, 비밀번호 등 회원가입 시 입력한 모든 정보가 삭제됩니다.
            </NoticeListItem>
            <NoticeListItem>
              한번 삭제된 계정 정보는 어떠한 경우에도 복구가 불가능합니다.
            </NoticeListItem>
            <NoticeListItem>
              동일한 이메일로 재가입하더라도 이전 활동 데이터는 연동되지 않습니다.
            </NoticeListItem>
          </NoticeList>
        </NoticeSection>

        <NoticeSection>
          <NoticeSectionTitle>콘텐츠 및 활동 기록 처리</NoticeSectionTitle>
          <NoticeList>
            <NoticeListItem>
              서비스 이용 과정에서 생성하거나 참여한 독서 토론 콘텐츠 정보에 대한 접근 권한이
              상실됩니다.
            </NoticeListItem>
            <NoticeListItem>
              탈퇴 후에는 서비스 내에서 본인이 작성한 콘텐츠를 직접 수정하거나 삭제할 수 없습니다.
            </NoticeListItem>
            <NoticeListItem>
              필요한 데이터가 있다면 탈퇴 전 반드시 별도로 저장하시기 바랍니다.
            </NoticeListItem>
          </NoticeList>
        </NoticeSection>

        <NoticeSection>
          <NoticeSectionTitle>법령에 따른 정보 보관</NoticeSectionTitle>
          <NoticeList>
            <NoticeListItem>
              개인정보 처리방침에 따라, 관련 법령에 의해 보관이 필요한 정보는 해당 기간 동안
              안전하게 보관된 후 지체 없이 파기됩니다.
            </NoticeListItem>
            <NoticeListItem>서비스 이용 기록 및 접속 로그: 1년 (통신비밀보호법)</NoticeListItem>
            <NoticeListItem>부정 이용 방지를 위한 내부 방침: 탈퇴 후 최대 1년</NoticeListItem>
          </NoticeList>
        </NoticeSection>
      </NoticeBox>

      <CheckboxRow>
        <Checkbox
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          sx={{ color: '#FF5D22', '&.Mui-checked': { color: '#FF5D22' }, padding: '9px' }}
        />
        <CheckboxLabel>유의사항을 모두 확인하였으며, 회원 탈퇴합니다.</CheckboxLabel>
      </CheckboxRow>

      <ButtonRow>
        <AppButton
          appVariant="outlined"
          fullWidth={false}
          type="button"
          style={{ width: 76, height: 50, borderRadius: 10 }}
          onClick={onCancel}
        >
          취소
        </AppButton>
        <AppButton
          appVariant="filled"
          fullWidth={false}
          type="button"
          style={{ width: 250, height: 50, borderRadius: 10 }}
          disabled={!checked || isPending}
          onClick={onConfirm}
        >
          회원 탈퇴
        </AppButton>
      </ButtonRow>
    </WithdrawalContainer>
  );
}

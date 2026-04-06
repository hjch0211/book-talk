import { env } from '@src/configs/env';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FloatingButton,
  ModalOverlay,
  ModalPanel,
  ModalTitle,
  NavButton,
  NavItem,
  NavList,
  NavPath,
} from './style';

const PAGES = [
  { label: '랜딩', path: '/' },
  { label: '홈', path: '/home' },
  { label: '로그인', path: '/sign-in' },
  { label: '회원가입', path: '/sign-up' },
  { label: '비밀번호 찾기', path: '/forgot-password' },
  { label: '마이페이지', path: '/my-page' },
  { label: 'AI 채팅', path: '/ai-chat' },
  { label: '이용약관', path: '/terms-of-use' },
  { label: '개인정보처리방침', path: '/privacy' },
  { label: '토론 인원 초과', path: '/debate-full' },
  { label: '토론 만료', path: '/debate-expired' },
  { label: '404', path: '/not-found-test' },
];

const DevNavigatorModal = ({ onClose }: { onClose: () => void }) => {
  const navigate = useNavigate();

  const go = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalPanel onClick={(e) => e.stopPropagation()}>
        <ModalTitle>Dev Navigator</ModalTitle>
        <NavList>
          {PAGES.map(({ label, path }) => (
            <NavItem key={path}>
              <NavButton onClick={() => go(path)}>
                {label}
                <NavPath>{path}</NavPath>
              </NavButton>
            </NavItem>
          ))}
        </NavList>
      </ModalPanel>
    </ModalOverlay>
  );
};

const DevNavigator = () => {
  const [open, setOpen] = useState(false);

  if (env.APP_ENV !== 'development') return null;

  return (
    <>
      <FloatingButton onClick={() => setOpen(true)} title="Dev Navigator">
        ⚡
      </FloatingButton>
      {open && <DevNavigatorModal onClose={() => setOpen(false)} />}
    </>
  );
};

export default DevNavigator;

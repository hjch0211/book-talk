import { Backdrop, Box, Typography } from '@mui/material';
import type { RoundType } from '@src/hooks';
import * as R from 'ramda';
import type React from 'react';

interface RoundStartBackdropProps {
  show: boolean;
  roundType: RoundType | null;
  onClose: () => void;
}

interface BackdropTextProps {
  children: React.ReactNode;
}

const Title: React.FC<BackdropTextProps> = ({ children }) => (
  <Typography
    sx={{
      fontFamily: 'S-Core Dream',
      fontWeight: 600,
      fontSize: '128px',
      lineHeight: '153px',
      textAlign: 'center',
      color: '#FFFFFF',
      height: '153px',
      width: '110%',
    }}
  >
    {children}
  </Typography>
);

const Subtitle: React.FC<BackdropTextProps> = ({ children }) => (
  <Typography
    sx={{
      fontFamily: 'S-Core Dream',
      fontWeight: 200,
      fontSize: '24px',
      lineHeight: '32px',
      textAlign: 'center',
      color: '#FFFFFF',
      marginBottom: '24px',
    }}
  >
    {children}
  </Typography>
);

const Description: React.FC<BackdropTextProps> = ({ children }) => (
  <Typography
    sx={{
      fontFamily: 'S-Core Dream',
      fontWeight: 200,
      fontSize: '18px',
      lineHeight: '32px',
      textAlign: 'center',
      letterSpacing: '0.01em',
      color: '#FFFFFF',
      width: '573px',
      height: '21px',
    }}
  >
    {children}
  </Typography>
);

/** 라운드 시작 시 표시되는 가이드 백드롭 */
export function RoundStartBackdrop({ show, roundType, onClose }: RoundStartBackdropProps) {
  if (!show || !roundType) return null;

  const content = R.prop(roundType, {
    PRESENTATION: {
      title: '1 라운드 시작',
      subtitle: '발표지를 활용해 자신의 생각이나 의견을 말해주세요!',
      description: (
        <>
          우측 프로필의 순서대로 발표가 진행됩니다.
          <br />
          시간 내 발표가 끝나면 발표끝내기 버튼을 눌러 다음사람에게 넘겨주세요.
        </>
      ),
    },
    FREE: {
      title: '2 라운드 시작',
      subtitle: '다양한 자료를 공유하며 자유롭게 토론해주세요!',
      description: (
        <>
          프로필 메뉴기능을 통해 다른 사람의 발표지를 확인하거나 발언권을 넘겨줄 수 있어요.
          <br />
          손들기 버튼으로 발언권을 주장하고 발표자를 넘겨받으세요.
        </>
      ),
    },
    PREPARATION: {
      title: '준비 중',
      subtitle: '토론 시작을 기다리는 중입니다.',
      description: <>'호스트가 토론을 시작할 때까지 기다려주세요.'</>,
    },
  });

  return (
    <Backdrop
      open={show}
      onClick={onClose}
      sx={{
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        transitionProperty: 'opacity, visibility',
        transitionTimingFunction: 'ease-out',
        transitionDuration: show ? '500ms' : '300ms',
        transitionDelay: show ? '300ms' : '5000ms',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '30px',
          width: '732px',
          height: '332px',

          opacity: show ? 1 : 0,
          transform: show ? 'scale(1)' : 'scale(0.9)',

          transitionProperty: 'opacity, transform',
          transitionTimingFunction: 'ease-out',
          transitionDuration: show ? '500ms' : '300ms',
          transitionDelay: show ? '300ms' : '5000ms',
        }}
      >
        <Title>{content.title}</Title>
        <Subtitle>{content.subtitle}</Subtitle>
        <Description>{content.description}</Description>
      </Box>
    </Backdrop>
  );
}

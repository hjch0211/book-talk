import { Button, type ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export type AppButtonVariant =
  | 'filled'
  | 'outlined'
  | 'styled-outlined'
  | 'social'
  | 'rounded'
  | 'inline'
  | 'debate-join'
  | 'debate-enter'
  | 'debate-closed'
  | 'transparent';

export interface AppButtonProps extends Omit<ButtonProps, 'variant'> {
  appVariant?: AppButtonVariant;
  hoverAnimation?: boolean;
}

export const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'appVariant' && prop !== 'hoverAnimation',
})<{ appVariant: AppButtonVariant; hoverAnimation?: boolean }>(
  ({ appVariant, hoverAnimation, fullWidth }) => ({
    height: 50,
    borderRadius: 12,
    textTransform: 'none',
    transition: 'all 0.3s ease',

    '&&.Mui-disabled': {
      background: '#f0f0f0',
      borderColor: '#e0e0e0',
      color: '#b0b0b0',
      cursor: 'not-allowed',
    },

    ...(hoverAnimation && {
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
      },
    }),

    ...(appVariant === 'filled' && {
      color: '#0a0a0a',
      border: '1px solid transparent',
      background:
        'linear-gradient(#f7f8ff, #f7f8ff) padding-box, linear-gradient(180deg, #AACDFF 0%, #5F84FF 100%) border-box',
      '&:hover': {
        background:
          'linear-gradient(#eef0ff, #eef0ff) padding-box, linear-gradient(180deg, #AACDFF 0%, #5F84FF 100%) border-box',
      },
    }),

    ...(appVariant === 'outlined' && {
      background: 'transparent',
      color: '#262626',
      border: '1px solid #c4c4c4',
      '&:hover': { background: '#fcfcfc' },
    }),

    ...(appVariant === 'styled-outlined' && {
      boxSizing: 'border-box',

      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',

      padding: '12px 24px',
      gap: '8px',

      width: fullWidth ? '100%' : '200px',
      height: '64px',

      borderRadius: '50px',
      border: '1px solid transparent',
      background: `
        linear-gradient(#F7F8FF, #F7F8FF) padding-box,
        linear-gradient(110deg, #1A00E2 28.5%, #FF7544 86.82%) border-box
      `,

      color: '#262626',

      fontFamily: 'S-Core Dream',
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '24px',
      letterSpacing: '1px',
      textAlign: 'center',

      '&:hover': {
        background: `
            linear-gradient(#EEF0FF, #EEF0FF) padding-box,
            linear-gradient(110deg, #1A00E2 28.5%, #FF7544 86.82%) border-box
      `,
      },
    }),

    ...(appVariant === 'social' && {
      height: 52,
      borderRadius: 14,
      background: '#ffffff',
      color: '#262626',
      border: '2px solid #f5f5f5',
      gap: 8,
      '&:hover': { background: '#f9f9f9' },
    }),

    ...(appVariant === 'inline' && {
      ...(!fullWidth && { width: 102 }),
      height: 52,
      borderRadius: 14,
      background: '#ffffff',
      color: '#7b7b7b',
      border: '1px solid #d9d9d9',
      '&:hover': { background: '#fcfcfc' },
    }),

    ...(appVariant === 'rounded' && {
      height: 60,
      borderRadius: 48,
      padding: '16px 32px',
      color: '#262626',
      border: '1px solid transparent',
      background:
        'linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(183.73deg, #AACDFF 50.78%, #5F84FF 96.94%) border-box',
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
      '&:hover': {
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
      },
    }),

    ...(appVariant === 'debate-join' && {
      height: 34,
      borderRadius: 7,
      border: '1px solid transparent',
      background:
        'linear-gradient(#f7f8ff, #f7f8ff) padding-box, linear-gradient(180deg, #AACDFF 0%, #5F84FF 100%) border-box',
      color: '#000000',
      '&:hover': {
        background:
          'linear-gradient(#eef0ff, #eef0ff) padding-box, linear-gradient(180deg, #AACDFF 0%, #5F84FF 100%) border-box',
      },
    }),

    ...(appVariant === 'debate-enter' && {
      height: 34,
      borderRadius: 7,
      background: '#ffffff',
      border: '1px solid #262626',
      color: '#000000',
      '&:hover': { background: '#f5f5f5' },
    }),

    ...(appVariant === 'debate-closed' && {
      height: 60,
      borderRadius: 10,
      background: '#C4C4C4',
      border: '1px solid #D9D9D9',
      color: '#7B7B7B',
      cursor: 'default',
      '&:hover': { background: '#C4C4C4' },
    }),

    ...(appVariant === 'transparent' && {
      height: 60,
      borderRadius: 10,
      background: '#FFFFFF',
      color: '#262626',
      '&:hover': { background: '#f5f5f5' },
    }),
  })
);

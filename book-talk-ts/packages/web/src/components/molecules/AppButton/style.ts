import { Button, type ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export type AppButtonVariant =
  | 'filled'
  | 'outlined'
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
  shouldForwardProp: (prop) => prop !== 'appVariant' && prop !== 'hoverAnimation' && prop !== 'sx',
})<{ appVariant: AppButtonVariant; hoverAnimation?: boolean }>`
  & {
    height: 50px;
    border-radius: 12px;
    font-family: 'S-Core Dream', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.3px;
    text-align: center;
    text-transform: none;
    transition: box-shadow 0.2s ease, transform 0.2s ease, background 0.2s ease;
  }

  &&.Mui-disabled {
    background: #f0f0f0;
    border-color: #e0e0e0;
    color: #b0b0b0;
    cursor: not-allowed;
  }

  ${({ hoverAnimation }) =>
    hoverAnimation &&
    `
    &&:hover {
      transform: translateY(-2px);
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
    }
  `}

  ${({ appVariant }) =>
    appVariant === 'filled' &&
    `
    & {
      color: #0a0a0a;
      border: 1px solid transparent;
      background:
        linear-gradient(#f7f8ff, #f7f8ff) padding-box,
        linear-gradient(180deg, #AACDFF 0%, #5F84FF 100%) border-box;
    }
    &&:hover {
      background:
        linear-gradient(#eef0ff, #eef0ff) padding-box,
        linear-gradient(180deg, #AACDFF 0%, #5F84FF 100%) border-box;
    }
  `}

  ${({ appVariant }) =>
    appVariant === 'outlined' &&
    `
    & {
      background: transparent;
      color: #262626;
      border: 1px solid #c4c4c4;
    }
    &&:hover { background: #fcfcfc; }
  `}

  ${({ appVariant }) =>
    appVariant === 'social' &&
    `
    & {
      height: 52px;
      border-radius: 14px;
      background: #ffffff;
      color: #262626;
      border: 2px solid #f5f5f5;
      gap: 8px;
    }
    &&:hover { background: #f9f9f9; }
  `}

  ${({ appVariant }) =>
    appVariant === 'inline' &&
    `
    & {
      width: 102px;
      height: 52px;
      border-radius: 14px;
      background: #ffffff;
      color: #7b7b7b;
      border: 1px solid #d9d9d9;
    }
    &&:hover { background: #fcfcfc; }
  `}

  ${({ appVariant }) =>
    appVariant === 'rounded' &&
    `
    & {
      width: fit-content;
      height: 59px;
      border-radius: 48px;
      padding: 16px 32px;
    font-size: 18px;
      letter-spacing: 1px;
      color: #262626;
      border: 1px solid transparent;
      background:
        linear-gradient(#ffffff, #ffffff) padding-box,
        linear-gradient(183.73deg, #AACDFF 50.78%, #5F84FF 96.94%) border-box;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
    }
    &&:hover {
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
    }
  `}

  ${({ appVariant }) =>
    appVariant === 'debate-join' &&
    `
    & {
      height: 34px;
      border-radius: 7px;
      font-weight: 200;
      font-size: 12px;
      letter-spacing: 0.3px;
      border: 1px solid transparent;
      background:
        linear-gradient(#f7f8ff, #f7f8ff) padding-box,
        linear-gradient(180deg, #AACDFF 0%, #5F84FF 100%) border-box;
      color: #000000;
    }
    &&:hover {
      background:
        linear-gradient(#eef0ff, #eef0ff) padding-box,
        linear-gradient(180deg, #AACDFF 0%, #5F84FF 100%) border-box;
    }
  `}

  ${({ appVariant }) =>
    appVariant === 'debate-enter' &&
    `
    & {
      height: 34px;
      border-radius: 7px;
      font-weight: 200;
      font-size: 12px;
      letter-spacing: 0.3px;
      background: #ffffff;
      border: 1px solid #262626;
      color: #000000;
    }
    &&:hover { background: #f5f5f5; }
  `}

  ${({ appVariant }) =>
    appVariant === 'debate-closed' &&
    `
    & {
      height: 60px;
      border-radius: 10px;
      font-weight: 500;
      font-size: 14px;
      letter-spacing: 0.3px;
      background: #C4C4C4;
      border: 1px solid #D9D9D9;
      color: #7B7B7B;
      cursor: default;
    }
    &&:hover { background: #C4C4C4; }
  `}

  ${({ appVariant }) =>
    appVariant === 'transparent' &&
    `
    & {
      height: 60px;
      border-radius: 10px;
      font-weight: 500;
      font-size: 14px;
      letter-spacing: 0.3px;
      background: #FFFFFF;
      color: #262626;
    }
    &&:hover { background: #f5f5f5; }
  `}
`;

import {
  type BreakpointsOptions,
  type Components,
  CssBaseline,
  type PaletteOptions,
  type TypographyVariantsOptions,
} from '@mui/material';
import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material/styles';
import type React from 'react';
import { breakPoints } from '../constants/breakPoints.ts';
import { appColor } from '../constants/color.ts';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    headlineL: React.CSSProperties;
    headlineM: React.CSSProperties;
    headlineS: React.CSSProperties;
    title1: React.CSSProperties;
    title2: React.CSSProperties;
    title3: React.CSSProperties;
    labelL: React.CSSProperties;
    labelM: React.CSSProperties;
    labelS: React.CSSProperties;
    captionS: React.CSSProperties;
    captionM: React.CSSProperties;
    captionL: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    headlineL?: React.CSSProperties;
    headlineM?: React.CSSProperties;
    headlineS?: React.CSSProperties;
    title1?: React.CSSProperties;
    title2?: React.CSSProperties;
    title3?: React.CSSProperties;
    labelL?: React.CSSProperties;
    labelM?: React.CSSProperties;
    labelS?: React.CSSProperties;
    captionS?: React.CSSProperties;
    captionM?: React.CSSProperties;
    captionL?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    headlineL: true;
    headlineM: true;
    headlineS: true;
    title1: true;
    title2: true;
    title3: true;
    labelL: true;
    labelM: true;
    labelS: true;
    captionS: true;
    captionM: true;
    captionL: true;
  }
}

const below900 = `@media (max-width:${breakPoints.md - 0.05}px)`;

const muiTypographyConfig: TypographyVariantsOptions = {
  fontFamily: ['S-Core Dream', 'SpoqaHanSansNeo-Regular', 'sans-serif'].join(','),

  /** 36 / 180% */
  headlineL: {
    fontSize: 36,
    lineHeight: 1.8,
    fontWeight: 600,
    letterSpacing: '0.3px',
    [below900]: { fontSize: 24 },
  },
  /** 32 / 125% */
  headlineM: {
    fontSize: 32,
    lineHeight: 1.25,
    fontWeight: 600,
    letterSpacing: '0.3px',
    [below900]: { fontSize: 22 },
  },
  /** 28 / 150% */
  headlineS: {
    fontSize: 28,
    lineHeight: 1.5,
    fontWeight: 600,
    letterSpacing: '0.3px',
    [below900]: { fontSize: 20 },
  },

  /** 24 / 125% */
  title1: {
    fontSize: 24,
    lineHeight: 1.25,
    fontWeight: 500,
    letterSpacing: '0.3px',
    [below900]: { fontSize: 18 },
  },
  /** 20 / 170% */
  title2: {
    fontSize: 20,
    lineHeight: 1.7,
    fontWeight: 500,
    letterSpacing: '0.3px',
    [below900]: { fontSize: 16 },
  },
  /** 18 / 150% */
  title3: {
    fontSize: 18,
    lineHeight: 1.5,
    fontWeight: 500,
    letterSpacing: '1px',
    [below900]: { fontSize: 15 },
  },

  /** 16 / 24px → 1.5 */
  labelL: {
    fontSize: 16,
    lineHeight: 1.5,
    fontWeight: 500,
    letterSpacing: '1px',
    [below900]: { fontSize: 14 },
  },
  /** 14 / 20px → ~1.43 */
  labelM: {
    fontSize: 14,
    lineHeight: 1.43,
    fontWeight: 500,
    letterSpacing: '0.3px',
    [below900]: { fontSize: 13 },
  },
  /** 12 / 20px → ~1.67 */
  labelS: { fontSize: 12, lineHeight: 1.67, fontWeight: 500, letterSpacing: '1px' },

  /** 18 / 180% */
  body1: {
    fontSize: 18,
    lineHeight: 1.8,
    fontWeight: 200,
    letterSpacing: '0.3px',
    [below900]: { fontSize: 14 },
  },
  /** 16 / 180% */
  body2: {
    fontSize: 16,
    lineHeight: 1.8,
    fontWeight: 200,
    letterSpacing: '0.3px',
    [below900]: { fontSize: 13 },
  },

  /** 12 / 150% */
  captionS: { fontSize: 12, lineHeight: 1.5, fontWeight: 200, letterSpacing: '0.3px' },
  /** 14 / 20px → ~1.43 */
  captionM: {
    fontSize: 14,
    lineHeight: 1.43,
    fontWeight: 200,
    letterSpacing: '0.3px',
    [below900]: { fontSize: 12 },
  },
  /** 16 / 24px → 1.5 */
  captionL: {
    fontSize: 16,
    lineHeight: 1.5,
    fontWeight: 200,
    letterSpacing: '0.3px',
    [below900]: { fontSize: 13 },
  },

  h1: { fontSize: 80, color: appColor.primary },
  h2: { fontSize: 26, color: appColor.primary },
  button: { fontSize: 14, letterSpacing: '0.3px', textTransform: 'none' },
};

const muiPaletteConfig: PaletteOptions = {
  primary: { main: appColor.primary },
  text: { primary: appColor.text },
};

const muiBreakpointsConfig: BreakpointsOptions = {
  values: { ...breakPoints },
};

const configMuiComponents: Components = {
  /** default css setting */
  MuiCssBaseline: {
    styleOverrides: {
      'html, body': { height: '100%', width: '100%', backgroundColor: appColor.backGround },
    },
  },
  MuiButtonBase: {
    styleOverrides: {
      root: {
        transition: 'all 0.3s ease !important',
      },
    },
  },
};

/**
 * @name DesignSystemProvider
 * @description 앱 전역 디자인 시스템 (테마, 타이포그래피, 색상, 반응형) 제공
 * @external @mui/material
 */
export const DesignSystemProvider = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider
    theme={responsiveFontSizes(
      createTheme({
        typography: { ...muiTypographyConfig },
        palette: { ...muiPaletteConfig },
        breakpoints: { ...muiBreakpointsConfig },
        components: { ...configMuiComponents },
        transitions: {
          duration: {
            shortest: 300,
            shorter: 300,
            short: 300,
            standard: 300,
            complex: 300,
            enteringScreen: 300,
            leavingScreen: 300,
          },
          easing: {
            easeInOut: 'ease',
            easeOut: 'ease',
            easeIn: 'ease',
            sharp: 'ease',
          },
        },
      })
    )}
  >
    <CssBaseline />
    {children}
  </ThemeProvider>
);

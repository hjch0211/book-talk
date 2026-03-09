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
    labelL: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    labelL?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    labelL: true;
  }
}

const muiTypographyConfig: TypographyVariantsOptions = {
  fontFamily: ['S-Core Dream', 'SpoqaHanSansNeo-Regular', 'sans-serif'].join(','),
  h1: { fontSize: 80, color: appColor.primary },
  h2: { fontSize: 26, color: appColor.primary },
  body1: { fontSize: 16, letterSpacing: '2px' },
  body2: { fontSize: 16, fontWeight: 500 },
  button: { fontSize: 26, letterSpacing: '2px' },
  labelL: {
    fontFamily: 'S-Core Dream',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '24px',
    letterSpacing: '1px',
    textAlign: 'center',
    color: '#262626',
  },
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
      })
    )}
  >
    <CssBaseline />
    {children}
  </ThemeProvider>
);

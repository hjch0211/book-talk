import React from "react";
import {
    type BreakpointsOptions,
    type Components,
    CssBaseline,
    type PaletteOptions,
    type TypographyVariantsOptions
} from "@mui/material";
import {createTheme, responsiveFontSizes, ThemeProvider} from "@mui/material/styles";
import {appColor} from "../constants/color.ts";
import {breakPoints} from "../constants/breakPoints.ts";

const muiTypographyConfig: TypographyVariantsOptions = {
    fontFamily: ["S-Core Dream", "SpoqaHanSansNeo-Regular", "sans-serif"].join(","),
    h1: {fontSize: 80, color: appColor.primary},
    h2: {fontSize: 26, color: appColor.primary},
    body1: {fontSize: 16, letterSpacing: "2px"},
    body2: {fontSize: 16, fontWeight: 500},
    button: {fontSize: 26, letterSpacing: "2px"},
};

const muiPaletteConfig: PaletteOptions = {
    primary: {main: appColor.primary},
    text: {primary: appColor.text},
};

const muiBreakpointsConfig: BreakpointsOptions = {
    values: {...breakPoints},
}

const configMuiComponents: Components = {
    /** default css setting */
    MuiCssBaseline: {
        styleOverrides: {
            "html, body": {height: "100%", width: "100%", backgroundColor: appColor.backGround},
        },
    },
};

export const MuiThemeProvider = ({children}: { children: React.ReactNode }) => (
    <ThemeProvider theme={responsiveFontSizes(
        createTheme({
            typography: {...muiTypographyConfig},
            palette: {...muiPaletteConfig},
            breakpoints: {...muiBreakpointsConfig},
            components: {...configMuiComponents},
        }))}>
        <CssBaseline/>
        {children}
    </ThemeProvider>
);

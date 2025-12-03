import {styled} from "@mui/material/styles";
import {Box} from "@mui/material";

export const StyledPageContainer = styled(Box)<{ bgColor?: string }>(({bgColor}) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: bgColor || 'transparent',
    overflow: 'auto',
}));
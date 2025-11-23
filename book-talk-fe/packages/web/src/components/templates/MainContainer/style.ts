import {styled} from "@mui/material/styles";
import {Container} from "@mui/material";

export const StyledContainer = styled(Container)(() => ({
    position: 'relative',
    width: '100%',
    maxWidth: '1440px !important',
    height: '100vh',
    minHeight: '100vh',
    margin: '0 auto',
    padding: 0,
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));
import {styled} from "@mui/material/styles";
import {Container} from "@mui/material";
import {appColor} from "../../constants/color.ts";

export const StyledContainer = styled(Container)<{ bgColor?: string }>(() => ({
    position: 'relative',
    width: '100%',
    maxWidth: '1440px !important',
    height: '100vh',
    minHeight: '100vh',
    margin: '0 auto',
    padding: 0,
    backgroundColor: appColor.backGround,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));
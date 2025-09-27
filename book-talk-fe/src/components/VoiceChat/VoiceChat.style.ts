import {styled} from '@mui/material/styles';
import {Box, IconButton, Slider} from '@mui/material';

export const VoiceChatContainer = styled(Box)(({theme}) => ({
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[8],
    padding: theme.spacing(2),
    minWidth: 320,
    maxWidth: 400,
    zIndex: 1000,
}));

export const VoiceChatHeader = styled(Box)(({theme}) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    paddingBottom: theme.spacing(1),
}));

export const ParticipantsList = styled(Box)(({theme}) => ({
    maxHeight: 200,
    overflowY: 'auto',
    marginBottom: theme.spacing(2),
}));

export const ParticipantItem = styled(Box)<{ isSpeaking?: boolean }>(({theme, isSpeaking}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: isSpeaking ? theme.palette.action.selected : 'transparent',
    border: isSpeaking ? `2px solid ${theme.palette.primary.main}` : '2px solid transparent',
    marginBottom: theme.spacing(0.5),
    transition: 'all 0.2s ease-in-out',
}));

export const ParticipantInfo = styled(Box)(() => ({
    display: 'flex',
    alignItems: 'center',
    flex: 1,
}));

export const ParticipantName = styled(Box)(({theme}) => ({
    marginLeft: theme.spacing(1),
    fontWeight: 500,
}));

export const VoiceChatControls = styled(Box)(({theme}) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(1),
    borderTop: `1px solid ${theme.palette.divider}`,
    paddingTop: theme.spacing(2),
}));

export const MuteButton = styled(IconButton)<{ isMuted?: boolean }>(({theme, isMuted}) => ({
    backgroundColor: isMuted ? theme.palette.error.main : theme.palette.success.main,
    color: theme.palette.common.white,
    '&:hover': {
        backgroundColor: isMuted ? theme.palette.error.dark : theme.palette.success.dark,
    },
}));

export const VolumeControl = styled(Box)(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    minWidth: 120,
}));

export const CustomSlider = styled(Slider)(({theme}) => ({
    color: theme.palette.primary.main,
    height: 4,
    '& .MuiSlider-thumb': {
        width: 16,
        height: 16,
    },
}));
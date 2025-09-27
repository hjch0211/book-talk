import React from 'react';
import {Backdrop, Box, Typography} from '@mui/material';

interface RoundStartBackdropProps {
    open: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}

interface BackdropTextProps {
    children: React.ReactNode;
}

const Title: React.FC<BackdropTextProps> = ({children}) => (
    <Typography
        sx={{
            fontFamily: 'S-Core Dream',
            fontWeight: 600,
            fontSize: '128px',
            lineHeight: '153px',
            textAlign: 'center',
            color: '#FFFFFF',
            height: '153px',
            width: "110%"
        }}
    >
        {children}
    </Typography>
);

const Subtitle: React.FC<BackdropTextProps> = ({children}) => (
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

const Description: React.FC<BackdropTextProps> = ({children}) => (
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

export const RoundStartBackdrop: React.FC<RoundStartBackdropProps> & {
    Title: typeof Title;
    Subtitle: typeof Subtitle;
    Description: typeof Description;
} = ({open, onClose, children}) => {
    return (
        <Backdrop
            open={open}
            onClick={onClose}
            sx={{
                zIndex: 9999,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                transition: 'opacity 300ms ease-out, visibility 300ms ease-out',
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
                    transition: 'opacity 300ms ease-out, transform 300ms ease-out',
                    opacity: open ? 1 : 0,
                    transform: open ? 'scale(1)' : 'scale(0.9)',
                }}
            >
                {children}
            </Box>
        </Backdrop>
    );
};

RoundStartBackdrop.Title = Title;
RoundStartBackdrop.Subtitle = Subtitle;
RoundStartBackdrop.Description = Description;
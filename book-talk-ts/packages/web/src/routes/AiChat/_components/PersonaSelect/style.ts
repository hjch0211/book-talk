import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';
import { styled as muiStyled } from '@mui/material/styles';

export const PersonaSelectBody = muiStyled(Box)({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  marginBottom: 32,
});

export const PersonaDisplayPanel = muiStyled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 36,
  flexShrink: 0,
});

export const PersonaFrame = muiStyled(Box)({
  position: 'relative',
  width: 453,
  height: 398,
});

export const PersonaCircleOuter = muiStyled(Box)({
  position: 'absolute',
  width: 225,
  height: 225,
  left: 'calc(50% - 112.5px)',
  top: 105,
  background: '#FFFFFF',
  border: '2px solid #FFFFFF',
  boxShadow: '0px 0px 10px 8px #E8EBFF',
  borderRadius: '50%',
  overflow: 'hidden',
});

export const PersonaInfoCard = muiStyled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '16px 32px',
  gap: 16,
  borderRadius: 16,
});

export const PersonaNameText = muiStyled(Typography)({
  fontFamily: "'S-Core Dream', sans-serif",
  fontWeight: 600,
  fontSize: 24,
  lineHeight: '27px',
  letterSpacing: '0.3px',
  color: '#262626',
  textAlign: 'center',
  width: '100%',
});

export const PersonaDescText = muiStyled(Typography)({
  fontFamily: "'S-Core Dream', sans-serif",
  fontWeight: 200,
  fontSize: 16,
  lineHeight: '16px',
  letterSpacing: '0.3px',
  color: '#7B7B7B',
  textAlign: 'center',
  width: '100%',
});

export const NameListColumn = muiStyled(Box)({
  position: 'absolute',
  right: '8%',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 24,
});

export const NameListItem = styled.div<{ $selected: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 12px;
  width: 100px;
  font-family: 'MemomentKkukkukk', sans-serif;
  font-weight: 400;
  font-size: 24px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 1px;
  transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;
  color: ${({ $selected }) => ($selected ? '#262626' : '#B6B6B6')};
  background: ${({ $selected }) => ($selected ? 'rgba(255, 255, 255, 0.6)' : 'transparent')};
  border: 3px solid ${({ $selected }) => ($selected ? '#E8EBFF' : 'transparent')};

  &:hover {
    color: ${({ $selected }) => ($selected ? '#262626' : '#8e8e8e')};
  }
`;

export const BadgeChip = styled.div`
  position: absolute;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 18px;
  background: #ffffff;
  width: 83px;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.12);
  border-radius: 20px;
  font-family: 'S-Core Dream', sans-serif;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.15px;
  color: #262626;
  white-space: nowrap;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

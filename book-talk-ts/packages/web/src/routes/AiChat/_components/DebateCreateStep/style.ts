import { Box, List, ListItem, Paper, Typography } from '@mui/material';
import { styled as muiStyled } from '@mui/material/styles';

export const CreateFormWrapper = muiStyled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 28,
  width: '100%',
  maxWidth: 480,
  marginBottom: 24,
  overflowY: 'auto',
  maxHeight: '58vh',
  paddingRight: 4,
  scrollbarWidth: 'thin',
  scrollbarColor: 'rgba(0,0,0,0.15) transparent',
  '&::-webkit-scrollbar': { width: 4 },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(0,0,0,0.15)',
    borderRadius: 4,
  },
});

export const FieldSection = muiStyled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  width: '100%',
});

export const FieldLabelRow = muiStyled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
});

export const FieldLabelInner = muiStyled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 3,
});

export const FieldLabel = muiStyled(Typography)({
  color: '#262626',
});

export const RequiredMark = muiStyled(Typography)({
  color: '#FF5D22',
});

export const FieldHint = muiStyled(Typography)({
  color: '#262626',
});

export const InputBox = muiStyled(Box)({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '12px 20px',
  width: '100%',
  height: 49,
  background: '#FFFFFF',
  border: '1px solid #C4C4C4',
  borderRadius: 6,
  gap: 12,
  transition: 'border-color 0.2s ease',
  '&:focus-within': {
    borderColor: '#8E99FF',
  },
});

export const StyledInput = muiStyled('input')({
  flex: 1,
  border: 'none',
  outline: 'none',
  fontFamily: "'S-Core Dream', sans-serif",
  fontWeight: 200,
  fontSize: 14,
  lineHeight: '25px',
  letterSpacing: '0.5px',
  color: '#262626',
  background: 'transparent',
  minWidth: 0,
  '&::placeholder': {
    color: 'rgba(0, 0, 0, 0.4)',
    opacity: 1,
    fontWeight: 200,
    fontSize: 14,
    letterSpacing: '0.3px',
  },
});

export const StyledTextarea = muiStyled('textarea')({
  width: '100%',
  padding: '12px 20px',
  fontFamily: "'S-Core Dream', sans-serif",
  fontWeight: 200,
  fontSize: 14,
  lineHeight: '1.6',
  letterSpacing: '0.5px',
  color: '#262626',
  background: '#FFFFFF',
  border: '1px solid #C4C4C4',
  borderRadius: 6,
  outline: 'none',
  resize: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s ease',
  '&::placeholder': {
    color: 'rgba(0, 0, 0, 0.4)',
    fontWeight: 200,
    fontSize: 14,
    letterSpacing: '0.3px',
  },
  '&:focus': {
    borderColor: '#8E99FF',
  },
});

export const SearchInputWrapper = muiStyled(Box)({
  position: 'relative',
  width: '100%',
});

export const SearchDropdown = muiStyled(Paper)({
  position: 'absolute',
  top: 49,
  left: 0,
  right: 0,
  maxHeight: 300,
  overflowY: 'auto',
  zIndex: 1000,
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
  background: '#FFFFFF',
  borderRadius: 6,
});

export const SearchResultList = muiStyled(List)({ padding: 0 });

export const SearchResultItem = muiStyled(ListItem)({
  display: 'flex',
  alignItems: 'center',
  padding: '5px 20px',
  gap: 14,
  height: 80,
  cursor: 'pointer',
  transition: 'background-color 0.15s',
  '&:hover': { backgroundColor: '#F5F5F5' },
});

export const BookImage = muiStyled(Box)({
  width: 56,
  height: 68,
  backgroundColor: '#ECECEC',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  flexShrink: 0,
  borderRadius: 2,
});

export const BookInfo = muiStyled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  flex: 1,
  minWidth: 0,
});

export const BookTitle = muiStyled(Typography)({
  color: '#000000',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
});

export const BookAuthor = muiStyled(Typography)({
  color: '#666666',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const NoResultText = muiStyled(Typography)({
  padding: '20px',
  textAlign: 'center',
  color: '#666666',
});

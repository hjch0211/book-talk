import styled from '@emotion/styled';
import { Box, List, ListItem, Paper, Select, TextField, Typography } from '@mui/material';

export const ModalContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '30px 130px',
  gap: '48px',
  height: '100%',
  overflowY: 'auto',
  boxSizing: 'border-box',
});

export const FormContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '36px',
  width: '670px',
});

export const FieldSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  width: '670px',
});

export const FieldLabelRow = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '10px',
});

export const FieldLabelInner = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '3px',
});

/** Use variant="captionM" from parent */
export const FieldLabel = styled(Typography)({
  color: '#262626',
});

/** Use variant="captionM" from parent */
export const RequiredMark = styled(Typography)({
  color: '#FF5D22',
});

/** Use variant="captionS" from parent */
export const FieldHint = styled(Typography)({
  color: '#262626',
});

export const InputBox = styled(Box)({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '12px 20px',
  width: '670px',
  height: '49px',
  background: '#FFFFFF',
  border: '1px solid #C4C4C4',
  borderRadius: '6px',
  gap: '12px',
  transition: 'border-color 0.2s ease',
  '&:focus-within': {
    borderColor: '#8E99FF',
  },
});

export const StyledInput = styled.input({
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
    color: 'rgba(0, 0, 0, 0.6)',
    opacity: 1,
    fontWeight: 200,
    fontSize: 14,
    letterSpacing: '0.3px',
  },
});

export const SearchInputWrapper = styled(Box)({
  position: 'relative',
  width: '100%',
});

export const SearchDropdown = styled(Paper)({
  position: 'absolute',
  top: '49px',
  left: 0,
  right: 0,
  maxHeight: '300px',
  overflowY: 'auto',
  zIndex: 1000,
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
  background: '#FFFFFF',
});

export const SearchResultList = styled(List)({
  padding: 0,
});

export const SearchResultItem = styled(ListItem)({
  display: 'flex',
  alignItems: 'center',
  padding: '5px 20px',
  gap: '14px',
  height: '96px',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: '#F5F5F5',
  },
});

export const BookImage = styled(Box)({
  width: '80px',
  height: '80px',
  backgroundColor: '#ECECEC',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  flexShrink: 0,
});

export const BookInfo = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
  flex: 1,
  minWidth: 0,
});

/** Use variant="labelS" from parent */
export const BookTitle = styled(Typography)({
  color: '#000000',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
});

/** Use variant="captionS" from parent */
export const BookAuthor = styled(Typography)({
  color: '#000000',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

/** Use variant="captionM" from parent */
export const NoResultText = styled(Typography)({
  padding: '20px',
  textAlign: 'center',
  color: '#666666',
});

export const ScheduleRow = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  gap: '10px',
  width: '670px',
});

export const ScheduleTextField = styled(TextField)({
  width: '330px',
  '& .MuiOutlinedInput-root': {
    height: '49px',
    borderRadius: '6px',
    fontFamily: "'S-Core Dream', sans-serif",
    fontWeight: 200,
    fontSize: 14,
    letterSpacing: '0.5px',
    color: '#262626',
    '& fieldset': { borderColor: '#C4C4C4' },
    '&:hover fieldset': { borderColor: '#C4C4C4' },
    '&.Mui-focused fieldset': { borderColor: '#8E99FF', borderWidth: '1px' },
  },
  '& .MuiInputBase-input': {
    padding: '12px 20px',
    fontFamily: "'S-Core Dream', sans-serif",
    fontWeight: 200,
    fontSize: 14,
    '&::-webkit-calendar-picker-indicator': {
      opacity: 0,
      position: 'absolute',
      right: '8px',
      width: '32px',
      height: '32px',
      cursor: 'pointer',
    },
  },
});

export const ParticipantSelect = styled(Select<number>)({
  width: '74px',
  height: '49px',
  borderRadius: '6px',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#C4C4C4',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#C4C4C4',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#8E99FF',
    borderWidth: '1px',
  },
  '& .MuiSelect-select': {
    padding: '12px 0 12px 20px !important',
    fontFamily: "'S-Core Dream', sans-serif",
    fontWeight: 200,
    fontSize: 14,
    letterSpacing: '0.3px',
    color: '#262626',
  },
  '& .MuiSelect-icon': {
    color: '#262626',
    right: '4px',
  },
});

import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const PasswordSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '30px',
  width: 1200,
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

export const ProfileChipGroup = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
});

export const SectionTitle = styled(Typography)({
  fontFamily: 'S-Core Dream',
  fontWeight: 500,
  fontSize: 18,
  lineHeight: '150%',
  letterSpacing: '1px',
  color: '#000000',
});

export const FormContainer = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '24px',
  width: 384,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

export const InputField = styled('input')(({ theme }) => ({
  boxSizing: 'border-box',
  width: 384,
  height: 49,
  background: '#FFFFFF',
  border: '1px solid #C4C4C4',
  borderRadius: 6,
  padding: '12px 20px',
  fontFamily: 'S-Core Dream',
  fontWeight: 200,
  fontSize: 14,
  lineHeight: '180%',
  letterSpacing: '0.5px',
  color: '#262626',
  outline: 'none',
  '&::placeholder': {
    color: '#B6B6B6',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

export const ErrorText = styled(Typography)({
  fontFamily: 'S-Core Dream',
  fontWeight: 200,
  fontSize: 12,
  color: '#FF4D4F',
  width: '100%',
  marginTop: -16,
});

export const InputsWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '100%',
});

export const ButtonRow = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '6px',
});

export const CancelButton = styled('button')({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '12px 24px',
  width: 100,
  height: 44,
  background: '#FFFFFF',
  border: '1px solid #C4C4C4',
  borderRadius: 10,
  fontFamily: 'S-Core Dream',
  fontWeight: 500,
  fontSize: 14,
  lineHeight: '20px',
  letterSpacing: '0.3px',
  color: '#262626',
  cursor: 'pointer',
  '&:hover': {
    background: '#F5F5F5',
  },
});

export const DeleteAccountRow = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'end',
  gap: '12px',
  padding: '16px 24px',
  width: '100%',
});

export const DeleteAccountButton = styled('button')({
  background: 'none',
  border: 'none',
  padding: 0,
  fontFamily: 'S-Core Dream',
  fontWeight: 200,
  fontSize: 14,
  lineHeight: '20px',
  letterSpacing: '0.3px',
  color: '#7B7B7B',
  cursor: 'pointer',
  textDecoration: 'underline',
  '&:hover': {
    color: '#FF4D4F',
  },
});

export const DeleteConfirmText = styled(Typography)({
  fontFamily: 'S-Core Dream',
  fontWeight: 200,
  fontSize: 14,
  lineHeight: '180%',
  letterSpacing: '0.3px',
  color: '#262626',
});

export const DeleteConfirmButton = styled('button')({
  background: 'none',
  border: 'none',
  padding: '4px 12px',
  fontFamily: 'S-Core Dream',
  fontWeight: 500,
  fontSize: 14,
  lineHeight: '20px',
  letterSpacing: '0.3px',
  color: '#FF4D4F',
  cursor: 'pointer',
  borderRadius: 6,
  '&:hover': {
    background: '#FFF1F0',
  },
  '&:disabled': {
    color: '#B0B0B0',
    cursor: 'not-allowed',
  },
});

export const SubmitButton = styled('button')(({ theme }) => ({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '12px 24px',
  width: 384,
  height: 50,
  background: '#F7F8FF',
  border: 'none',
  borderRadius: 10,
  fontFamily: 'S-Core Dream',
  fontWeight: 500,
  fontSize: 14,
  lineHeight: '20px',
  letterSpacing: '0.3px',
  color: '#262626',
  cursor: 'pointer',
  '&:hover': {
    background: '#EEF0FF',
  },
  '&:disabled': {
    background: '#F0F0F0',
    color: '#B0B0B0',
    cursor: 'not-allowed',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}));

export const FieldLabel = styled(Typography)({
  fontFamily: 'S-Core Dream',
  fontWeight: 200,
  fontSize: 14,
  lineHeight: '20px',
  letterSpacing: '0.3px',
  color: '#262626',
});

export const FieldGroup = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '10px',
  width: '100%',
});

export const FieldsWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '60px',
  width: '100%',
});

export const NewPasswordGroup = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '12px',
  width: '100%',
});

export const SubmitButtonWrapper = styled(Box)({
  paddingTop: '30px',
  width: '100%',
});

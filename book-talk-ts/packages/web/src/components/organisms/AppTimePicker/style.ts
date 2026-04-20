import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ScheduleTextField = styled(TextField)(({ theme }) => ({
  width: '330px',
  '& .MuiOutlinedInput-root': {
    height: '49px',
    borderRadius: '6px',
    fontFamily: "'S-Core Dream', sans-serif",
    fontWeight: 200,
    fontSize: '14px',
    letterSpacing: '0.5px',
    color: '#262626',
    '& fieldset': {
      borderColor: '#d9d9d9',
      transition: 'border-color 0.2s ease',
    },
    '&:hover fieldset': { borderColor: '#d9d9d9' },
    '&.Mui-focused fieldset': { borderColor: '#8e99ff', borderWidth: '1px' },
  },
  '& .MuiInputBase-input': {
    padding: '12px 20px',
    fontFamily: "'S-Core Dream', sans-serif",
    fontWeight: 200,
    fontSize: '14px',
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

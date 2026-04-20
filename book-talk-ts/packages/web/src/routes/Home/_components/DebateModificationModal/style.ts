export {
  FieldHint,
  FieldLabel,
  FieldLabelInner,
  FieldLabelRow,
  FieldSection,
  FormContainer,
  ModalContainer,
  ParticipantSelect,
  RequiredMark,
  ScheduleRow,
  ScheduleTextField,
} from '../DebateCreationModal/style.ts';

import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ModalTitle = styled(Typography)({
  color: '#545454',
  textAlign: 'center',
  alignSelf: 'stretch',
});

export const BookReadOnlyBox = styled(Box)(({ theme }) => ({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '12px 20px',
  width: '670px',
  height: '49px',
  background: '#f5f5f5',
  border: '1px solid #c4c4c4',
  borderRadius: '6px',
  gap: '12px',
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

/** Use variant="captionM" from parent */
export const BookReadOnlyText = styled(Typography)({
  color: '#7b7b7b',
});

export const ButtonRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  width: '458px',
  height: '60px',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    width: '100%',
    height: 'auto',
  },
}));

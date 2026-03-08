export {
  FieldHint,
  FieldLabel,
  FieldLabelInner,
  FieldLabelRow,
  FieldSection,
  FormContainer,
  ModalContainer,
  ModalTitle,
  ParticipantSelect,
  RequiredMark,
  ScheduleRow,
  ScheduleTextField,
} from '../DebateCreationModal/style.ts';

import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';

export const BookReadOnlyBox = styled(Box)`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px 20px;
  width: 670px;
  height: 49px;
  background: #f5f5f5;
  border: 1px solid #c4c4c4;
  border-radius: 6px;
  gap: 12px;
`;

export const BookReadOnlyText = styled(Typography)`
  font-family: 'S-Core Dream', sans-serif;
  font-weight: 200;
  font-size: 14px;
  line-height: 180%;
  letter-spacing: 0.5px;
  color: #7b7b7b;
`;

export const ButtonRow = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  width: 458px;
  height: 60px;
`;

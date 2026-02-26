import type { TextFieldProps } from '@mui/material';
import { StyledTextField } from '@src/components/molecules/AppTextField/style.ts';

export function AppTextField(props: TextFieldProps) {
  return <StyledTextField variant="outlined" size="medium" {...props} />;
}

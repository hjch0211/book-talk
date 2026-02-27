import type { TextFieldProps } from '@mui/material';
import { StyledTextField } from '@src/components/molecules/AppTextField/style.ts';
import { forwardRef } from 'react';

export const AppTextField = forwardRef<HTMLInputElement, TextFieldProps & { success?: boolean }>(
  ({ success, ...props }, ref) => {
    return (
      <StyledTextField
        variant="outlined"
        size="medium"
        success={success}
        inputRef={ref}
        {...props}
      />
    );
  }
);

AppTextField.displayName = 'AppTextField';

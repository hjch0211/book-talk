import { type AppButtonProps, StyledButton } from '@src/components/molecules/AppButton/style.ts';

export function AppButton({
  appVariant = 'filled',
  hoverAnimation,
  children,
  ...props
}: AppButtonProps) {
  return (
    <StyledButton
      appVariant={appVariant}
      hoverAnimation={hoverAnimation}
      variant={appVariant === 'outlined' ? 'outlined' : 'contained'}
      disableElevation
      disableRipple
      {...props}
    >
      {children}
    </StyledButton>
  );
}

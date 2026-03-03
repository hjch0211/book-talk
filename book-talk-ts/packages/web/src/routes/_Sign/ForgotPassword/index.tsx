import AppHeader from '@src/components/organisms/AppHeader';
import PageContainer from '@src/components/templates/PageContainer';
import { SignContainer } from '../style';
import { Step1EmailVerification } from './_components/Step1EmailVerification';
import { Step2ResetPassword } from './_components/Step2ResetPassword';
import { useForgotPassword } from './useForgotPassword';

export function ForgotPasswordPage() {
  const { verifiedEmail, step1, step2 } = useForgotPassword();

  return (
    <PageContainer>
      <AppHeader />
      <SignContainer>
        {verifiedEmail === null ? (
          <Step1EmailVerification step1={step1} />
        ) : (
          <Step2ResetPassword step2={step2} />
        )}
      </SignContainer>
    </PageContainer>
  );
}

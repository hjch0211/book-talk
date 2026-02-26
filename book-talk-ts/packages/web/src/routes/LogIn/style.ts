import styled from '@emotion/styled';

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 48px;
  width: 384px;
  margin: 0 auto;
  padding-top: 150px;
`;

export const LoginTitle = styled.h1`
  width: 384px;
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 170%;
  letter-spacing: 0.3px;
  color: #0a0a0a;
  margin: 0;
`;

export const LoginFormSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  width: 384px;
`;

export const SocialSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 384px;
`;

export const DividerContainer = styled.div`
  position: relative;
  width: 384px;
  height: 20px;
  display: flex;
  align-items: center;
`;

export const DividerLine = styled.div`
  width: 100%;
  height: 1px;
  background: #e5e7eb;
`;

export const DividerTextWrapper = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: #ffffff;
  padding: 0 8px;
  white-space: nowrap;
`;

export const DividerText = styled.span`
  font-family: 'Inter',serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: -0.15px;
  color: #6a7282;
`;

export const EmailSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 18px;
  width: 384px;
`;

export const FieldsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 384px;
`;

export const ForgotPassword = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-style: normal;
  font-weight: 200;
  font-size: 12px;
  line-height: 150%;
  letter-spacing: 0.3px;
  text-decoration: underline;
  color: #262626;
`;

export const ButtonsSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 384px;
`;

import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

export const SignContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 48px;
  width: 384px;
  margin: 0 auto;
  padding-top: 150px;
`;

export const SignTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 384px;
`;

export const SignTitle = styled.h1`
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 170%;
  letter-spacing: 0.3px;
  color: #0a0a0a;
  margin: 0;
`;

export const SignFormSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 32px;
  width: 384px;
`;

export const SignForm = styled.form`
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

export const ErrorMessage = styled.p`
    font-style: normal;
    font-weight: 200;
    font-size: 12px;
    line-height: 150%;
    text-align: center;
    letter-spacing: 0.3px;
    color: #d32f2f;
    margin: 0;
    width: 100%;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

export const InlineFieldRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
  width: 384px;
`;

export const DescriptionText = styled.p`
  background: none;
  border: none;
  padding: 0;
  font-family: 'S-Core Dream', serif;
  font-style: normal;
  font-weight: 200;
  font-size: 12px;
  line-height: 150%;
  text-align: center;
  letter-spacing: 0.3px;
  color: #262626;
  text-decoration: none;
`;

export const UrlLink = styled(Link)`
  text-decoration-line: underline;
  color: inherit;
`;

import styled from '@emotion/styled';

export type AppFieldMessageType = 'error' | 'success';

export const StyledFieldMessage = styled.span<{ $type: AppFieldMessageType }>`
  font-family: 'S-Core Dream', serif;
  font-style: normal;
  font-weight: 200;
  font-size: 12px;
  line-height: 150%;
  letter-spacing: 0.3px;
  color: ${({ $type }) => ($type === 'error' ? '#d32f2f' : '#1A00E2')};
  transition: color 0.2s ease;
`;

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from './style';

interface BackButtonProps {
  onClick?: () => void;
  children: ReactNode;
}

export const BackButton = ({ onClick, children }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <Container onClick={handleClick} type="button">
      <ArrowBackIcon sx={{ width: 24, height: 24, color: '#434343', flexShrink: 0 }} />
      <Typography variant={'labelL'}>{children}</Typography>
    </Container>
  );
};

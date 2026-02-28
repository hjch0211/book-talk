import { StyledPagination } from './style';

interface AppPaginationProps {
  count: number;
  page: number;
  onChange: (page: number) => void;
}

export function AppPagination({ count, page, onChange }: AppPaginationProps) {
  return (
    <StyledPagination
      count={count}
      page={page}
      onChange={(_, newPage) => onChange(newPage)}
      showFirstButton
      showLastButton
      siblingCount={4}
    />
  );
}

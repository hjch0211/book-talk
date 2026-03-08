import { IconButton, InputAdornment } from '@mui/material';
import { SearchIcon, StyledInput } from './style';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = '책 제목, 저자 검색',
}: SearchInputProps) {
  return (
    <StyledInput
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      onKeyDown={(e) => e.key === 'Enter' && onSearch?.()}
      endAdornment={
        <InputAdornment position="end">
          <IconButton onClick={onSearch} edge="end" size="small" disableRipple>
            <SearchIcon />
          </IconButton>
        </InputAdornment>
      }
    />
  );
}

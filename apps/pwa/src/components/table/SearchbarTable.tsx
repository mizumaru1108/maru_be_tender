// import { useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Input } from '@mui/material';
// utils
import cssStyles from '../../utils/cssStyles';
import React, { ChangeEvent } from 'react';
import useLocales from 'hooks/useLocales';
import SearchIcon from '@mui/icons-material/Search';

// ----------------------------------------------------------------------

const SearchbarStyle = styled('div')(({ theme }) => ({
  ...cssStyles(theme).bgBlur(),
  zIndex: 99,
  width: '100%',
  alignItems: 'center',
  borderRadius: 8,
  maxWidth: 360,
}));

// ----------------------------------------------------------------------

interface IProps {
  onSearch: (data: string) => void;
}

export default function SearchbarTable({ onSearch }: IProps) {
  const { translate } = useLocales();

  const [value, setValue] = React.useState('');

  const handleKeyupMsg = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(value);
    }
  };

  const handleClick = () => {
    onSearch(value);
  };

  return (
    <SearchbarStyle>
      <Input
        autoFocus
        fullWidth
        disableUnderline
        placeholder={translate('account_manager.search_bar')}
        endAdornment={
          <SearchIcon sx={{ cursor: 'pointer' }} onClick={handleClick} />
          // <InputAdornment position="end">
          //   {/* test */}
          // </InputAdornment>
        }
        onChange={(e) => {
          setValue(e.target.value);
          if (!e.target.value) {
            onSearch(e.target.value);
          }
        }}
        onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyupMsg(e)}
        sx={{
          mr: 1,
          fontWeight: 400,
          border: '1px solid rgba(145, 158, 171, 0.32)',
          borderRadius: '8px',
          color: '#919EAB',
          fontSize: '14px',
          padding: '8px 12px',
        }}
      />
    </SearchbarStyle>
  );
}

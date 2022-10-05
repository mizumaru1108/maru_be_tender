// import { useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Input } from '@mui/material';
// utils
import cssStyles from '../../utils/cssStyles';
import { ChangeEvent } from 'react';
import useLocales from 'hooks/useLocales';

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

export default function SearchbarTable({
  func,
}: {
  func?: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  const { translate } = useLocales();

  return (
    <SearchbarStyle>
      <Input
        autoFocus
        fullWidth
        disableUnderline
        placeholder={translate('account_manager.search_bar')}
        onChange={func}
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

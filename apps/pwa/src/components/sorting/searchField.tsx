import { IconButton, InputAdornment, TextField, TextFieldProps } from '@mui/material';
import Iconify from 'components/Iconify';
import { useDebounce } from 'hooks/useDebounce';
import useLocales from 'hooks/useLocales';
import React from 'react';

interface Props {
  onReturnSearch: (searchName: string) => void;
  isLoading?: boolean;
  reFetch?: () => void;
}

export default function SearchField({
  onReturnSearch,
  isLoading = false,
  reFetch,
  ...other
}: Props & TextFieldProps) {
  const [searchName, setSearchName] = React.useState<string | null>(
    (other?.value as string) || null
  );
  const { translate } = useLocales();
  const debouncedValue = useDebounce<string>(searchName || '', 2000);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchName(event.target.value);
  };

  const handleKeyupMsg = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (debouncedValue === searchName) {
        if (!isLoading) {
          onReturnSearch(debouncedValue);
        }
      } else {
        if (!isLoading) {
          onReturnSearch(searchName || '');
        }
      }
    }
  };

  React.useEffect(() => {
    if (debouncedValue && !isLoading) onReturnSearch(debouncedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);
  React.useEffect(() => {
    if (searchName !== null && searchName === '' && reFetch) reFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchName]);
  return (
    <React.Fragment>
      <TextField
        {...other}
        data-cy={'textfield_search'}
        disabled={isLoading}
        value={searchName || ''}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {searchName && (
                <IconButton
                  data-cy={'button_clear_text_textfield_search'}
                  onClick={() => {
                    if (reFetch) {
                      reFetch();
                    }
                    setSearchName('');
                  }}
                  edge="end"
                >
                  <Iconify
                    icon={'ep:close-bold'}
                    fontSize={'19px'}
                    sx={{ color: 'text.primary', margin: '0 8px', opacity: 0.8 }}
                  />
                </IconButton>
              )}
              {/* <Iconify icon={'eva:search-fill'} sx={{ color: 'text.primary' }} /> */}
            </InputAdornment>
          ),
        }}
        // sx={{ width: '100%', mb: 2 }}
        onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyupMsg(e)}
        onChange={(e) => {
          handleChange(e);
        }}
        placeholder={translate('write_name_to_search')}
      />
    </React.Fragment>
  );
}

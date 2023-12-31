import { TextField, TextFieldProps } from '@mui/material';
import useLocales from 'hooks/useLocales';
import React from 'react';

interface Props {
  onReturnDate: (date: string) => void;
  minDate?: string;
}

export default function SearchDateField({
  onReturnDate,
  minDate,
  ...other
}: Props & TextFieldProps) {
  // const [searchName, setSearchName] = React.useState<string | null>(null);
  // const [value, setValue] = React.useState<string | null>(null);
  const { translate } = useLocales();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // console.log('test:', event.target.value);
    if (event.target.value) {
      // setValue(event.target.value);
      onReturnDate(event.target.value);
    } else {
      // setValue(null);
      onReturnDate('');
    }
  };

  return (
    <React.Fragment>
      <TextField
        {...other}
        type="date"
        data-cy={'textfield_search'}
        onChange={handleChange}
        InputProps={{ inputProps: { min: minDate ?? undefined } }}

        // value={searchName || ''}
        // sx={{ width: '100%', mb: 2 }}
        // placeholder={translate('write_name_to_search')}
      />
    </React.Fragment>
  );
}

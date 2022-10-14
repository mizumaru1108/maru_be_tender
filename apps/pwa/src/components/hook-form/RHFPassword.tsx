// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { IconButton, InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { useState } from 'react';
import Iconify from 'components/Iconify';

// ----------------------------------------------------------------------

type IProps = {
  name: string;
};

type Props = IProps & TextFieldProps;

export default function RHFPassword({ name, ...other }: Props) {
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          type={showPassword ? 'text' : 'password'}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify
                    icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                    sx={{ color: 'text.primary' }}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
          {...field}
          fullWidth
          value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
          error={!!error}
          helperText={error?.message}
          {...other}
        />
      )}
    />
  );
}

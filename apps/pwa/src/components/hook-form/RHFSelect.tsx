// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, TextFieldProps, Typography, MenuItem } from '@mui/material';
//
import { LIST_OF_BANK } from 'sections/auth/register/RegisterFormData';

// ----------------------------------------------------------------------

type IProps = {
  name: string;
  children?: React.ReactNode;
};

type Props = IProps & TextFieldProps;

export default function RHFSelect({ name, children, placeholder, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          {![
            'bank_name',
            'client_field',
            'authority',
            'headquarters',
            'region',
            'governorate',
          ].includes(name) ? (
            <TextField
              {...field}
              InputLabelProps={{ shrink: true }}
              select
              fullWidth
              SelectProps={{ native: true }}
              error={!!error}
              helperText={
                <Typography component="span" sx={{ backgroundColor: 'transparent' }}>
                  {error?.message}
                </Typography>
              }
              {...other}
            >
              {placeholder && (
                <option value="" disabled selected>
                  {placeholder}
                </option>
              )}
              {children}
            </TextField>
          ) : (
            <TextField
              {...field}
              select
              fullWidth
              error={!!error}
              helperText={error?.message}
              {...other}
            >
              {!children &&
                name === 'bank_name' &&
                LIST_OF_BANK.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              {children && children}
            </TextField>
          )}
        </>
      )}
    />
  );
}

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

export default function RHFSelectNoGenerator({ name, children, placeholder, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          InputLabelProps={{ shrink: true }}
          select
          fullWidth
          SelectProps={{ native: true }}
          error={!!error}
          // helperText={
          //   <Typography sx={{ backgroundColor: 'transparent' }}>{error?.message}</Typography>
          // }
          helperText={error?.message}
          {...other}
        >
          {placeholder && (
            <option value="" disabled selected style={{ backgroundColor: '#fff' }}>
              {placeholder}
            </option>
          )}
          {children}
        </TextField>
      )}
    />
  );
}

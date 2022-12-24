// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, TextFieldProps, Typography } from '@mui/material';

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
        <TextField
          {...field}
          InputLabelProps={{ shrink: true }}
          select
          fullWidth
          SelectProps={{ native: true }}
          error={!!error}
          helperText={
            <Typography sx={{ backgroundColor: 'transparent' }}>{error?.message}</Typography>
          }
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

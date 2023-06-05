// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, TextFieldProps, Typography } from '@mui/material';

// ----------------------------------------------------------------------

type IProps = {
  name: string;
  minDate?: string;
  maxDate?: string;
};

type Props = IProps & TextFieldProps;

export default function RHFDatePicker({ name, maxDate, minDate, ...other }: Props) {
  // console.log(other.disabled, 'test disable');
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          InputProps={{ inputProps: { max: maxDate ?? undefined, min: minDate ?? undefined } }}
          SelectProps={{ native: true }}
          error={!!error}
          helperText={
            <Typography component="span" sx={{ backgroundColor: 'transparent' }}>
              {error?.message}
            </Typography>
          }
          {...other}
        />
      )}
    />
  );
}

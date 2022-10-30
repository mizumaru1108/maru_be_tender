// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, TextFieldProps } from '@mui/material';

// ----------------------------------------------------------------------

type IProps = {
  name: string;
  minDate?: string;
  maxDate?: string;
};

type Props = IProps & TextFieldProps;

export default function RHFDatePicker({ name, maxDate, minDate, ...other }: Props) {
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
          // InputProps={{ inputProps: { max: maxDate ?? '', min: minDate ?? '' } }}
          SelectProps={{ native: true }}
          error={!!error}
          helperText={error?.message}
          {...other}
        />
      )}
    />
  );
}

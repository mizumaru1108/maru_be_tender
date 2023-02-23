// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, TextFieldProps, useTheme } from '@mui/material';

// ----------------------------------------------------------------------

type IProps = {
  name: string;
};

type Props = IProps & TextFieldProps;

export default function RHFTextArea({ name, ...other }: Props) {
  const { control } = useFormContext();
  const theme = useTheme();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          multiline
          fullWidth
          InputLabelProps={{ shrink: true }}
          rows={3}
          value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
          error={!!error}
          helperText={error?.message}
          {...other}
          sx={{
            '& > .MuiFormHelperText-root': {
              backgroundColor: 'transparent',
            },
            ...(!other.disabled && {
              '& label.Mui-focused': {
                color: theme.palette.grey[800],
              },
              '& .MuiInputLabel-root': {
                color: theme.palette.grey[800],
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'inherit',
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main,
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                },
              },
            }),
          }}
        />
      )}
    />
  );
}

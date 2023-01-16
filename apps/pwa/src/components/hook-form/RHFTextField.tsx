// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, TextFieldProps, InputAdornment, useTheme } from '@mui/material';

// ----------------------------------------------------------------------

type IProps = {
  name: string;
};

type Props = IProps & TextFieldProps;

export default function RHFTextField({ name, ...other }: Props) {
  const theme = useTheme();
  const { control, watch } = useFormContext();
  let project_beneficiaries = '';
  let condition = false;
  if (name === 'project_beneficiaries_specific_type') {
    project_beneficiaries = watch('project_beneficiaries');
    condition = true;
  }
  if (condition && project_beneficiaries === 'GENERAL') {
    console.log('in');
    return (
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
            error={!!error}
            helperText={error?.message}
            {...other}
          />
        )}
      />
    );
  } else if (condition && project_beneficiaries !== 'GENERAL') {
    return <></>;
  }
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          InputLabelProps={{ shrink: true }}
          fullWidth
          value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
          error={!!error}
          helperText={error?.message}
          InputProps={{
            startAdornment:
              name === 'phone' || name === 'data_entry_mobile' ? (
                <InputAdornment
                  position="start"
                  sx={{
                    mr: 1.5,
                    pr: 1.5,
                    height: 'auto',
                    borderRight: `1px solid ${theme.palette.text.disabled}`,
                    color: theme.palette.text.disabled,
                    '& > .MuiTypography-root': {
                      color: theme.palette.text.disabled,
                    },
                  }}
                >
                  +966
                </InputAdornment>
              ) : null,
          }}
          {...other}
        />
      )}
    />
  );
}

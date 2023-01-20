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
          onChange={(e) => {
            const newDial = e.target.value.match(/\+?\d+/g)?.[0] ?? '';
            // const newNumber = e.target.value.match(/\d+/g)?.[1] ?? '';
            const inputValue = e.target.value;
            let cleanedValue = inputValue.replace(/\s+/g, '').replace(/\D/g, '');
            cleanedValue = cleanedValue.slice(0, 22);
            cleanedValue = cleanedValue.replace(/(.{4})/g, '$1 ');
            field.onChange(
              [
                'phone',
                'data_entry_mobile',
                'entity_mobile',
                'ceo_mobile',
                'chairman_mobile',
                'pm_mobile',
                'execution_time',
              ].includes(name)
                ? newDial
                : ['bank_account_number'].includes(name)
                ? cleanedValue
                : e.target.value
            );
          }}
          InputProps={{
            startAdornment: [
              'phone',
              'data_entry_mobile',
              'entity_mobile',
              'ceo_mobile',
              'chairman_mobile',
              'pm_mobile',
            ].includes(name) ? (
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
            ) : ['bank_account_number'].includes(name) ? (
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
                SA
              </InputAdornment>
            ) : null,
          }}
          {...other}
          sx={{
            '& > .MuiFormHelperText-root': {
              backgroundColor: 'white',
            },
          }}
        />
      )}
    />
  );
}

// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, TextFieldProps, Typography, MenuItem, useTheme } from '@mui/material';
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
  const theme = useTheme();

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
            'clause',
            'clasification_field',
            'support_goal_id',
            'reject_reason',
            'accreditation_type_id',
            'path',
            'supervisors',
            'target_beneficiaries',
            'execution_place',
            'project_duration',
            'project_repeated',
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
              helperText={
                <Typography variant="caption" component="span" sx={{ backgroundColor: 'white' }}>
                  {error?.message}
                </Typography>
              }
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

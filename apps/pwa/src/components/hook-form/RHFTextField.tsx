// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, TextFieldProps, InputAdornment, useTheme, SxProps } from '@mui/material';
import useLocales from '../../hooks/useLocales';
import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

type IProps = {
  name: string;
};

type Props = IProps & TextFieldProps;
export default function RHFTextField({ name, ...other }: Props) {
  const theme = useTheme();
  const { currentLang } = useLocales();

  const sxStyling: SxProps<Theme> | undefined = {
    mr: `${currentLang.value}` === 'ar' ? 1 : 1.5,
    ml: `${currentLang.value}` === 'ar' ? 0 : 0,
    px: 1.5,
    height: 'auto',
    // borderRight: `1px solid ${theme.palette.text.disabled}`,
    borderRight:
      `${currentLang.value}` === 'ar' ? 'none' : `1px solid ${theme.palette.text.disabled}`,
    borderLeft:
      `${currentLang.value}` === 'ar' ? `1px solid ${theme.palette.text.disabled}` : 'none',
    // ...(currentLang.value === 'ar'
    //   ? {
    //       borderRight: `1px solid ${theme.palette.text.disabled}`,
    //     }
    //   : {
    //       borderLeft: `1px solid ${theme.palette.text.disabled}`,
    //     }),
    color: theme.palette.text.disabled,
    '& > .MuiTypography-root': {
      color: theme.palette.text.disabled,
    },
  };

  // console.log('currentLang', currentLang.value);
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
            // lang={'en'}
            inputProps={{ lang: 'en' }}
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
            error={!!error}
            helperText={error?.message}
            {...other}
            sx={{
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
          // lang={'en'}
          inputProps={{ lang: 'en' }}
          InputLabelProps={{ shrink: true }}
          fullWidth
          value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
          error={!!error}
          helperText={error?.message}
          onChange={(e) => {
            const newDial = e.target.value.match(/\+?\d+/g)?.[0] ?? '';
            // const newNumber = e.target.value.match(/\+?\d+/g)?.[0].slice(0, 9) ?? '';
            const newNumber = e.target.value.match(/^5\d{0,8}/)?.[0] ?? '';
            const newPhone = e.target.value.match(/\d{0,9}/)?.[0] ?? '';
            // const newNumber = e.target.value.match(/\d+/g)?.[1] ?? '';
            const inputValue = e.target.value;
            let cleanedValue = inputValue.replace(/\s+/g, '').replace(/\D/g, '');
            cleanedValue = cleanedValue.slice(0, 22);
            cleanedValue = cleanedValue.replace(/(.{4})/g, '$1 ');
            field.onChange(
              ['mobile_number_login', 'execution_time'].includes(name)
                ? newDial
                : ['bank_account_number'].includes(name)
                ? cleanedValue
                : [
                    'mobile_number',
                    'data_entry_mobile',
                    'entity_mobile',
                    'ceo_mobile',
                    'chairman_mobile',
                    'pm_mobile',
                  ].includes(name)
                ? newNumber
                : ['phone'].includes(name)
                ? newPhone
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
              'mobile_number',
              'mobile_number_login',
            ].includes(name) ? (
              <InputAdornment
                position="start"
                sx={{
                  ...sxStyling,
                }}
              >
                +966
              </InputAdornment>
            ) : ['bank_account_number'].includes(name) ? (
              <InputAdornment
                position="start"
                sx={{
                  ...sxStyling,
                }}
              >
                SA
              </InputAdornment>
            ) : null,
          }}
          {...other}
          sx={{
            direction:
              [
                'phone',
                'data_entry_mobile',
                'entity_mobile',
                'ceo_mobile',
                'chairman_mobile',
                'pm_mobile',
                'mobile_number',
                'bank_account_number',
                'mobile_number_login',
              ].includes(name) && `${currentLang.value}` === 'ar'
                ? 'rtl'
                : 'ltr',
            '& > .MuiFormHelperText-root': {
              backgroundColor: 'white',
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

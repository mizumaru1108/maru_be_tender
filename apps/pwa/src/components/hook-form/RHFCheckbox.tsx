// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormControlLabelProps,
  Grid,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';

// ----------------------------------------------------------------------

interface RHFCheckboxProps extends Omit<FormControlLabelProps, 'control'> {
  name: string;
}

export function RHFCheckbox({ name, ...other }: RHFCheckboxProps) {
  const { control } = useFormContext();

  return (
    <FormControlLabel
      control={
        <Controller
          name={name}
          control={control}
          render={({ field }) => <Checkbox {...field} checked={field.value} />}
        />
      }
      {...other}
    />
  );
}

// ----------------------------------------------------------------------

interface RHFMultiCheckboxProps extends Omit<FormControlLabelProps, 'control' | 'label'> {
  name: string;
  label: string;
  options: {
    label: string;
    value: any;
  }[];
}

export function RHFMultiCheckbox({ name, options, label, ...other }: RHFMultiCheckboxProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const onSelected = (option: string) =>
          field.value.includes(option)
            ? field.value.filter((value: string) => value !== option)
            : [...field.value, option];

        return (
          <FormGroup>
            <Grid container spacing={2}>
              <Grid item md={12} xs={12}>
                <Typography variant="h6">{label}</Typography>
              </Grid>
              {options.map((option, index) => (
                <Grid item md={2} xs={2} key={index}>
                  <FormControlLabel
                    key={option.value}
                    control={
                      <Checkbox
                        checked={field.value.includes(option.value)}
                        onChange={() => field.onChange(onSelected(option.value))}
                      />
                    }
                    label={option.label}
                    {...other}
                  />
                </Grid>
              ))}
            </Grid>
          </FormGroup>
        );
      }}
    />
  );
}

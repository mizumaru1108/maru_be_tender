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
import React from 'react';

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
  gridCol: number;
  options: {
    label: string;
    value: any;
  }[];
}

export function RHFMultiCheckbox({
  name,
  options,
  label,
  gridCol = 2,
  ...other
}: RHFMultiCheckboxProps) {
  const { control } = useFormContext();
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);
  const [stateError, setStateError] = React.useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        // console.log({ field, fieldState: { error } });
        const onSelected = (option: string) => {
          const updatedOptions = [...selectedOptions];
          if (updatedOptions.includes(option)) {
            // Remove the option if it already exists
            updatedOptions.splice(updatedOptions.indexOf(option), 1);
          } else {
            // Add the option if it doesn't exist
            updatedOptions.push(option);
          }

          setSelectedOptions(updatedOptions); // Update the state
          field.onChange(updatedOptions); // Update the form field value
        };
        return (
          <FormGroup>
            <Grid container spacing={2}>
              <Grid item md={12} xs={12}>
                <Typography variant="h6" color={error ? 'error' : '#000'}>
                  {label}
                </Typography>
              </Grid>
              {options.map((option, index) => {
                const checked = field.value && field.value.includes(option.value) ? true : false;
                return (
                  <Grid item md={gridCol} xs={6} key={index}>
                    <FormControlLabel
                      key={option.value}
                      control={
                        <Checkbox checked={checked} onChange={() => onSelected(option.value)} />
                      }
                      label={option.label}
                      {...other}
                    />
                  </Grid>
                );
              })}
            </Grid>
            <Grid item md={12} xs={12}>
              {error && error?.message ? (
                <Typography
                  component="span"
                  sx={{ backgroundColor: 'transparent', color: '#FF4943' }}
                >
                  {error?.message}
                </Typography>
              ) : null}
            </Grid>
          </FormGroup>
        );
      }}
    />
  );
}

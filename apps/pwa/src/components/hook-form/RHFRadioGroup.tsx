// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import {
  Radio,
  RadioGroup,
  FormHelperText,
  RadioGroupProps,
  FormControlLabel,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';

// ----------------------------------------------------------------------

type IProps = {
  label: string;
  name: string;
  options: {
    label: string;
    value: any;
  }[];
};

type Props = IProps & RadioGroupProps;

export default function RHFRadioGroup({ name, options, label, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Stack direction="column">
          <Typography>{label}</Typography>
          <RadioGroup {...field} row {...other}>
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>

          {!!error && (
            <FormHelperText error sx={{ px: 2 }}>
              {error.message}
            </FormHelperText>
          )}
        </Stack>
      )}
    />
  );
}

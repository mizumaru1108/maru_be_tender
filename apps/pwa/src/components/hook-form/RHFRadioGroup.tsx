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
  useTheme,
} from '@mui/material';
import { Stack } from '@mui/system';

// ----------------------------------------------------------------------

type IProps = {
  label: string;
  name: string;
  disabled?: boolean;
  options: {
    label: string;
    value: any;
  }[];
};

type Props = IProps & RadioGroupProps;

export default function RHFRadioGroup({ name, options, label, ...other }: Props) {
  const { control } = useFormContext();
  const theme = useTheme();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Stack direction="column">
          <Typography
            sx={{
              ...(other.disabled && {
                color: theme.palette.grey[500],
              }),
            }}
          >
            {label}
          </Typography>
          <RadioGroup {...field} row {...other}>
            {options.map((option) => (
              <FormControlLabel
                data-cy={`${name}.${option.label}.${option.value}`}
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
                disabled={!!other.disabled}
              />
            ))}
          </RadioGroup>

          {!!error && (
            <FormHelperText error sx={{ px: 2, backgroundColor: 'transparent' }}>
              {error.message}
            </FormHelperText>
          )}
        </Stack>
      )}
    />
  );
}

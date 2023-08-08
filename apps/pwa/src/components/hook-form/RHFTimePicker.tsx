// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { TextField, TextFieldProps, Typography } from '@mui/material';
import {
  LocalizationProvider,
  MobileTimePicker,
  StaticTimePicker,
  TimePicker,
} from '@mui/x-date-pickers';
import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { makeStyles } from '@material-ui/core';

// ----------------------------------------------------------------------

const useStyles = makeStyles({
  timePickerRoot: {
    backgroundColor: '#fff',
  },
});

type IProps = {
  name: string;
  minDate?: string;
  maxDate?: string;
};

type Props = IProps & TextFieldProps;

export default function RHFTimePicker({ name, ...other }: Props) {
  // console.log(other.disabled, 'test disable');
  const classes = useStyles();

  const { control } = useFormContext();
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2018-01-01T00:00:00.000Z'));

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          type="time"
          fullWidth
          InputLabelProps={{ shrink: true }}
          // InputProps={{ inputProps: { max: maxDate ?? undefined, min: minDate ?? undefined } }}
          SelectProps={{ native: true }}
          // onChange={(e) => {
          //   console.log('test', dayjs(e.target.value, 'HH:mm').format('hh:mm A'));
          // }}
          error={!!error}
          helperText={
            <Typography component="span" sx={{ backgroundColor: 'transparent' }}>
              {error?.message}
            </Typography>
          }
          {...other}
        />
        // <LocalizationProvider dateAdapter={AdapterDayjs}>
        //   {/* <MobileTimePicker
        //     className={classes.timePickerRoot}
        //     label="For mobile"
        //     value={value}
        //     onChange={(newValue) => {
        //       setValue(newValue);
        //     }}
        //     renderInput={(params) => <TextField {...params} />}
        //   /> */}
        //   {/* <TimePicker
        //     value={value}
        //     onChange={setValue}
        //     renderInput={(params) => <TextField {...params} />}
        //   /> */}
        // </LocalizationProvider>
      )}
    />
  );
}

import { Box, Button, Grid, IconButton, Stack, TextField, Typography } from '@mui/material';
import { CalendarPicker, LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { styled } from '@mui/material/styles';
import dayjs, { Dayjs } from 'dayjs';
import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { isWeekend } from 'date-fns';

interface CustomPickerDayProps extends PickersDayProps<Dayjs> {
  available: boolean;
  isToday: boolean;
}
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const availableDays = ['Sunday', 'Monday', 'Tuesday'];
type DAYS_EN = 'Su' | 'Mo' | 'Tu' | 'We' | 'Th' | 'Fr' | 'Sa';
const DAY_EN = {
  Su: 'Sunday',
  Mo: 'Monday',
  Tu: 'Tuesday',
  We: 'Wednesday',
  Th: 'Thursday',
  Fr: 'Friday',
  Sa: 'Saturday',
};
const DAYS_EN_AR = {
  Su: 'الأحد',
  Mo: 'الإثنين',
  Tu: 'الثلاثاء',
  We: 'الأربعاء',
  Th: 'الخميس',
  Fr: 'الجمعة',
  Sa: 'السبت',
};

const sxProps = {};

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== 'available' && prop !== 'isToday',
})<CustomPickerDayProps>(({ theme, available, isToday }) => ({
  ...(available && {
    borderRadius: '50%',
    backgroundColor: '#0E847852',
    color: '#000',
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.dark,
    },
    border: '1px !important',
  }),
  ...(!available && {
    borderRadius: '50%',
    backgroundColor: '#93A3B029',
    color: '#000',
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.dark,
    },
    border: '1px !important',
  }),
  ...(isToday && {
    borderRadius: '50%',
    backgroundColor: 'red',
    borderColor: '#93A3B029',
    border: '1px !important',
  }),
})) as React.ComponentType<CustomPickerDayProps>;

function SecondStep({ setUserId }: any) {
  const [value, setValue] = React.useState<Date | number | null>(new Date());

  const [date, setDate] = React.useState<Dayjs | null>(null);

  const renderWeekPickerDay = (
    date: Dayjs,
    selectedDates: Array<Dayjs | null>,
    pickersDayProps: PickersDayProps<Dayjs>
  ) => {
    const isToday = date.isSame(dayjs(), 'day');
    return (
      <CustomPickersDay
        {...pickersDayProps}
        available={availableDays.includes(DAYS[date.get('day')])}
        isToday={isToday}
      />
    );
  };
  const disableUnAvailableDays = (date: Dayjs) =>
    !availableDays.includes(DAYS[date.get('day')]) || date.isBefore(dayjs(), 'day');
  return (
    <>
      <Grid item md={12} xs={12}>
        <IconButton
          onClick={() => {
            setUserId('');
          }}
        >
          <svg
            width="42"
            height="41"
            viewBox="0 0 42 41"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="40.6799"
              height="41.53"
              rx="2"
              transform="matrix(-1.19249e-08 -1 -1 1.19249e-08 41.5312 40.6798)"
              fill="#93A3B0"
              fill-opacity="0.24"
            />
            <path
              d="M16.0068 12.341C16.0057 12.5165 16.0394 12.6904 16.1057 12.8529C16.1721 13.0153 16.2698 13.1631 16.3934 13.2877L22.5134 19.3944C22.6384 19.5183 22.7376 19.6658 22.8053 19.8283C22.873 19.9907 22.9078 20.165 22.9078 20.341C22.9078 20.517 22.873 20.6913 22.8053 20.8538C22.7376 21.0163 22.6384 21.1637 22.5134 21.2877L16.3934 27.3944C16.1423 27.6454 16.0013 27.986 16.0013 28.341C16.0013 28.6961 16.1423 29.0366 16.3934 29.2877C16.6445 29.5388 16.985 29.6798 17.3401 29.6798C17.5159 29.6798 17.69 29.6452 17.8524 29.5779C18.0148 29.5106 18.1624 29.412 18.2868 29.2877L24.3934 23.1677C25.1235 22.4078 25.5312 21.3948 25.5312 20.341C25.5312 19.2872 25.1235 18.2743 24.3934 17.5144L18.2868 11.3944C18.1628 11.2694 18.0153 11.1702 17.8529 11.1025C17.6904 11.0348 17.5161 11 17.3401 11C17.1641 11 16.9898 11.0348 16.8273 11.1025C16.6648 11.1702 16.5174 11.2694 16.3934 11.3944C16.2698 11.5189 16.1721 11.6667 16.1057 11.8291C16.0394 11.9916 16.0057 12.1655 16.0068 12.341Z"
              fill="#1E1E1E"
            />
          </svg>
        </IconButton>
      </Grid>
      <Grid item md={12} xs={12}>
        <Typography variant="h4">المواعيدالمتوافرة للشريك ( اسم الشريك)</Typography>
      </Grid>
      <Grid item md={12} xs={12}>
        <Typography>الرجاء اختيار اليوم والوقت المناسب</Typography>
      </Grid>
      <Grid item md={7} xs={12}>
        <Box
          sx={{
            width: '100%',
            backgroundColor: '#fff',
            borderRadius: 5,
            padding: '20px',
            height: '500px',
            ':first-child': { height: '100%', maxHeight: 'unset !important' },
          }}
        >
          <CalendarPicker
            date={date}
            onChange={(newDate) => setDate(newDate)}
            // renderDay={renderWeekPickerDay}
            // shouldDisableDate={disableUnAvailableDays}
            dayOfWeekFormatter={(day) => DAY_EN[`${day as DAYS_EN}`]}
            views={['day']}
            showDaysOutsideCurrentMonth
          />
          {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              orientation="landscape"
              // openTo="day"
              value={value}
              shouldDisableDate={isWeekend}
              views={['day']}
              onChange={(newValue) => {
                setValue(newValue);
              }}
              showToolbar={false}
              showDaysOutsideCurrentMonth
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider> */}
        </Box>
      </Grid>

      {/* for select time */}
      {date && (
        <Grid item md={5} xs={12}>
          <Stack direction="column" gap={'10px'}>
            <Button
              sx={{
                backgroundColor: '#fff',
                padding: '10px',
                display: 'flex',
                justifyContent: 'center',
                height: '50px',
              }}
            >
              <Typography>08:00 صباحاً</Typography>
            </Button>
            <Button
              sx={{
                backgroundColor: '#fff',
                padding: '10px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Typography>08:00 صباحاً</Typography>
            </Button>
            <Button
              sx={{
                backgroundColor: '#fff',
                padding: '10px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Typography>08:00 صباحاً</Typography>
            </Button>
            <Button
              sx={{
                backgroundColor: '#fff',
                padding: '10px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Typography>08:00 صباحاً</Typography>
            </Button>
            <Button
              sx={{
                backgroundColor: '#fff',
                padding: '10px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Typography>08:00 صباحاً</Typography>
            </Button>
            <Button
              sx={{
                backgroundColor: '#fff',
                padding: '10px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Typography>08:00 صباحاً</Typography>
            </Button>
            <Button
              sx={{
                backgroundColor: '#fff',
                padding: '10px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Typography>08:00 صباحاً</Typography>
            </Button>
            <Button
              sx={{
                backgroundColor: '#fff',
                padding: '10px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Typography
                sx={{
                  color: '#000',
                }}
              >
                08:00 صباحاً
              </Typography>
            </Button>
            <Button
              sx={{
                backgroundColor: '#fff',
                padding: '10px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Typography>08:00 صباحاً</Typography>
            </Button>
          </Stack>
        </Grid>
      )}
    </>
  );
}

export default SecondStep;

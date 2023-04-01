import CheckIcon from '@mui/icons-material/Check';
import {
  Badge,
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { CalendarPicker } from '@mui/x-date-pickers';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import dayjs, { Dayjs } from 'dayjs';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useNavigate } from 'react-router';
import {
  IAppointments,
  IAppointmentsTime,
  IArrayAppointments,
  IAvailableDay,
  IAvailableTime,
  ISelectedDate,
} from '../../../@types/appointment';
import EmptyContent from '../../../components/EmptyContent';
import useAuth from '../../../hooks/useAuth';
import useLocales from '../../../hooks/useLocales';
import useResponsive from '../../../hooks/useResponsive';
import axiosInstance from '../../../utils/axios';

interface CustomPickerDayProps extends PickersDayProps<Dayjs> {
  available: boolean;
  isToday: boolean;
  isMonth: boolean;
}
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// const availableDays = ['Sunday', 'Monday', 'Tuesday'];
// const availableDays = ['1', '3', '10'];
// const haveAppoinments = ['5', '9', '20'];
// const haveAppoinments = ['Sunday'];

type DAYS_EN = 'Su' | 'Mo' | 'Tu' | 'We' | 'Th' | 'Fr' | 'Sa';
const DAY_EN_DESKTOP = {
  Su: 'Sunday',
  Mo: 'Monday',
  Tu: 'Tuesday',
  We: 'Wednesday',
  Th: 'Thursday',
  Fr: 'Friday',
  Sa: 'Saturday',
};
const DAY_EN_MOBILE = {
  Su: 'Su',
  Mo: 'Mo',
  Tu: 'Tu',
  We: 'We',
  Th: 'Th',
  Fr: 'Fr',
  Sa: 'Sa',
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
const haveAppoinments = {
  days: ['12'],
  time: [
    {
      day: 'Sunday',
      start: ['09:00 AM', '10:15 AM'],
    },
  ],
};

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== 'available' && prop !== 'isToday' && prop !== 'isMonth',
})<CustomPickerDayProps>(({ theme, available, isToday, isMonth }) => ({
  ...(available && {
    borderRadius: '50%',
    // backgroundColor: '#red !important',
    backgroundColor: '#0E8478',
    color: isMonth ? '#fff' : '#919EAB',
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.dark,
    },
    border: '1px !important',
  }),
  ...(!available && {
    borderRadius: '50%',
    backgroundColor: '#EEF0F2',
    color: '#000',
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.dark,
    },
    border: '1px !important',
  }),
  ...(isToday && {
    borderRadius: '50%',
    backgroundColor: '#EEF0F2',
    color: '#000',
    // borderColor: '#EEF0F2',
    border: '2px solid #0E8478',
  }),
})) as React.ComponentType<CustomPickerDayProps>;

function SecondStep({ userId, setUserId, partnerName }: any) {
  // const [value, setValue] = React.useState<Date | number | null>(new Date());
  const navigate = useNavigate();
  const isMobile = useResponsive('down', 'sm');
  const todayDate = moment().format('YYYY MM DD');
  const newestTime = moment().format('hh:mm A');
  // const newestTime = '9:00 AM';
  const { enqueueSnackbar } = useSnackbar();
  const { activeRole } = useAuth();
  const { translate, currentLang } = useLocales();
  const [isLoading, setIsLoading] = React.useState(false);
  const [reSubmit, setReSubmit] = React.useState(false);

  // console.log('userId : ', userId);
  // const { authCode } = useSelector((state) => state.appointments);

  const badgeRef = React.useRef<HTMLInputElement>(null);
  const [position, setPosition] = React.useState(0);

  const [date, setDate] = React.useState<Dayjs | null>(null);
  const [selectedDay, setSelectedDay] = React.useState<string | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<string>(moment().format('hh:mm A'));
  // month: moment(tmpDate).format('MM'),
  //                   year: moment(tmpDate).format('YYYY'),
  const [selectedDate, setSelectedDate] = React.useState<ISelectedDate>({
    day: moment().format('DD'),
    month: moment().format('MM'),
    year: moment().format('YYYY'),
    date: moment().format('YYYY-MM-DD'),
  });

  const [availableSchedule, setAvailableSchedule] = React.useState<IAvailableDay>();
  const [appointments, setAppointments] = React.useState<IAppointments>();

  const renderWeekPickerDay = (
    date: Dayjs,
    selectedDates: Array<Dayjs | null>,
    pickersDayProps: PickersDayProps<Dayjs>
  ) => {
    const isToday = date.isSame(dayjs(), 'day');
    const isMonth = selectedDate.month === date.format('MM') ?? false;
    if (
      appointments?.days!.includes(moment(date.toISOString()).format('DD')) &&
      selectedDate.month === date.format('MM')
    ) {
      return (
        <Badge
          color="secondary"
          variant="dot"
          ref={badgeRef}
          sx={{
            '& .MuiBadge-badge': {
              right: `${position}px`,
              top: `${position + 10}px`,
              backgroundColor: '#0E8478',
              width: '7px',
              height: '7px',
            },
          }}
        >
          <PickersDay
            sx={{
              width: { md: '56px !important', xs: '36px !important' },
              height: { md: '56px !important', xs: '36px !important' },
              borderRadius: '50%',
              backgroundColor: '#EEF0F2',
              // borderColor: '#EEF0F2',
              // border: '1px !important',
            }}
            {...pickersDayProps}
          />
        </Badge>
      );
    }
    return (
      <Box>
        <CustomPickersDay
          sx={{
            width: { md: '56px !important', xs: '36px !important' },
            height: { md: '56px !important', xs: '36px !important' },
          }}
          {...pickersDayProps}
          available={availableSchedule!.days.includes(DAYS[date.get('day')]) ?? false}
          // available={availableDays.includes(date.get('date').toString())}
          isToday={isToday}
          isMonth={isMonth}
        />
      </Box>
    );
    // return (
    //   <Badge
    //     color="secondary"
    //     variant="dot"
    //     ref={badgeRef}
    //     sx={{
    //       '& .MuiBadge-badge': {
    //         right: `${position}px`,
    //         top: `${position + 10}px`,
    //       },
    //     }}
    //   >
    //     <PickersDay
    //       sx={{
    //         borderRadius: '50%',
    //         backgroundColor: 'red',
    //         borderColor: '#93A3B029',
    //         border: '1px !important',
    //       }}
    //       {...pickersDayProps}
    //     />
    //   </Badge>
    // );
  };

  const disableUnAvailableDays = (date: Dayjs) =>
    !availableSchedule!.days.includes(DAYS[date.get('day')]) || date.isBefore(dayjs(), 'day');
  // moment(date.toISOString(), 'DD-MM-YYYY').isBefore(todayDate) ||
  // moment(date?.toISOString()).format('YYYY MM DD') === todayDate;

  React.useEffect(() => {
    if (!isLoading) {
      setPosition(badgeRef.current ? badgeRef.current.getBoundingClientRect().width / 2 : 0);
    }
  }, [badgeRef, isLoading, isMobile, appointments, selectedDate]);
  // /tender/appointments/fetch?month=3&year=2023

  const fetchingSchedule = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const rest = await axiosInstance.get(`/tender/schedules/client?id=${userId as string}`, {
        headers: { 'x-hasura-role': activeRole! },
      });
      // console.log('rest', rest.data.data);
      if (rest) {
        const tmpValue = rest.data.data;
        const tmpAvailableArray: IAvailableTime[] = tmpValue
          .filter((item: any) => item.start_time)
          .map((item: any) => {
            const { day, time_gap } = item;
            return {
              day: day,
              time_gap: time_gap,
            };
          });
        const tmpAvailableDay: string[] = tmpValue
          .filter((item: any) => item.start_time)
          .map((item: any) => {
            const { day } = item;
            return {
              day,
            };
          });
        const tmpDays = tmpAvailableDay.map((item: any) => item.day);
        setAvailableSchedule({
          days: [...tmpDays],
          time: [...tmpAvailableArray],
        });
      }
    } catch (err) {
      console.log('err', err);
      enqueueSnackbar(err.message, {
        variant: 'error',
        preventDuplicate: true,
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
      });
    } finally {
      setIsLoading(false);
    }
  }, [activeRole, userId, enqueueSnackbar]);

  // console.log('appointments', appointments);

  const fetchingAppointment = React.useCallback(async () => {
    try {
      const rest = await axiosInstance.get(
        `/tender/appointments/fetch?month=${selectedDate?.month}&year=${selectedDate?.year}`,
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      if (rest) {
        const tmpValue: IArrayAppointments[] = rest.data.data.length > 0 ? rest.data.data : [];
        const tmpDates: string[] =
          tmpValue
            .filter(
              (item: IArrayAppointments) =>
                item.status !== 'tentative' && item.status !== 'declined'
            )
            .map((item: IArrayAppointments) => moment(item.date).format('DD')) ?? [];
        const tmpTimes: IAppointmentsTime[] = tmpValue
          .filter(
            (item: IArrayAppointments) => item.status !== 'tentative' && item.status !== 'declined'
          )
          .map((item: IArrayAppointments) => {
            const { start_time, end_time, date } = item;
            const tmpDate = moment(date).format('DD');
            const tmpDay = moment(date).format('dddd');
            return {
              start_time,
              end_time,
              date: tmpDate,
              day: tmpDay,
            };
          });
        if (tmpValue.length > 0) {
          setAppointments({
            days: [...tmpDates],
            time: [...tmpTimes],
          });
        } else {
          setAppointments({
            days: [],
            time: [],
          });
        }
      }
    } catch (err) {
      console.log('err', err);
      enqueueSnackbar(err.message, {
        variant: 'error',
        preventDuplicate: true,
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
      });
    }
  }, [activeRole, selectedDate?.month, selectedDate?.year, enqueueSnackbar]);

  React.useEffect(() => {
    fetchingAppointment();
  }, [fetchingAppointment]);

  React.useEffect(() => {
    fetchingSchedule();
  }, [fetchingSchedule]);

  // console.log({ authCode });

  // const handleSubmit = async () => {
  //   setIsLoading(true);
  //   localStorage.setItem('partnerMeetingId', userId);

  //   const start_moment = moment(selectedTime, 'hh:mm A');
  //   const end_moment = start_moment.add(1, 'hours');
  //   const end_time = end_moment.format('hh:mm A');

  //   const tmpValues = {
  //     authCode: localStorage.getItem('authCodeMeeting') as string,
  //     client_id: userId,
  //     start_time: moment(selectedTime, 'hh:mm A').format('hh:mm A'),
  //     end_time,
  //     date: selectedDate.date,
  //   };
  //   try {
  //     const rest = await axiosInstance.post(
  //       'tender/appointments/create-appointment',
  //       {
  //         ...tmpValues,
  //       },
  //       {
  //         headers: { 'x-hasura-role': activeRole! },
  //       }
  //     );
  //     if (rest) {
  //       enqueueSnackbar('Meeting has been created', {
  //         variant: 'success',
  //         preventDuplicate: true,
  //         autoHideDuration: 3000,
  //       });
  //       navigate('/dashboard/appointments-with-partners');
  //       localStorage.setItem('authCodeMeeting', '');
  //       localStorage.setItem('partnerMeetingId', '');
  //       // setReSubmit(false);
  //     }
  //   } catch (err) {
  //     if (err.statusCode === 401) {
  //       const messages = err.message;
  //       const urlRegex = /(https?:\/\/[^\s]+)/g;
  //       const url = messages.match(urlRegex)[0];
  //       if (url) {
  //         window.open(url, '_self');
  //       }
  //     }
  //     if (err.statusCode !== 401) {
  //       localStorage.setItem('authCodeMeeting', '');
  //       setReSubmit(true);
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmit = React.useCallback(async () => {
    setIsLoading(true);
    const start_moment = moment(selectedTime, 'hh:mm A');
    const end_moment = start_moment.add(1, 'hours');
    const end_time = end_moment.format('hh:mm A');
    const tmpValues = {
      authCode: localStorage.getItem('authCodeMeeting') as string,
      client_id: userId,
      start_time: moment(selectedTime, 'hh:mm A').format('hh:mm A'),
      end_time,
      date: selectedDate.date,
    };
    try {
      const rest = await axiosInstance.post(
        'tender/appointments/create-appointment',
        {
          ...tmpValues,
        },
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      if (rest) {
        enqueueSnackbar('Meeting has been created', {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
        navigate('/dashboard/appointments-with-partners');
        localStorage.removeItem('authCodeMeeting');
        localStorage.removeItem('partnerMeetingId');
        // setReSubmit(false);
      }
    } catch (err) {
      if (err.statusCode === 401) {
        const messages = err.message;
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const url = messages.match(urlRegex)[0];
        if (url) {
          window.open(url, '_self');
        }
      }
      if (err.statusCode !== 401) {
        localStorage.removeItem('authCodeMeeting');
        setReSubmit(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [activeRole, enqueueSnackbar, navigate, userId, selectedTime, selectedDate.date]);

  React.useEffect(() => {
    if (reSubmit) {
      handleSubmit();
    }
  }, [handleSubmit, reSubmit]);

  // console.log('chek', !moment('3:00 PM', 'h:mm A').isAfter(moment(newestTime, 'h:mm A')));
  return (
    <>
      <Grid item md={12} xs={12}>
        <IconButton
          onClick={() => {
            setUserId('');
            // navigate(-1);
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
        <Typography variant="h4">
          {partnerName
            ? translate('appointment.meeting_schedule_header') + ` (${partnerName})`
            : translate('appointment.meeting_schedule_header')}
        </Typography>
      </Grid>
      <Grid item md={12} xs={12}>
        {translate('appointment.meeting_schedule_sub_header')}
      </Grid>
      {isLoading && (
        <Box
          sx={{
            width: '100%',
            mt: 2,
            // height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      )}
      {!isLoading && availableSchedule?.days.length === 0 && (
        <Grid
          item
          md={12}
          xs={12}
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <EmptyContent
            title={translate('appointment.no_schedule')}
            sx={{
              '& span.MuiBox-root': { height: 160 },
            }}
          />
        </Grid>
      )}
      {!isLoading &&
        availableSchedule &&
        availableSchedule.days &&
        availableSchedule?.days?.length > 0 && (
          <Grid item md={7} xs={12}>
            <Box
              sx={{
                width: '100%',
                backgroundColor: '#fff',
                borderRadius: 5,
                padding: '20px',
                height: '500px',
                ':first-child': { height: '100%', maxHeight: 'unset !important' },
                // '& .MuiCalendarPicker-root': {
                //   height: '500px',
                // },
              }}
            >
              <CalendarPicker
                date={date}
                // onChange={(newDate) => setDate(newDate)}
                onChange={(newDate) => {
                  // const tmpDay = moment(newDate?.toISOString()).format('dddd');
                  // console.log('newDate', tmpDay);
                  // setSelectedDate(newDate!.toISOString());
                  setSelectedDate({
                    ...selectedDate,
                    day: moment(newDate?.toISOString()).format('DD'),
                    date: moment(newDate?.toISOString()).format('YYYY-MM-DD'),
                  });
                  setSelectedDay(moment(newDate?.toISOString()).format('dddd'));
                }}
                renderDay={renderWeekPickerDay}
                shouldDisableDate={disableUnAvailableDays}
                dayOfWeekFormatter={(day) =>
                  !isMobile
                    ? DAY_EN_DESKTOP[`${day as DAYS_EN}`]
                    : DAY_EN_MOBILE[`${day as DAYS_EN}`]
                }
                // disablePast
                views={['day']}
                showDaysOutsideCurrentMonth
                onMonthChange={(newDate) => {
                  const tmpDate = newDate.toISOString();
                  setSelectedDay('');
                  setSelectedDate({
                    ...selectedDate,
                    month: moment(tmpDate).format('MM'),
                    year: moment(tmpDate).format('YYYY'),
                  });
                  // console.log('newDate', moment(tmpDate).format('MM'));
                  // console.log('newDate', moment(tmpDate).format('YYYY'));
                }}
              />
            </Box>
          </Grid>
        )}

      {/* for select time */}
      {!isLoading &&
        availableSchedule &&
        availableSchedule.days &&
        availableSchedule?.days?.length > 0 && (
          <Grid item md={5} xs={12} maxHeight={350} overflow={'auto'}>
            <Typography variant="h6" sx={{ fontStyle: 'italic' }} gutterBottom>
              {/* {title ? title : translate('errors.empty_data')} */}
              {moment(selectedDate.date).format('dddd, MMMM Do YYYY') +
                ' - ' +
                moment(selectedTime, 'hh:mm A').format('hh:mm A')}
            </Typography>
            <Stack direction="column" gap={'10px'}>
              {selectedDay &&
                availableSchedule &&
                availableSchedule.time.length > 0 &&
                availableSchedule.time.map((time, index) => {
                  const { time_gap, day } = time;
                  if (selectedDay === day) {
                    const idxMeetingDay =
                      appointments?.time!.findIndex((item) => item.day === selectedDay) ?? -1;
                    // console.log('time_gap', time_gap);
                    return time_gap.map((gap, idx) => (
                      <Button
                        // newestTime
                        key={idx}
                        disabled={
                          idxMeetingDay > -1 &&
                          appointments?.time![idxMeetingDay].start_time.includes(gap)
                            ? true
                            : false ||
                              (!moment(todayDate, 'YYYY-MM-DD').isBefore(
                                moment(selectedDate.date, 'YYYY-MM-DD')
                              ) &&
                                !moment(gap, 'h:mm A').isAfter(moment(newestTime, 'h:mm A')))
                        }
                        onClick={() => {
                          setSelectedTime(gap);
                        }}
                        sx={{
                          backgroundColor: selectedTime === gap ? '#0E8478' : '#fff',
                          color:
                            idxMeetingDay > -1 &&
                            appointments?.time![idxMeetingDay].start_time.includes(gap)
                              ? '#000'
                              : selectedTime === gap
                              ? '#fff'
                              : '#0E8478',
                          padding: '10px',
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography>{gap}</Typography>
                      </Button>
                    ));
                  } else {
                    return <></>;
                  }
                })}
            </Stack>
          </Grid>
        )}
      <Grid
        item
        md={12}
        xs={12}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box
          sx={{
            backgroundColor: 'background.default',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50%',
            gap: 5,
            flexDirection: { md: 'row', xs: 'column' },
          }}
        >
          <Button
            disabled={isLoading}
            onClick={() => {
              setUserId('');
            }}
            sx={{
              color: '#000',
              ':hover': { backgroundColor: '#fff' },
              padding: '10px 20px 10px 20px',
            }}
          >
            رجوع
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !selectedTime}
            sx={{
              color: '#fff',
              backgroundColor: 'background.paper',
              padding: '10px 20px 10px 20px',
            }}
            startIcon={<CheckIcon />}
          >
            حفظ المواعيد
          </Button>
        </Box>
      </Grid>
      {/* {date && (
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
      )} */}
    </>
  );
}

export default SecondStep;

import { yupResolver } from '@hookform/resolvers/yup';
import CheckIcon from '@mui/icons-material/Check';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { FormProvider, RHFCheckbox, RHFSelect } from 'components/hook-form';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import * as Yup from 'yup';
import Iconify from '../../../../components/Iconify';
import axiosInstance from '../../../../utils/axios';

type WeekDays = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

const DAYS = {
  Monday: 'Monday',
  Tuesday: 'Tuesday',
  Wednesday: 'Wednesday',
  Thursday: 'Thursday',
  Friday: 'Friday',
  Saturday: 'Saturday',
  Sunday: 'Sunday',
};

// const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
// export const PERMISSIONS = [
//   'CEO',
//   'PROJECT_MANAGER',
//   'PROJECT_SUPERVISOR',
//   'CONSULTANT',
//   'FINANCE',
//   'CASHIER',
//   'MODERATOR',
//   'ACCOUNTS_MANAGER',
//   'ADMIN',
// ];

// const AVAILABLETIME = [
//   '08:00 صباحاً',
//   '08:15 صباحاً',
//   '08:30 صباحاً',
//   '08:45 صباحاً',
//   '09:00 صباحاً',
//   '09:15 صباحاً',
//   '09:30 صباحاً',
//   '09:45 صباحاً',
// ];

const AVAILABLETIME = [
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
];
type ResponseMySchedule = [
  {
    id: string;
    day: string;
    client_name: string;
    start_time: string;
    end_time: string;
    time_gap: string[];
  }
];

type FormValuesProps = {
  availableTime: { day: boolean; start_time: string; end_time: string }[];
};
function AdjustClentAvailableTime() {
  // const location = useLocation();
  // const { state: schedule } = location as any;
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  // const [_, insertAvailableTime] = useMutation(setAvailableTime);
  const { user, activeRole } = useAuth();
  // const id = user?.id;
  const { translate, currentLang } = useLocales();
  const [isLoading, setIsLoading] = React.useState(false);
  const [mySchedule, setMySchedule] = useState<ResponseMySchedule | null>(null);
  const AdjustClentAvailableTimeSchema = Yup.object().shape({
    availableTime: Yup.array().of(
      Yup.object().shape({
        day: Yup.boolean(),
        start_time: Yup.string().when('day', {
          is: true,
          then: Yup.string().required('بداية الوقت مطلوب'),
        }),
        end_time: Yup.string().when('day', {
          is: true,
          then: Yup.string().required('نهاية الوقت مطلوب'),
        }),
      })
    ),
  });

  const defaultValues = {
    // availableTime: schedule
    //   ? schedule.map((item: any, index: any) => ({
    //       day: item.start_time === '' ? false : true,
    //       start_time: item.start_time,
    //       end_time: item.end_time,
    //     }))
    //   : Object.keys(DAYS).map((item, index) => ({
    //       day: false,
    //       start_time: '',
    //       end_time: '',
    //     })),
    availableTime: Object.keys(DAYS).map((item, index) => ({
      day: false,
      start_time: '',
      end_time: '',
    })),
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(AdjustClentAvailableTimeSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    setIsLoading(true);
    // when the schedule exists so we should use another end-point for editing the whole schedule
    // now updating the schedule waits for the BE's end-point
    // console.log('data : ', data);
    let setAvailableTimePayload: any = data.availableTime.map((item, index) => {
      const { start_time, end_time } = item;
      return {
        // id: nanoid(),
        // id: uuidv4(),
        // user_id: id,
        flag: item.day,
        start_time: start_time,
        end_time: end_time,
        day: Object.keys(DAYS)[index],
      };
    });
    console.log({ setAvailableTimePayload });
    setAvailableTimePayload = setAvailableTimePayload
      .filter((item: any) => item.flag !== false)
      .map((item: any) => {
        const { day, start_time, end_time } = item;
        return {
          start_time: start_time,
          end_time: end_time,
          day: day,
        };
      });
    console.log({ setAvailableTimePayload });
    try {
      const rest = await axiosInstance.post(
        'tender/schedules/upsert-schedules',
        {
          payload: [...setAvailableTimePayload],
        },
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      if (rest) {
        enqueueSnackbar('Successfully', {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
        navigate('/client/dashboard/appointments');
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      enqueueSnackbar(
        `${err.statusCode < 500 && err.message ? err.message : 'something went wrong!'}`,
        {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
        }
      );
    }
  };
  const fetching = async () => {
    // setIsFetching(true);
    try {
      const rest = await axiosInstance.get('tender/schedules/mine', {
        headers: { 'x-hasura-role': activeRole! },
      });
      // console.log('cek: ', rest.data.data);
      if (rest) {
        // setIsFetching(false);
        setMySchedule(rest.data.data);
        reset({
          availableTime: rest.data.data.map((item: any) => {
            const { start_time, end_time } = item;
            if (start_time && end_time) {
              return {
                day: start_time === '' ? false : true,
                start_time: start_time,
                end_time: end_time,
              };
            } else {
              return {
                day: false,
                start_time: '',
                end_time: '',
              };
            }
          }),
        });
      }
    } catch (err) {
      // setIsFetching(false);
      console.log({ err });
      enqueueSnackbar(
        `${err.statusCode < 500 && err.message ? err.message : 'something went wrong!'}`,
        {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
        }
      );
    }
  };
  React.useEffect(() => {
    fetching();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // const [value, handleDateChange] = useState(new Date());
  // const handleChange = (data: any) => {
  //   console.log(data);
  //   handleDateChange(data);
  // };
  // const { pickerProps, wrapperProps } = useStaticState({
  //   value,
  //   onChange: handleChange,
  // });
  // console.log(pickerProps);
  // console.log(wrapperProps);
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '8px' }}>
        <Grid item md={12} xs={12}>
          <Stack direction={'row'} alignItems={'center'}>
            <Button
              color="inherit"
              variant="contained"
              onClick={() => navigate(-1)}
              sx={{ padding: 2, minWidth: 35, minHeight: 25, mr: 3 }}
            >
              <Iconify
                icon={
                  currentLang.value === 'en'
                    ? 'eva:arrow-ios-back-outline'
                    : 'eva:arrow-ios-forward-outline'
                }
                width={25}
                height={25}
              />
            </Button>
            <Typography variant="h4">{translate('pick_your_availabe_time')}</Typography>
          </Stack>
          {/* <StaticDatePicker
            displayStaticWrapperAs="desktop"
            label="Week picker"
            value={value}
            onChange={(newValue) => {
              console.log('asdklmasdlkaklsd');
            }}
            renderDay={renderWeekPickerDay}
            renderInput={(params) => <TextField {...params} />}
            inputFormat="'Week of' MMM d"
          /> */}
          {/* <Box
            sx={{
              py: '10px',
              overflow: 'hidden',

              '& .MuiPickersCalendarHeader-daysHeader': {
                justifyContent: 'space-evenly',
              },
              '& .MuiPickersCalendar-week': {
                justifyContent: 'space-evenly',
              },
              '& .MuiPickersDay-day': {
                backgroundColor: '#878',
              },
              '& .MuiPickersDay-daySelected': {
                backgroundColor: '#000',
              },
              '& .MuiButtonBase-root': {
                color: '#000',
              },
              backgroundColor: '#fff !important',
            }}
          >
            <Calendar {...pickerProps} />
          </Box> */}
        </Grid>
        <Grid item md={12} xs={12}>
          <Typography sx={{ fontSize: '16px', fontWeight: '500' }}>
            {translate('choose_your_week_hours')}
          </Typography>
        </Grid>
        {Object.keys(DAYS).map((item: string, index: number) => (
          <Grid container item md={12} xs={12} key={index} spacing={1}>
            <Grid item md={2} xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
              <RHFCheckbox
                name={`availableTime[${index}].day`}
                // checked={formState.values.availableTime[index].day === true ? true : false}
                label={`${translate('day')} ${translate(DAYS[`${item as WeekDays}`])}`}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <Stack direction="column" gap={1}>
                <Typography>{translate('from')}</Typography>
                <RHFSelect
                  name={`availableTime[${index}].start_time`}
                  placeholder={translate('choose_suitable_time')}
                  children={
                    <>
                      {AVAILABLETIME.map((item, idx) => (
                        <option key={idx} value={item} style={{ backgroundColor: '#fff' }}>
                          {item}
                        </option>
                      ))}
                    </>
                  }
                />
              </Stack>
            </Grid>
            <Grid item md={3} xs={12}>
              <Stack direction="column" gap={1}>
                <Typography>{translate('to')}</Typography>
                <RHFSelect
                  name={`availableTime[${index}].end_time`}
                  placeholder={translate('choose_suitable_time')}
                  children={
                    <>
                      {AVAILABLETIME.map((item, idx) => (
                        <option key={idx} value={item} style={{ backgroundColor: '#fff' }}>
                          {item}
                        </option>
                      ))}
                    </>
                  }
                />
              </Stack>
            </Grid>
          </Grid>
        ))}
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
              sx={{
                color: '#000',
                ':hover': { backgroundColor: '#fff' },
                padding: '10px 20px 10px 20px',
              }}
            >
              رجوع
            </Button>
            <Button
              disabled={isLoading}
              sx={{
                color: '#fff',
                backgroundColor: 'background.paper',
                padding: '10px 20px 10px 20px',
              }}
              startIcon={<CheckIcon />}
              type="submit"
            >
              حفظ المواعيد
            </Button>
          </Box>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default AdjustClentAvailableTime;

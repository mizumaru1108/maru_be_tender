import { yupResolver } from '@hookform/resolvers/yup';
import CheckIcon from '@mui/icons-material/Check';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { FormProvider, RHFCheckbox, RHFSelect } from 'components/hook-form';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
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
type AvailableTime = { day: boolean; start_time: string; end_time: string };
type FormValuesProps = {
  availableTime: AvailableTime[];
};
function AdjustClentAvailableTime() {
  // const location = useLocation();
  // const { state: schedule } = location as any;
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
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
    setValue,
    watch,
    formState: { isSubmitting },
  } = methods;

  const availableTimes = watch('availableTime');
  // console.log({ availableTimes });

  const onSubmit = async (data: FormValuesProps) => {
    setIsLoading(true);
    // console.log({ data });
    // when the schedule exists so we should use another end-point for editing the whole schedule
    // now updating the schedule waits for the BE's end-point
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
    // console.log({ setAvailableTimePayload });
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
      // enqueueSnackbar(
      //   `${err.statusCode < 500 && err.message ? err.message : 'something went wrong!'}`,
      //   {
      //     variant: 'error',
      //     preventDuplicate: true,
      //     autoHideDuration: 3000,
      //   }
      // );
      const statusCode = (err && err.statusCode) || 0;
      const message = (err && err.message) || null;
      enqueueSnackbar(
        `${
          statusCode < 500 && message ? message : translate('pages.common.internal_server_error')
        }`,
        {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
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
      const statusCode = (err && err.statusCode) || 0;
      const message = (err && err.message) || null;
      enqueueSnackbar(
        `${
          statusCode < 500 && message ? message : translate('pages.common.internal_server_error')
        }`,
        {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        }
      );
    }
  };
  React.useEffect(() => {
    fetching();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '8px' }}>
        <Grid item md={12} xs={12}>
          <Stack direction={'row'} alignItems={'center'}>
            <Button
              data-cy="button_back"
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
            <Typography data-cy="pick_your_availabe_time" variant="h4">
              {translate('pick_your_availabe_time')}
            </Typography>
          </Stack>
        </Grid>
        <Grid item md={12} xs={12}>
          <Typography data-cy="choose_your_week_hours" sx={{ fontSize: '16px', fontWeight: '500' }}>
            {translate('choose_your_week_hours')}
          </Typography>
        </Grid>
        {Object.keys(DAYS).map((item: string, index: number) => (
          <Grid container item md={12} xs={12} key={index} spacing={1}>
            <Grid item md={2} xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
              <RHFCheckbox
                data-cy={`availableTime.${index}.day`}
                name={`availableTime.${index}.day`}
                // checked={availableTimes[index]?.day === true ? true : false}
                // label={`${translate('day')} ${translate(DAYS[`${item as WeekDays}`])}`}
                label={``}
                onClick={() => {
                  if (availableTimes[index].day) {
                    console.log('mask sini');
                    setValue(`availableTime.${index}`, {
                      day: false,
                      start_time: '',
                      end_time: '',
                    });
                  }
                }}
              />
              <Typography data-cy={`title_availableTime.${index}.day`}>
                {translate(DAYS[`${item as WeekDays}`])}
              </Typography>
            </Grid>
            <Grid item md={3} xs={12}>
              <Stack direction="column" gap={1}>
                <Typography>{translate('from')}</Typography>
                <RHFSelect
                  data-cy={`availableTime.${index}.start_time`}
                  name={`availableTime.${index}.start_time`}
                  placeholder={translate('choose_suitable_time')}
                  disabled={!availableTimes[index].day}
                  children={
                    <>
                      {AVAILABLETIME.map((item, idx) => (
                        <option
                          data-cy={`option_availableTime.${index}.start_time`}
                          key={idx}
                          value={item}
                          style={{ backgroundColor: '#fff' }}
                        >
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
                  data-cy={`availableTime.${index}.end_time`}
                  name={`availableTime.${index}.end_time`}
                  placeholder={translate('choose_suitable_time')}
                  disabled={!availableTimes[index].day}
                  children={
                    <>
                      {AVAILABLETIME.map((item, idx) => (
                        <option
                          data-cy={`option_availableTime.${index}.end_time`}
                          key={idx}
                          value={item}
                          style={{ backgroundColor: '#fff' }}
                        >
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
              data-cy="button_cancel"
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
              data-cy="button_save"
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

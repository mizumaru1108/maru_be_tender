import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, RHFCheckbox, RHFSelect } from 'components/hook-form';
import { Box, Button, Grid, Stack, Typography, TextField, Paper } from '@mui/material';
import useLocales from 'hooks/useLocales';
import CheckIcon from '@mui/icons-material/Check';
import useAuth from 'hooks/useAuth';
import { nanoid } from 'nanoid';
import { useMutation } from 'urql';
import { setAvailableTime } from 'queries/client/setAvailableTime';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { useState } from 'react';
import { useStaticState, ClockView, Calendar } from '@material-ui/pickers';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { useLocation, useNavigate } from 'react-router';

type WeekDays = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

const DAYS = {
  Sunday: 'sunday',
  Monday: 'monday',
  Tuesday: 'tuesday',
  Wednesday: 'wednesday',
  Thursday: 'thursday',
  Friday: 'friday',
  Saturday: 'saturday',
};
const AVAILABLETIME = [
  '08:00 صباحاً',
  '08:15 صباحاً',
  '08:30 صباحاً',
  '08:45 صباحاً',
  '09:00 صباحاً',
  '09:15 صباحاً',
  '09:30 صباحاً',
  '09:45 صباحاً',
];

type FormValuesProps = {
  availableTime: { day: boolean; start_time: string; end_time: string }[];
};
function AdjustClentAvailableTime() {
  const location = useLocation();
  const { state: schedule } = location as any;
  const navigate = useNavigate();
  const [_, insertAvailableTime] = useMutation(setAvailableTime);
  const { user } = useAuth();
  const id = user?.id;
  const { translate } = useLocales();
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
    availableTime: schedule
      ? schedule.map((item: any, index: any) => ({
          day: item.start_time === '' ? false : true,
          start_time: item.start_time,
          end_time: item.end_time,
        }))
      : Object.keys(DAYS).map((item, index) => ({
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
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    // when the schedule exists so we should use another end-point for editing the whole schedule
    // now updating the schedule waits for the BE's end-point
    const setAvailableTimePayload = data.availableTime.map((item, index) => ({
      id: nanoid(),
      user_id: id,
      start_time: item.start_time,
      end_time: item.end_time,
      day: Object.keys(DAYS)[index],
    }));
    try {
      const res = await insertAvailableTime({
        setAvailableTimePayload,
      });
      console.log(res);
      navigate('/client/dashboard/appointments');
    } catch (error) {
      console.log(setAvailableTimePayload);
    }
    console.log(setAvailableTimePayload);
  };
  const [value, handleDateChange] = useState(new Date());
  const handleChange = (data: any) => {
    console.log(data);
    handleDateChange(data);
  };
  // const { pickerProps, wrapperProps } = useStaticState({
  //   value,
  //   onChange: handleChange,
  // });
  // console.log(pickerProps);
  // console.log(wrapperProps);
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '8px' }}>
        <Grid item md={6} xs={6}>
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
          <Typography variant="h4">{translate('pick_your_availabe_time')}</Typography>
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
            }}
          >
            <Button
              sx={{
                color: '#000',
                ':hover': { backgroundColor: '#fff' },
                padding: '10px 20px 10px 20px',
              }}
            >
              رجوع
            </Button>
            <Button
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

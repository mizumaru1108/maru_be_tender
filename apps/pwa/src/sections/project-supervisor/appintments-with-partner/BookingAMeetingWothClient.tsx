import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Iconify from 'components/Iconify';
import useLocales from 'hooks/useLocales';
import { useState } from 'react';
import { CalendarPicker } from '@mui/x-date-pickers/CalendarPicker';
import dayjs, { Dayjs } from 'dayjs';
import * as React from 'react';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { useQuery } from 'urql';
import { getScheduleByUser } from 'queries/client/getScheduleByUser';
import { DaySeriesModel } from '@fullcalendar/common';
import { styled } from '@mui/material/styles';
import StepOne from './StepOne';
import SecondStep from './SecondStep';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
interface CustomPickerDayProps extends PickersDayProps<Dayjs> {
  available: boolean;
  isToday: boolean;
  // isLastDay: boolean;
}
type DAYS_EN = 'Su' | 'Mo' | 'Tu' | 'We' | 'Th' | 'Fr' | 'Sa';
const DAYS_EN_AR = {
  Su: 'الأحد',
  Mo: 'الإثنين',
  Tu: 'الثلاثاء',
  We: 'الأربعاء',
  Th: 'الخميس',
  Fr: 'الجمعة',
  Sa: 'السبت',
};
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

function BookingAMeetingWothClient() {
  // const [userId, setUserId] = useState<string>('0b7a7973-b7ac-4923-88b7-861e4630a34c');
  const [userId, setUserId] = useState<string>(localStorage.getItem('partnerMeetingId') ?? '');
  const [partnerName, setPartnerName] = useState<string>('');
  const shouldPause = userId === '';
  const [result, mutate] = useQuery({
    query: getScheduleByUser,
    variables: { id: userId },
    pause: shouldPause,
  });
  const { data, fetching, error } = result;
  const [open, setOpen] = useState<boolean>(false);
  const handleOnOpen = () => {
    setOpen(!open);
  };
  const handleSetId = (data: string) => {
    setUserId(data);
    window.scrollTo(0, 0);
  };
  const handleSetPartnerName = (partnerName: string) => {
    setPartnerName(partnerName);
    window.scrollTo(0, 0);
  };
  // if (fetching) return <>... Loading</>;
  // if (error) return <>Oooops.. something went wrong</>;
  return (
    <Grid container spacing={5}>
      {userId === '' && (
        <StepOne
          handleOnOpen={handleOnOpen}
          handleSetId={handleSetId}
          handleSetPartnerName={handleSetPartnerName}
        />
      )}
      {userId !== '' && (
        <SecondStep userId={userId} setUserId={handleSetId} partnerName={partnerName} />
      )}
      {/* <SecondStep setUserId={setUserId} /> */}
    </Grid>
  );
}

export default BookingAMeetingWothClient;

import { Button, Skeleton, Stack, Typography } from '@mui/material';
import useLocales from 'hooks/useLocales';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useNavigate } from 'react-router';
import { IArrayAppointments } from '../../../@types/appointment';
import {
  Appointments,
  AppointmentsTableHeader,
} from '../../../components/table/appointment/client/appointments';
import AppointmentsTable from '../../../components/table/appointment/client/AppointmentsTable';
import useAuth from '../../../hooks/useAuth';
import axiosInstance from '../../../utils/axios';
import MeetingBox from './MeetingBox';
import { data } from './mockData';

function AppointmentsEmployee() {
  const navigate = useNavigate();
  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const { activeRole } = useAuth();

  //state
  const [isLoading, setIsLoading] = React.useState(false);
  const [appointments, setAppointments] = React.useState<IArrayAppointments[]>();
  const [todayAppointments, setTodayAppointments] = React.useState<Appointments[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = React.useState<Appointments[]>([]);

  //table
  const headerCells: AppointmentsTableHeader[] = [
    {
      id: 'statusId',
      label: translate('appointments_headercell.status_id'),
      align: 'left',
    },
    { id: 'meetingTime', label: translate('appointments_headercell.meeting_time'), align: 'left' },
    {
      id: 'employee',
      label: translate('appointments_headercell.employee'),
      align: 'left',
    },
    {
      id: 'action',
      label: translate('appointments_headercell.action'),
      align: 'center',
    },
  ];

  const fetchingAppointment = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const rest = await axiosInstance.get(`/tender/appointments/mine`, {
        headers: { 'x-hasura-role': activeRole! },
      });
      if (rest) {
        // console.log('rest', rest.data.data);
        setAppointments(rest.data.data);
      }
    } catch (err) {
      // console.log('err', err);
      // enqueueSnackbar(err.message, {
      //   variant: 'error',
      //   preventDuplicate: true,
      //   autoHideDuration: 3000,
      //   anchorOrigin: {
      //     vertical: 'bottom',
      //     horizontal: 'center',
      //   },
      // });
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
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRole, enqueueSnackbar]);

  React.useEffect(() => {
    fetchingAppointment();
  }, [fetchingAppointment]);

  React.useEffect(() => {
    if (appointments) {
      const todayDate = moment().format('DD-MM-YYYY');
      const tmpTodayValues = appointments
        .filter(
          (item: IArrayAppointments) =>
            item.status === 'confirmed' &&
            moment(moment(item.date).format('DD-MM-YYYY')).isSame(moment(todayDate))
        )
        .map((item: IArrayAppointments) => ({
          id: item.status.charAt(0).toUpperCase() + item.status.slice(1),
          meetingId: item.id,
          meetingTime: `${moment(item.date).format('DD-MM-YYYY')} ${item.start_time} - ${
            item.end_time
          }`,
          employee: item.employee_name ?? 'Un Provide',
          appointmentLink: item.meeting_url,
        }));
      const tmpUpcomingValues = appointments
        .filter(
          (item: IArrayAppointments) =>
            item.status === 'confirmed' &&
            moment(moment(item.date).format('DD-MM-YYYY')).isBefore(moment(todayDate))
        )
        .map((item: IArrayAppointments) => ({
          id: item.status.charAt(0).toUpperCase() + item.status.slice(1),
          meetingId: item.id,
          meetingTime: `${moment(item.date).format('DD-MM-YYYY')} ${item.start_time} - ${
            item.end_time
          }`,
          employee: item.employee_name ?? 'Un Provide',
          appointmentLink: item.meeting_url,
        }));
      console.log({ tmpTodayValues, tmpUpcomingValues });
      setTodayAppointments(tmpTodayValues);
      setUpcomingAppointments(tmpUpcomingValues);
    }
    // eslint-disable-next-line
  }, [appointments]);

  return (
    <Stack direction="column" gap={3}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4">{translate('appointments_with_clients')}</Typography>
        <Button
          sx={{
            backgroundColor: '#0E8478',
            color: '#fff',
            borderRadius: '5px',
            px: '30px',
            py: '10px',
          }}
          onClick={() => {
            localStorage.removeItem('authCodeMeeting');
            localStorage.removeItem('partnerMeetingId');
            navigate('/project-supervisor/dashboard/appointments-with-partners/booking');
          }}
        >
          {translate('booking_for_a_meeting')}
        </Button>
      </Stack>
      <Stack>
        {!isLoading ? (
          // <AppointmentsTap defaultValues={appointments ?? []} />
          <AppointmentsTable
            headline={translate('appointment_table.today_headline')}
            isLoading={isLoading}
            headerCell={headerCells}
            data={todayAppointments ?? []}
            isRequest={false}
          />
        ) : (
          <Skeleton variant="rounded" height={160} />
        )}
      </Stack>
      <Stack>
        {!isLoading ? (
          // <AppointmentsTap defaultValues={appointments ?? []} />
          <AppointmentsTable
            headline={translate('appointment_table.upcoming_headline')}
            isLoading={isLoading}
            headerCell={headerCells}
            data={upcomingAppointments ?? []}
            isRequest={false}
          />
        ) : (
          <Skeleton variant="rounded" height={160} />
        )}
      </Stack>
      {/* <Typography color="#8E8E8E" sx={{ mt: '30px' }}>
        {translate('todays_meetings')}
      </Typography>
      {data.map((item, index) => (
        <MeetingBox key={index} id={item.id} date={item.date} client_name={item.client_name} />
      ))} */}
      {/* <Typography color="#8E8E8E" sx={{ mt: '30px' }}>
        {translate('upcoming_meetings')}
      </Typography>
      {data.map((item, index) => (
        <MeetingBox key={index} id={item.id} date={item.date} client_name={item.client_name} />
      ))} */}
    </Stack>
  );
}

export default AppointmentsEmployee;

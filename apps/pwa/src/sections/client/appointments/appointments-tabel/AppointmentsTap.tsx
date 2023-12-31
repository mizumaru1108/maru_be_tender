import { Box, Stack } from '@mui/material';
import moment from 'moment';
import React from 'react';
import { isDateAbove } from 'utils/checkIsAboveDate';
import { IArrayAppointments } from '../../../../@types/appointment';
import {
  Appointments,
  AppointmentsTableHeader,
} from '../../../../components/table/appointment/client/appointments';
import AppointmentsTable from '../../../../components/table/appointment/client/AppointmentsTable';
import useLocales from '../../../../hooks/useLocales';
import TodaysAppointments from './TodaysAppointments';
const mock_data: Appointments[] = [
  {
    id: '1',
    meetingId: '12',
    meetingTime: '27-9-2022 12:00 - 01:00 PM',
    employee: 'tender_project_supervisor',
    appointmentLink: 'https://google.com',
  },
];

interface Props {
  defaultValues: IArrayAppointments[];
}

function AppointmentsTap({ defaultValues }: Props) {
  const { translate, currentLang } = useLocales();
  const [isLoading, setIsLoading] = React.useState(false);
  // const [appointments, setAppointments] = React.useState<Appointments[]>([]);
  const [todayAppointments, setTodayAppointments] = React.useState<Appointments[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = React.useState<Appointments[]>([]);

  React.useEffect(() => {
    if (defaultValues) {
      const todayDate = moment().format('DD-MM-YYYY');
      const tmpTodayValues = defaultValues
        .filter(
          (item: IArrayAppointments) =>
            item.status === 'confirmed' &&
            moment(moment(item.date).format('DD-MM-YYYY')).isSame(moment(todayDate))
          // isDateAbove(moment(item.date).format('DD-MM-YYYY'), todayDate, 'same')
        )
        .map((item: IArrayAppointments) => ({
          id: item.status.charAt(0).toUpperCase() + item.status.slice(1),
          meetingId: item.id,
          meetingTime: `${moment(item.date).format('DD-MM-YYYY')} ${item.start_time} - ${
            item.end_time
          }`,
          employee: item.employee_name ?? translate('appointments_row.un_provide'),
          appointmentLink: item.meeting_url,
        }));
      const tmpUpcomingValues = defaultValues
        .filter(
          (item: IArrayAppointments) =>
            item.status === 'confirmed' &&
            // moment(item.date, 'DD-MM-YYYY').isSameOrAfter(moment(todayDate, 'DD-MM-YYYY'))
            isDateAbove(moment(item.date).format('DD-MM-YYYY'), todayDate, 'above')
        )
        .map((item: IArrayAppointments) => ({
          id: item.status.charAt(0).toUpperCase() + item.status.slice(1),
          meetingId: item.id,
          meetingTime: `${moment(item.date).format('DD-MM-YYYY')} ${item.start_time} - ${
            item.end_time
          }`,
          employee: item.employee_name ?? translate('appointments_row.un_provide'),
          appointmentLink: item.meeting_url,
        }));
      setTodayAppointments(tmpTodayValues);
      setUpcomingAppointments(tmpUpcomingValues);
    }
    // eslint-disable-next-line
  }, [currentLang]);

  // console.log({ todayAppointments, upcomingAppointments });

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

  return (
    <Box sx={{ display: 'flex', gap: 3, flexDirection: 'column' }}>
      <Stack direction={'column'} gap={2}>
        <AppointmentsTable
          data-cy="table_today_appointments"
          headline={translate('appointment_table.today_headline')}
          isLoading={isLoading}
          headerCell={headerCells}
          data={todayAppointments ?? []}
          isRequest={false}
        />
        <AppointmentsTable
          data-cy="table_upcoming_appointments"
          headline={translate('appointment_table.upcoming_headline')}
          isLoading={isLoading}
          headerCell={headerCells}
          data={upcomingAppointments ?? []}
          isRequest={false}
        />
      </Stack>
    </Box>
  );
}

export default AppointmentsTap;

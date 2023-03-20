import { Box, Stack } from '@mui/material';
import React from 'react';
import {
  Appointments,
  AppointmentsTableHeader,
} from '../../../../components/table/appointment/client/appointments';
import AppointmentsTable from '../../../../components/table/appointment/client/AppointmentsTable';
import useLocales from '../../../../hooks/useLocales';
import TodaysAppointments from './TodaysAppointments';
import UpcomingAppointments from './UpcomingAppointments';
const mock_data: Appointments[] = [
  {
    id: '1',
    meetingId: '12',
    meetingTime: '27-9-2022 12:00 - 01:00 PM',
    employee: 'tender_project_supervisor',
    appointmentLink: 'https://google.com',
  },
];

function AppointmentsTap() {
  const { translate, currentLang } = useLocales();
  const [isLoading, setIsLoading] = React.useState(false);
  const [appointments, setAppointments] = React.useState<Appointments[]>([]);

  React.useEffect(() => {
    if (mock_data) {
      setAppointments(
        mock_data.map((appointment: Appointments) => ({
          id: appointment.id,
          meetingId: appointment.meetingId,
          meetingTime: appointment.meetingTime,
          employee: appointment.employee,
          appointmentLink: appointment.appointmentLink,
        }))
      );
    }
    // eslint-disable-next-line
  }, [currentLang]);

  const headerCells: AppointmentsTableHeader[] = [
    {
      id: 'projectNumber',
      label: translate('appointments_headercell.project_number'),
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
      align: 'left',
    },
  ];

  return (
    <Box sx={{ display: 'flex', gap: 3, flexDirection: 'column' }}>
      {/* <TodaysAppointments />
      <UpcomingAppointments /> */}
      {/* <ProjectManagementTable
      headline={translate('project_management_table.headline')}
      isLoading={fetching}
      headerCell={headerCells}
      data={projectManagementData ?? []}
    /> */}
      <Stack direction={'column'} gap={2}>
        <AppointmentsTable
          headline={translate('appointment_table.today_headline')}
          isLoading={isLoading}
          headerCell={headerCells}
          data={appointments ?? []}
          isRequest={false}
        />
        <AppointmentsTable
          headline={translate('appointment_table.upcoming_headline')}
          isLoading={isLoading}
          headerCell={headerCells}
          data={appointments ?? []}
          isRequest={false}
        />
      </Stack>
    </Box>
  );
}

export default AppointmentsTap;

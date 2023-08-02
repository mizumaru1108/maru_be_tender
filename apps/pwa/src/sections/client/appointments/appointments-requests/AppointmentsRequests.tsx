import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import {
  Appointments,
  AppointmentsTableHeader,
} from '../../../../components/table/appointment/client/appointments';
import React from 'react';
import useLocales from '../../../../hooks/useLocales';
import AppointmentsTable from '../../../../components/table/appointment/client/AppointmentsTable';
import { IArrayAppointments } from '../../../../@types/appointment';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import useAuth from '../../../../hooks/useAuth';
import axiosInstance from '../../../../utils/axios';

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
  refetch: () => void;
}

function AppointmentsRequests({ defaultValues, refetch }: Props) {
  const { translate, currentLang } = useLocales();
  const [isLoading, setIsLoading] = React.useState(false);
  const [appointments, setAppointments] = React.useState<Appointments[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const { activeRole } = useAuth();

  React.useEffect(() => {
    if (defaultValues.length > 0) {
      const tmpValues = defaultValues
        .filter((item: IArrayAppointments) => item.status === 'tentative')
        .map((item: IArrayAppointments) => ({
          id: item.status.charAt(0).toUpperCase() + item.status.slice(1),
          meetingId: item.id,
          meetingTime: `${moment(item.date).format('DD-MM-YYYY')} ${item.start_time} - ${
            item.end_time
          }`,
          employee: item.employee_name ?? translate('appointments_row.un_provide'),
          appointmentLink: item.meeting_url,
        }));
      setAppointments(tmpValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLang, defaultValues]);

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

  const handleAccept = async (id: string) => {
    // console.log({ id });
    setIsLoading(true);
    try {
      const rest = await axiosInstance.patch(
        'tender/appointments/response-invitation',
        {
          appointmentId: id,
          response: 'confirmed',
        },
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      if (rest) {
        enqueueSnackbar('Meeting has been accepted', {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
        refetch();
      }
    } catch (err) {
      enqueueSnackbar(
        `${err.statusCode < 500 && err.message ? err.message : 'something went wrong!'}`,
        {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
        }
      );
      refetch();
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (data: any) => {
    // console.log({ data });
    setIsLoading(true);
    try {
      const rest = await axiosInstance.patch(
        'tender/appointments/response-invitation',
        {
          appointmentId: data.id,
          reject_reason: data.reject_reason,
          response: 'declined',
        },
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      if (rest) {
        enqueueSnackbar('Meeting has been rejected', {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
        refetch();
      }
    } catch (err) {
      enqueueSnackbar(
        `${err.statusCode < 500 && err.message ? err.message : 'something went wrong!'}`,
        {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
        }
      );
      refetch();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack direction="column" gap={3}>
      <AppointmentsTable
        headline={translate('appointment_table.requested_headline')}
        isLoading={isLoading}
        headerCell={headerCells}
        data={appointments ?? []}
        isRequest={true}
        onAccept={handleAccept}
        onReject={handleReject}
      />
      {/* <Box
        sx={{
          backgroundColor: '#fff',
          borderRadius: '10px',
          display: 'flex',
          direction: 'row',
          padding: '20px',
        }}
      >
        <Stack direction="column" flex={1}>
          <Typography sx={{ color: 'text.secondary', fontSize: '12px' }}>رقم المشروع:</Typography>
          <Typography sx={{ color: 'text.tertiary', fontSize: '17px' }}>{'asdasd'}</Typography>
        </Stack>
        <Divider orientation="vertical" flexItem sx={{ mr: '40px', ml: '-40px' }} />
        <Stack direction="column" flex={2}>
          <Typography sx={{ color: 'text.secondary', fontSize: '12px' }}>
            توقيت الاجتماع:
          </Typography>
          <Typography sx={{ fontWeight: 500, fontSize: '17px' }}>
            {'27-9-2022     08:00 - 10:00 صباحاً'}
          </Typography>
        </Stack>
        <Stack direction="column" flex={2}>
          <Typography sx={{ color: 'text.secondary', fontSize: '12px' }}>الموظف:</Typography>
          <Typography sx={{ fontWeight: 500, fontSize: '17px' }}>{'مشرف المشاريع'}</Typography>
        </Stack>
        <Stack direction="row" flex={2} gap={2} justifyContent="end">
          <Button
            startIcon={
              <div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_4518_47157)">
                    <path
                      d="M13.9999 2.66667H11.9333C11.7785 1.91428 11.3691 1.23823 10.7741 0.752479C10.179 0.266727 9.43472 0.000969683 8.66659 0L7.33325 0C6.56512 0.000969683 5.8208 0.266727 5.22575 0.752479C4.63071 1.23823 4.22132 1.91428 4.06659 2.66667H1.99992C1.82311 2.66667 1.65354 2.7369 1.52851 2.86193C1.40349 2.98695 1.33325 3.15652 1.33325 3.33333C1.33325 3.51014 1.40349 3.67971 1.52851 3.80474C1.65354 3.92976 1.82311 4 1.99992 4H2.66659V12.6667C2.66764 13.5504 3.01917 14.3976 3.64407 15.0225C4.26896 15.6474 5.11619 15.9989 5.99992 16H9.99992C10.8836 15.9989 11.7309 15.6474 12.3558 15.0225C12.9807 14.3976 13.3322 13.5504 13.3333 12.6667V4H13.9999C14.1767 4 14.3463 3.92976 14.4713 3.80474C14.5963 3.67971 14.6666 3.51014 14.6666 3.33333C14.6666 3.15652 14.5963 2.98695 14.4713 2.86193C14.3463 2.7369 14.1767 2.66667 13.9999 2.66667ZM7.33325 1.33333H8.66659C9.0801 1.33384 9.48334 1.46225 9.82099 1.70096C10.1587 1.93967 10.4142 2.27699 10.5526 2.66667H5.44725C5.58564 2.27699 5.84119 1.93967 6.17884 1.70096C6.5165 1.46225 6.91974 1.33384 7.33325 1.33333ZM11.9999 12.6667C11.9999 13.1971 11.7892 13.7058 11.4141 14.0809C11.0391 14.456 10.5304 14.6667 9.99992 14.6667H5.99992C5.46949 14.6667 4.96078 14.456 4.58571 14.0809C4.21063 13.7058 3.99992 13.1971 3.99992 12.6667V4H11.9999V12.6667Z"
                      fill="white"
                    />
                    <path
                      d="M6.66667 12.0003C6.84348 12.0003 7.01305 11.9301 7.13807 11.8051C7.2631 11.68 7.33333 11.5105 7.33333 11.3337V7.33366C7.33333 7.15685 7.2631 6.98728 7.13807 6.86225C7.01305 6.73723 6.84348 6.66699 6.66667 6.66699C6.48986 6.66699 6.32029 6.73723 6.19526 6.86225C6.07024 6.98728 6 7.15685 6 7.33366V11.3337C6 11.5105 6.07024 11.68 6.19526 11.8051C6.32029 11.9301 6.48986 12.0003 6.66667 12.0003Z"
                      fill="white"
                    />
                    <path
                      d="M9.33341 12.0003C9.51023 12.0003 9.67979 11.9301 9.80482 11.8051C9.92984 11.68 10.0001 11.5105 10.0001 11.3337V7.33366C10.0001 7.15685 9.92984 6.98728 9.80482 6.86225C9.67979 6.73723 9.51023 6.66699 9.33341 6.66699C9.1566 6.66699 8.98703 6.73723 8.86201 6.86225C8.73699 6.98728 8.66675 7.15685 8.66675 7.33366V11.3337C8.66675 11.5105 8.73699 11.68 8.86201 11.8051C8.98703 11.9301 9.1566 12.0003 9.33341 12.0003Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_4518_47157">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            }
            onClick={() => console.log('asdlamsdkl')}
            sx={{
              color: '#fff',
              backgroundColor: '#FF4842',
              ':hover': { backgroundColor: '#FF170F' },
            }}
          >
            حذف
          </Button>
          <Button
            startIcon={<CheckIcon />}
            sx={{
              backgroundColor: 'background.paper',
              color: '#fff',
              borderRadius: '10px',
              px: '15px',
              py: '0px',
              height: '45px',
              fontSize: '15px',
            }}
            variant="outlined"
            onClick={() => console.log('asdlamsdkl')}
          >
            قبول الموعد
          </Button>
        </Stack>
      </Box>
      <Box
        sx={{
          backgroundColor: '#fff',
          borderRadius: '10px',
          display: 'flex',
          direction: 'row',
          padding: '20px',
        }}
      >
        <Stack direction="column" flex={1}>
          <Typography sx={{ color: 'text.secondary', fontSize: '12px' }}>رقم المشروع:</Typography>
          <Typography sx={{ color: 'text.tertiary', fontSize: '17px' }}>{'asdasd'}</Typography>
        </Stack>
        <Divider orientation="vertical" flexItem sx={{ mr: '40px', ml: '-40px' }} />
        <Stack direction="column" flex={2}>
          <Typography sx={{ color: 'text.secondary', fontSize: '12px' }}>
            توقيت الاجتماع:
          </Typography>
          <Typography sx={{ fontWeight: 500, fontSize: '17px' }}>
            {'27-9-2022     08:00 - 10:00 صباحاً'}
          </Typography>
        </Stack>
        <Stack direction="column" flex={2}>
          <Typography sx={{ color: 'text.secondary', fontSize: '12px' }}>الموظف:</Typography>
          <Typography sx={{ fontWeight: 500, fontSize: '17px' }}>{'مشرف المشاريع'}</Typography>
        </Stack>
        <Stack direction="row" flex={2} gap={2} justifyContent="end">
          <Button
            startIcon={
              <div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_4518_47157)">
                    <path
                      d="M13.9999 2.66667H11.9333C11.7785 1.91428 11.3691 1.23823 10.7741 0.752479C10.179 0.266727 9.43472 0.000969683 8.66659 0L7.33325 0C6.56512 0.000969683 5.8208 0.266727 5.22575 0.752479C4.63071 1.23823 4.22132 1.91428 4.06659 2.66667H1.99992C1.82311 2.66667 1.65354 2.7369 1.52851 2.86193C1.40349 2.98695 1.33325 3.15652 1.33325 3.33333C1.33325 3.51014 1.40349 3.67971 1.52851 3.80474C1.65354 3.92976 1.82311 4 1.99992 4H2.66659V12.6667C2.66764 13.5504 3.01917 14.3976 3.64407 15.0225C4.26896 15.6474 5.11619 15.9989 5.99992 16H9.99992C10.8836 15.9989 11.7309 15.6474 12.3558 15.0225C12.9807 14.3976 13.3322 13.5504 13.3333 12.6667V4H13.9999C14.1767 4 14.3463 3.92976 14.4713 3.80474C14.5963 3.67971 14.6666 3.51014 14.6666 3.33333C14.6666 3.15652 14.5963 2.98695 14.4713 2.86193C14.3463 2.7369 14.1767 2.66667 13.9999 2.66667ZM7.33325 1.33333H8.66659C9.0801 1.33384 9.48334 1.46225 9.82099 1.70096C10.1587 1.93967 10.4142 2.27699 10.5526 2.66667H5.44725C5.58564 2.27699 5.84119 1.93967 6.17884 1.70096C6.5165 1.46225 6.91974 1.33384 7.33325 1.33333ZM11.9999 12.6667C11.9999 13.1971 11.7892 13.7058 11.4141 14.0809C11.0391 14.456 10.5304 14.6667 9.99992 14.6667H5.99992C5.46949 14.6667 4.96078 14.456 4.58571 14.0809C4.21063 13.7058 3.99992 13.1971 3.99992 12.6667V4H11.9999V12.6667Z"
                      fill="white"
                    />
                    <path
                      d="M6.66667 12.0003C6.84348 12.0003 7.01305 11.9301 7.13807 11.8051C7.2631 11.68 7.33333 11.5105 7.33333 11.3337V7.33366C7.33333 7.15685 7.2631 6.98728 7.13807 6.86225C7.01305 6.73723 6.84348 6.66699 6.66667 6.66699C6.48986 6.66699 6.32029 6.73723 6.19526 6.86225C6.07024 6.98728 6 7.15685 6 7.33366V11.3337C6 11.5105 6.07024 11.68 6.19526 11.8051C6.32029 11.9301 6.48986 12.0003 6.66667 12.0003Z"
                      fill="white"
                    />
                    <path
                      d="M9.33341 12.0003C9.51023 12.0003 9.67979 11.9301 9.80482 11.8051C9.92984 11.68 10.0001 11.5105 10.0001 11.3337V7.33366C10.0001 7.15685 9.92984 6.98728 9.80482 6.86225C9.67979 6.73723 9.51023 6.66699 9.33341 6.66699C9.1566 6.66699 8.98703 6.73723 8.86201 6.86225C8.73699 6.98728 8.66675 7.15685 8.66675 7.33366V11.3337C8.66675 11.5105 8.73699 11.68 8.86201 11.8051C8.98703 11.9301 9.1566 12.0003 9.33341 12.0003Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_4518_47157">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            }
            onClick={() => console.log('asdlamsdkl')}
            sx={{
              color: '#fff',
              backgroundColor: '#FF4842',
              ':hover': { backgroundColor: '#FF170F' },
            }}
          >
            حذف
          </Button>
          <Button
            startIcon={<CheckIcon />}
            sx={{
              backgroundColor: 'background.paper',
              color: '#fff',
              borderRadius: '10px',
              px: '15px',
              py: '0px',
              height: '45px',
              fontSize: '15px',
            }}
            variant="outlined"
            onClick={() => console.log('asdlamsdkl')}
          >
            قبول الموعد
          </Button>
        </Stack>
      </Box>
      <Box
        sx={{
          backgroundColor: '#fff',
          borderRadius: '10px',
          display: 'flex',
          direction: 'row',
          padding: '20px',
        }}
      >
        <Stack direction="column" flex={1}>
          <Typography sx={{ color: 'text.secondary', fontSize: '12px' }}>رقم المشروع:</Typography>
          <Typography sx={{ color: 'text.tertiary', fontSize: '17px' }}>{'asdasd'}</Typography>
        </Stack>
        <Divider orientation="vertical" flexItem sx={{ mr: '40px', ml: '-40px' }} />
        <Stack direction="column" flex={2}>
          <Typography sx={{ color: 'text.secondary', fontSize: '12px' }}>
            توقيت الاجتماع:
          </Typography>
          <Typography sx={{ fontWeight: 500, fontSize: '17px' }}>
            {'27-9-2022     08:00 - 10:00 صباحاً'}
          </Typography>
        </Stack>
        <Stack direction="column" flex={2}>
          <Typography sx={{ color: 'text.secondary', fontSize: '12px' }}>الموظف:</Typography>
          <Typography sx={{ fontWeight: 500, fontSize: '17px' }}>{'مشرف المشاريع'}</Typography>
        </Stack>
        <Stack direction="row" flex={2} gap={2} justifyContent="end">
          <Button
            startIcon={
              <div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_4518_47157)">
                    <path
                      d="M13.9999 2.66667H11.9333C11.7785 1.91428 11.3691 1.23823 10.7741 0.752479C10.179 0.266727 9.43472 0.000969683 8.66659 0L7.33325 0C6.56512 0.000969683 5.8208 0.266727 5.22575 0.752479C4.63071 1.23823 4.22132 1.91428 4.06659 2.66667H1.99992C1.82311 2.66667 1.65354 2.7369 1.52851 2.86193C1.40349 2.98695 1.33325 3.15652 1.33325 3.33333C1.33325 3.51014 1.40349 3.67971 1.52851 3.80474C1.65354 3.92976 1.82311 4 1.99992 4H2.66659V12.6667C2.66764 13.5504 3.01917 14.3976 3.64407 15.0225C4.26896 15.6474 5.11619 15.9989 5.99992 16H9.99992C10.8836 15.9989 11.7309 15.6474 12.3558 15.0225C12.9807 14.3976 13.3322 13.5504 13.3333 12.6667V4H13.9999C14.1767 4 14.3463 3.92976 14.4713 3.80474C14.5963 3.67971 14.6666 3.51014 14.6666 3.33333C14.6666 3.15652 14.5963 2.98695 14.4713 2.86193C14.3463 2.7369 14.1767 2.66667 13.9999 2.66667ZM7.33325 1.33333H8.66659C9.0801 1.33384 9.48334 1.46225 9.82099 1.70096C10.1587 1.93967 10.4142 2.27699 10.5526 2.66667H5.44725C5.58564 2.27699 5.84119 1.93967 6.17884 1.70096C6.5165 1.46225 6.91974 1.33384 7.33325 1.33333ZM11.9999 12.6667C11.9999 13.1971 11.7892 13.7058 11.4141 14.0809C11.0391 14.456 10.5304 14.6667 9.99992 14.6667H5.99992C5.46949 14.6667 4.96078 14.456 4.58571 14.0809C4.21063 13.7058 3.99992 13.1971 3.99992 12.6667V4H11.9999V12.6667Z"
                      fill="white"
                    />
                    <path
                      d="M6.66667 12.0003C6.84348 12.0003 7.01305 11.9301 7.13807 11.8051C7.2631 11.68 7.33333 11.5105 7.33333 11.3337V7.33366C7.33333 7.15685 7.2631 6.98728 7.13807 6.86225C7.01305 6.73723 6.84348 6.66699 6.66667 6.66699C6.48986 6.66699 6.32029 6.73723 6.19526 6.86225C6.07024 6.98728 6 7.15685 6 7.33366V11.3337C6 11.5105 6.07024 11.68 6.19526 11.8051C6.32029 11.9301 6.48986 12.0003 6.66667 12.0003Z"
                      fill="white"
                    />
                    <path
                      d="M9.33341 12.0003C9.51023 12.0003 9.67979 11.9301 9.80482 11.8051C9.92984 11.68 10.0001 11.5105 10.0001 11.3337V7.33366C10.0001 7.15685 9.92984 6.98728 9.80482 6.86225C9.67979 6.73723 9.51023 6.66699 9.33341 6.66699C9.1566 6.66699 8.98703 6.73723 8.86201 6.86225C8.73699 6.98728 8.66675 7.15685 8.66675 7.33366V11.3337C8.66675 11.5105 8.73699 11.68 8.86201 11.8051C8.98703 11.9301 9.1566 12.0003 9.33341 12.0003Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_4518_47157">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            }
            onClick={() => console.log('asdlamsdkl')}
            sx={{
              color: '#fff',
              backgroundColor: '#FF4842',
              ':hover': { backgroundColor: '#FF170F' },
            }}
          >
            حذف
          </Button>
          <Button
            startIcon={<CheckIcon />}
            sx={{
              backgroundColor: 'background.paper',
              color: '#fff',
              borderRadius: '10px',
              px: '15px',
              py: '0px',
              height: '45px',
              fontSize: '15px',
            }}
            variant="outlined"
            onClick={() => console.log('asdlamsdkl')}
          >
            قبول الموعد
          </Button>
        </Stack>
      </Box>
      <Box
        sx={{
          backgroundColor: '#fff',
          borderRadius: '10px',
          display: 'flex',
          direction: 'row',
          padding: '20px',
        }}
      >
        <Stack direction="column" flex={1}>
          <Typography sx={{ color: 'text.secondary', fontSize: '12px' }}>رقم المشروع:</Typography>
          <Typography sx={{ color: 'text.tertiary', fontSize: '17px' }}>{'asdasd'}</Typography>
        </Stack>
        <Divider orientation="vertical" flexItem sx={{ mr: '40px', ml: '-40px' }} />
        <Stack direction="column" flex={2}>
          <Typography sx={{ color: 'text.secondary', fontSize: '12px' }}>
            توقيت الاجتماع:
          </Typography>
          <Typography sx={{ fontWeight: 500, fontSize: '17px' }}>
            {'27-9-2022     08:00 - 10:00 صباحاً'}
          </Typography>
        </Stack>
        <Stack direction="column" flex={2}>
          <Typography sx={{ color: 'text.secondary', fontSize: '12px' }}>الموظف:</Typography>
          <Typography sx={{ fontWeight: 500, fontSize: '17px' }}>{'مشرف المشاريع'}</Typography>
        </Stack>
        <Stack direction="row" flex={2} gap={2} justifyContent="end">
          <Button
            startIcon={
              <div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_4518_47157)">
                    <path
                      d="M13.9999 2.66667H11.9333C11.7785 1.91428 11.3691 1.23823 10.7741 0.752479C10.179 0.266727 9.43472 0.000969683 8.66659 0L7.33325 0C6.56512 0.000969683 5.8208 0.266727 5.22575 0.752479C4.63071 1.23823 4.22132 1.91428 4.06659 2.66667H1.99992C1.82311 2.66667 1.65354 2.7369 1.52851 2.86193C1.40349 2.98695 1.33325 3.15652 1.33325 3.33333C1.33325 3.51014 1.40349 3.67971 1.52851 3.80474C1.65354 3.92976 1.82311 4 1.99992 4H2.66659V12.6667C2.66764 13.5504 3.01917 14.3976 3.64407 15.0225C4.26896 15.6474 5.11619 15.9989 5.99992 16H9.99992C10.8836 15.9989 11.7309 15.6474 12.3558 15.0225C12.9807 14.3976 13.3322 13.5504 13.3333 12.6667V4H13.9999C14.1767 4 14.3463 3.92976 14.4713 3.80474C14.5963 3.67971 14.6666 3.51014 14.6666 3.33333C14.6666 3.15652 14.5963 2.98695 14.4713 2.86193C14.3463 2.7369 14.1767 2.66667 13.9999 2.66667ZM7.33325 1.33333H8.66659C9.0801 1.33384 9.48334 1.46225 9.82099 1.70096C10.1587 1.93967 10.4142 2.27699 10.5526 2.66667H5.44725C5.58564 2.27699 5.84119 1.93967 6.17884 1.70096C6.5165 1.46225 6.91974 1.33384 7.33325 1.33333ZM11.9999 12.6667C11.9999 13.1971 11.7892 13.7058 11.4141 14.0809C11.0391 14.456 10.5304 14.6667 9.99992 14.6667H5.99992C5.46949 14.6667 4.96078 14.456 4.58571 14.0809C4.21063 13.7058 3.99992 13.1971 3.99992 12.6667V4H11.9999V12.6667Z"
                      fill="white"
                    />
                    <path
                      d="M6.66667 12.0003C6.84348 12.0003 7.01305 11.9301 7.13807 11.8051C7.2631 11.68 7.33333 11.5105 7.33333 11.3337V7.33366C7.33333 7.15685 7.2631 6.98728 7.13807 6.86225C7.01305 6.73723 6.84348 6.66699 6.66667 6.66699C6.48986 6.66699 6.32029 6.73723 6.19526 6.86225C6.07024 6.98728 6 7.15685 6 7.33366V11.3337C6 11.5105 6.07024 11.68 6.19526 11.8051C6.32029 11.9301 6.48986 12.0003 6.66667 12.0003Z"
                      fill="white"
                    />
                    <path
                      d="M9.33341 12.0003C9.51023 12.0003 9.67979 11.9301 9.80482 11.8051C9.92984 11.68 10.0001 11.5105 10.0001 11.3337V7.33366C10.0001 7.15685 9.92984 6.98728 9.80482 6.86225C9.67979 6.73723 9.51023 6.66699 9.33341 6.66699C9.1566 6.66699 8.98703 6.73723 8.86201 6.86225C8.73699 6.98728 8.66675 7.15685 8.66675 7.33366V11.3337C8.66675 11.5105 8.73699 11.68 8.86201 11.8051C8.98703 11.9301 9.1566 12.0003 9.33341 12.0003Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_4518_47157">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            }
            onClick={() => console.log('asdlamsdkl')}
            sx={{
              color: '#fff',
              backgroundColor: '#FF4842',
              ':hover': { backgroundColor: '#FF170F' },
            }}
          >
            حذف
          </Button>
          <Button
            startIcon={<CheckIcon />}
            sx={{
              backgroundColor: 'background.paper',
              color: '#fff',
              borderRadius: '10px',
              px: '15px',
              py: '0px',
              height: '45px',
              fontSize: '15px',
            }}
            variant="outlined"
            onClick={() => console.log('asdlamsdkl')}
          >
            قبول الموعد
          </Button>
        </Stack>
      </Box> */}
    </Stack>
  );
}

export default AppointmentsRequests;

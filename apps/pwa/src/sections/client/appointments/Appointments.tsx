import {
  Tabs,
  Tab,
  Button,
  Grid,
  Stack,
  Typography,
  Box,
  styled,
  Skeleton,
  CircularProgress,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import AppointmentsTap from './appointments-tabel/AppointmentsTap';
import AppointmentsRequests from './appointments-requests/AppointmentsRequests';
import { useNavigate } from 'react-router';
import useAuth from 'hooks/useAuth';
import { query } from 'firebase/firestore';
import { getScheduleByUser } from 'queries/client/getScheduleByUser';
import { useQuery } from 'urql';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import axiosInstance from '../../../utils/axios';
import { IArrayAppointments } from '../../../@types/appointment';
interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

const ContentStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 24,
}));

function Appointments() {
  const { translate } = useLocales();
  const { user, activeRole } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  // const id = user?.id;
  // const [result, mutate] = useQuery({ query: getScheduleByUser, variables: { id } });
  // const { data, fetching, error } = result;
  const theme = useTheme();
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [appointments, setAppointments] = useState<IArrayAppointments[]>();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const fetchingSchedule = useCallback(async () => {
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
  }, [activeRole, enqueueSnackbar]);

  useEffect(() => {
    fetchingSchedule();
  }, [fetchingSchedule, fetching]);

  // if (error) return <>Ooops, some errors have been occured</>;
  // if (fetching) return <>...Loading</>;
  // console.log(data);
  return (
    <Grid container spacing={5}>
      <Grid item md={12} xs={12}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h4">{translate('appointments_with_organization')}</Typography>
          <Button
            sx={{ color: '#fff', backgroundColor: 'background.paper', py: '15px', px: '25px' }}
            onClick={() => {
              // console.log('asdlkasmdlk');
              navigate('/client/dashboard/appointments/adjust-your-time');
            }}
          >
            {translate('adding_the_available_time')}
          </Button>
          {/* {value === 0 && (
            
          )}
          {value === 1 && data && data.schedule && data.schedule?.length !== 0 && (
            <Button
              sx={{
                color: '#fff',
                backgroundColor: '#0169DE',
                py: '15px',
                px: '25px',
                ':hover': { backgroundColor: '#1482FE' },
              }}
              onClick={() => {
                navigate('/client/dashboard/appointments/adjust-your-time', {
                  state: data.schedule,
                });
              }}
            >
              {translate('edeting_the_available_time')}
            </Button>
          )} */}
        </Stack>
      </Grid>
      <Grid item md={12} xs={12}>
        <Stack direction="row" justifyContent="center">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="inherit"
            sx={{
              bgcolor: '#93A3B029',
              borderRadius: 2,
              // flex: 0.3,
            }}
          >
            <Tab
              label={
                <Grid container>
                  <Grid item md={10} xs={12}>
                    <Typography>{translate('appointments')} </Typography>
                  </Grid>
                  {/* <Grid item md={2} xs={12}>
                    <Box
                      sx={{
                        ...(value === 0 && {
                          backgroundColor: 'background.default',
                          color: 'text.tertiary',
                        }),
                        borderRadius: '10px',
                      }}
                    >
                      3
                    </Box>
                  </Grid> */}
                </Grid>
              }
              sx={{
                width: '50%',
                borderRadius: '10px',
                px: 3,
                '&.MuiTab-root:not(:last-of-type)': {
                  marginRight: 0,
                },
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                },
              }}
            />
            <Tab
              label={
                <Grid container>
                  <Grid item md={10} xs={12}>
                    <Typography>
                      {translate('requests_for_meeting') +
                        ` (${
                          appointments?.filter(
                            (item: IArrayAppointments) => item.status === 'tentative'
                          ).length ?? 0
                        })`}
                    </Typography>
                  </Grid>
                  {/* <Grid item md={2} xs={12}>
                    <Box
                      sx={{
                        ...(value === 1 && {
                          backgroundColor: 'background.default',
                          color: 'text.tertiary',
                        }),
                        borderRadius: 1,
                      }}
                    >
                      4
                    </Box>
                  </Grid> */}
                </Grid>
              }
              sx={{
                width: '50%',
                borderRadius: '10px',
                px: 3,
                '&.MuiTab-root:not(:last-of-type)': {
                  marginRight: 0,
                },
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                },
              }}
            />
          </Tabs>
        </Stack>
        <Grid item md={12} xs={12}>
          <TabPanel value={value} index={0} dir={theme.direction}>
            <ContentStyle sx={{ mt: 3 }}>
              <Typography variant="h4">
                {!isLoading ? (
                  <AppointmentsTap defaultValues={appointments ?? []} />
                ) : (
                  <Skeleton variant="rounded" height={160} />
                  // <Stack justifyContent={'center'} alignItems={'center'}>
                  //   <CircularProgress />
                  // </Stack>
                )}
              </Typography>
            </ContentStyle>
          </TabPanel>
        </Grid>
        <Grid item md={12} xs={12}>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <ContentStyle sx={{ mt: 3 }}>
              <Typography variant="h4">
                {!isLoading ? (
                  <AppointmentsRequests
                    defaultValues={appointments ?? []}
                    refetch={() => {
                      setFetching(!fetching);
                    }}
                  />
                ) : (
                  // <Stack justifyContent={'center'} alignItems={'center'}>
                  //   <CircularProgress />
                  // </Stack>
                  <Skeleton variant="rounded" height={160} />
                )}
              </Typography>
            </ContentStyle>
          </TabPanel>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Appointments;

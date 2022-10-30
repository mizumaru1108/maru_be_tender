import { Tabs, Tab, Button, Grid, Stack, Typography, Box, styled } from '@mui/material';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import AppointmentsTap from './appointments-tabel/AppointmentsTap';
import AppointmentsRequests from './appointments-requests/AppointmentsRequests';
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
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Grid container spacing={5}>
      <Grid item md={12} xs={12}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h4">المواعيد مع المؤسسة</Typography>
          {value === 0 && (
            <Button
              sx={{ color: '#fff', backgroundColor: 'background.paper', py: '15px', px: '25px' }}
            >
              اضافة مواعيد تواجدك
            </Button>
          )}
          {value === 1 && (
            <Button
              sx={{
                color: '#fff',
                backgroundColor: '#0169DE',
                py: '15px',
                px: '25px',
                ':hover': { backgroundColor: '#1482FE' },
              }}
            >
              تعديل مواعيد تواجدك
            </Button>
          )}
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
              flex: 0.3,
            }}
          >
            <Tab
              label={
                <Grid container>
                  <Grid item md={10} xs={12}>
                    <Typography>الاجتماعات</Typography>
                  </Grid>
                  <Grid item md={2} xs={12}>
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
                  </Grid>
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
                    <Typography>طلبات للاجتماع</Typography>
                  </Grid>
                  <Grid item md={2} xs={12}>
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
                  </Grid>
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
                <AppointmentsTap />
              </Typography>
            </ContentStyle>
          </TabPanel>
        </Grid>
        <Grid item md={12} xs={12}>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <ContentStyle sx={{ mt: 3 }}>
              <Typography variant="h4">
                <AppointmentsRequests />
              </Typography>
            </ContentStyle>
          </TabPanel>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Appointments;

import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LoadingButton } from '@mui/lab';
import {
  Tabs,
  Tab,
  CircularProgress,
  Box,
  styled,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import useLocales from 'hooks/useLocales';
// sections
import AverageTransaction from './AverageTransactions';
import AchievementEffectiveness from './AchievementEffectiveness';
import MosqueTrack from './MosqueTrack';
import ConcessionalTrack from './ConcessionalTrack';
import InitiativeTrack from './InitiativeTrack';
import ComplexityTrack from './ComplexityTrack';
import PartnersInformation from './PartnersInformation';
import ProjectsInformation from './ProjectsInformation';
// utils
import axiosInstance from 'utils/axios';
import useAuth from 'hooks/useAuth';
// types
import { TabPanelProps, IPropsHeaderTabs, IPolarBeneficiaries } from './types';

// -------------------------------------------------------------------------------
const ContentStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 24,
}));

// -------------------------------------------------------------------------------

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

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function HeaderTabs() {
  const theme = useTheme();
  const { translate } = useLocales();
  const [value, setValue] = useState(0);
  const { activeRole } = useAuth();

  //
  const [valueStartDate, setValueStartDate] = useState<Dayjs | null>(null);
  const [valueEndDate, setValueEndDate] = useState<Dayjs | null>(null);

  const handleStartDate = (newValue: Dayjs | null) => {
    setValueStartDate(newValue);
  };

  const handleEndDate = (newValue: Dayjs | null) => {
    setValueEndDate(newValue);
  };

  // Report Data
  const [dataReport, setDataReport] = useState<IPropsHeaderTabs[] | null>(null);
  const [dataBeneficiaries, setDataBeneficiaries] = useState<IPolarBeneficiaries | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  const handleSubmitDate = async () => {
    const startDate = valueStartDate?.format('YYYY-MM-DD');
    const endDate = valueEndDate?.format('YYYY-MM-DD');

    try {
      setIsSubmitting(true);

      await axiosInstance
        .get(`/statistics/orders?from=${startDate}&to=${endDate}`, {
          headers: { 'x-hasura-role': activeRole! },
        })
        .then((res) => {
          if (res.status === 200) {
            const resData = res.data.data;

            const data = Object.entries(resData).map(([key, value]) => {
              const valueChildren = Object.entries(value as any).map(([k, v]) => ({
                key: k,
                data: [v],
              }));

              return {
                key,
                data: valueChildren,
              };
            });

            setDataReport(data);
          }
        });

      await axiosInstance
        .get(`/statistics/benificiaries-report?start_date=${startDate}&end_date=${endDate}`, {
          headers: { 'x-hasura-role': activeRole! },
        })
        .then((res) => {
          if (res.status === 200) {
            const resBeneficiaries = res.data.data as IPolarBeneficiaries;

            setDataBeneficiaries(resBeneficiaries);
          }
        });
      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!valueStartDate || !valueEndDate) {
      const initStartDate: Dayjs = dayjs();
      const initEndDate: Dayjs = dayjs().startOf('date');

      setValueStartDate(initStartDate);
      setValueEndDate(initEndDate);
    } else {
      handleSubmitDate();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueStartDate, valueEndDate]);

  return (
    <>
      <Grid container spacing={3} alignItems="center" justifyContent="space-between">
        <Grid item xs={2}>
          <Typography variant="h4">
            {translate('section_portal_reports.heading.reports')}
          </Typography>
        </Grid>
        <Grid item xs={10}>
          <Grid container spacing={2} direction="row" alignItems="center" justifyContent="flex-end">
            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label={translate('section_portal_reports.form.date_picker.label.start_date')}
                  inputFormat="MM/DD/YYYY"
                  value={valueStartDate}
                  onChange={handleStartDate}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      sx={{
                        '& > .MuiInputBase-root > .MuiInputAdornment-root > .MuiButtonBase-root': {
                          color: '#212B36',
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label={translate('section_portal_reports.form.date_picker.label.end_date')}
                  inputFormat="MM/DD/YYYY"
                  value={valueEndDate}
                  onChange={handleEndDate}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      sx={{
                        '& > .MuiInputBase-root > .MuiInputAdornment-root > .MuiButtonBase-root': {
                          color: '#212B36',
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item>
              <LoadingButton
                disabled={!valueStartDate || !valueEndDate}
                loading={isSubmitting}
                onClick={handleSubmitDate}
                variant="contained"
              >
                {translate('section_portal_reports.button.create_special_report')}
              </LoadingButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Stack spacing={2} direction="column">
        <Box sx={{ width: '100%' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="inherit"
            sx={{
              bgcolor: '#93A3B029',
              borderRadius: 1,
            }}
          >
            <Tab
              label={translate('section_portal_reports.tabs.label_1')}
              {...a11yProps(0)}
              sx={{
                borderRadius: 0,
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
              label={translate('section_portal_reports.tabs.label_2')}
              {...a11yProps(1)}
              sx={{
                borderRadius: 0,
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
              label={translate('section_portal_reports.tabs.label_3')}
              {...a11yProps(2)}
              sx={{
                borderRadius: 0,
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
              label={translate('section_portal_reports.tabs.label_4')}
              {...a11yProps(3)}
              sx={{
                borderRadius: 0,
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
          {isSubmitting ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '50vh',
              }}
            >
              <CircularProgress size={50} />
            </Box>
          ) : (
            <>
              <TabPanel value={value} index={0} dir={theme.direction}>
                <ContentStyle sx={{ mt: 3 }}>
                  <ProjectsInformation
                    dataList={dataReport!}
                    dataBeneficiaries={dataBeneficiaries}
                    submitting={isSubmitting}
                  />
                </ContentStyle>
              </TabPanel>
              {/* <TabPanel value={value} index={1} dir={theme.direction}>
                <ContentStyle sx={{ mt: 3 }}>
                  <PartnersInformation />
                </ContentStyle>
              </TabPanel>
              <TabPanel value={value} index={2} dir={theme.direction}>
                <ContentStyle sx={{ mt: 3 }}>
                  <MosqueTrack />
                  <ConcessionalTrack />
                  <InitiativeTrack />
                  <ComplexityTrack />
                </ContentStyle>
              </TabPanel>
              <TabPanel value={value} index={3} dir={theme.direction}>
                <ContentStyle sx={{ mt: 3 }}>
                  <AverageTransaction />
                  <AchievementEffectiveness />
                </ContentStyle>
              </TabPanel> */}
            </>
          )}
        </Box>
      </Stack>
    </>
  );
}

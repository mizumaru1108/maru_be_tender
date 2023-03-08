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
import CardBudgetInfoTracks from './CardBudgetInfoTracks';
import PartnersInformation from './PartnersInformation';
import ProjectsInformation from './ProjectsInformation';
import AchievementEffectiveness from './AchievementEffectiveness';
// utils
import axiosInstance from 'utils/axios';
import useAuth from 'hooks/useAuth';
// types
import {
  TabPanelProps,
  IPropsHeaderTabs,
  IPolarBeneficiaries,
  IPartnerDatas,
  IPropsBudgetInfo,
  IPropsAvgTransactions,
  IPropsAvgEmployeeEfectiveness,
} from './types';
import EmptyChart from './EmptyChart';

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
  const [valueTab, setValueTab] = useState(0);
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
  const [projectsData, setProjectsData] = useState<IPropsHeaderTabs[] | null>(null);
  const [beneficiariesData, setBeneficiariesData] = useState<IPolarBeneficiaries | null>(null);
  const [partnersData, setPartnersData] = useState<IPartnerDatas | null>(null);
  const [budgetInfoData, setBudgetInfoData] = useState<IPropsBudgetInfo[] | []>([]);
  const [avgTransactionCard, setAvgTransactionCard] = useState<IPropsAvgTransactions[] | []>([]);
  const [avgEmployeeEffective, setAvgEmployeeEffective] = useState<
    IPropsAvgEmployeeEfectiveness[] | []
  >([]);

  // const [defaultPage, setDefaultPage] = useState<number>(1);
  // const [defaultLimit, setDefaultLimit] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValueTab(newValue);

    handleSubmitDate(valueStartDate!, valueEndDate!, newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValueTab(index);
  };

  const handleResOrders = async (startDate: string, endDate: string) => {
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

            setProjectsData(data);
          }
        });

      await axiosInstance
        .get(`/statistics/benificiaries-report?start_date=${startDate}&end_date=${endDate}`, {
          headers: { 'x-hasura-role': activeRole! },
        })
        .then((res) => {
          if (res.status === 200) {
            const resBeneficiaries = res.data.data as IPolarBeneficiaries;

            setBeneficiariesData(resBeneficiaries);
          }
        });
      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const handleResPartners = async (startDate: string, endDate: string) => {
    try {
      setIsSubmitting(true);

      await axiosInstance
        .get(`/statistics/partners-section?start_date=${startDate}&end_date=${endDate}`, {
          headers: { 'x-hasura-role': activeRole! },
        })
        .then((res) => {
          if (res.status === 200) {
            setPartnersData(res.data.data as IPartnerDatas);
          }
        });

      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const handleResBudgetInfo = async (startDate: string, endDate: string) => {
    try {
      setIsSubmitting(true);

      await axiosInstance
        .get(`/statistics/budget-info?start_date=${startDate}&end_date=${endDate}`, {
          headers: { 'x-hasura-role': activeRole! },
        })
        .then((res) => {
          if (res.status === 200) {
            setBudgetInfoData(res.data.data as IPropsBudgetInfo[]);
          }
        });

      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const handleResAverageTransaction = async (startDate: string, endDate: string) => {
    try {
      setIsSubmitting(true);

      await axiosInstance
        .get(
          `/statistics/average-track-transaction-time?start_date=${startDate}&end_date=${endDate}`,
          {
            headers: { 'x-hasura-role': activeRole! },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            setAvgTransactionCard(res.data.data);
          }
        });

      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const handleResAverageEmployee = async (startDate: string, endDate: string) => {
    try {
      setIsSubmitting(true);

      await axiosInstance
        .get(
          `/statistics/average-employee-transaction-time?start_date=${startDate}&end_date=${endDate}&limit=${100}`,
          {
            headers: { 'x-hasura-role': activeRole! },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            setAvgEmployeeEffective(res.data.data);
          }
        });

      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const handleSubmitDate = async (start_date: Dayjs, end_date: Dayjs, value_tab: number) => {
    const startDate = start_date.toISOString();
    const endDate = end_date.toISOString();

    switch (value_tab) {
      case 0:
        handleResOrders(startDate, endDate);
        break;
      case 1:
        handleResPartners(startDate, endDate);
        break;
      case 2:
        handleResBudgetInfo(startDate, endDate);
        break;
      case 3:
        handleResAverageTransaction(startDate, endDate);
        handleResAverageEmployee(startDate, endDate);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (!valueStartDate || !valueEndDate) {
      const initStartDate: Dayjs = dayjs().subtract(1, 'days').startOf('days');
      const initEndDate: Dayjs = dayjs().subtract(1, 'days').endOf('days');

      setValueStartDate(initStartDate);
      setValueEndDate(initEndDate);
    } else {
      handleSubmitDate(valueStartDate, valueEndDate, valueTab);
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
                onClick={() => handleSubmitDate(valueStartDate!, valueEndDate!, valueTab)}
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
            value={valueTab}
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
              <TabPanel value={valueTab} index={0} dir={theme.direction}>
                <ContentStyle sx={{ mt: 3 }}>
                  <ProjectsInformation
                    dataList={projectsData!}
                    dataBeneficiaries={beneficiariesData!}
                    submitting={isSubmitting}
                  />
                </ContentStyle>
              </TabPanel>
              <TabPanel value={valueTab} index={1} dir={theme.direction}>
                <ContentStyle sx={{ mt: 3 }}>
                  <PartnersInformation partner_data={partnersData} submitting={isSubmitting} />
                </ContentStyle>
              </TabPanel>
              <TabPanel value={valueTab} index={2} dir={theme.direction}>
                <ContentStyle sx={{ mt: 3 }}>
                  {budgetInfoData.length ? (
                    budgetInfoData.map((el, i) => (
                      <CardBudgetInfoTracks
                        key={i}
                        project_track={el.project_track}
                        spended_budget={el.spended_budget}
                        spended_budget_last_week={el.spended_budget_last_week}
                        reserved_budget={el.reserved_budget}
                        reserved_budget_last_week={el.reserved_budget_last_week}
                        total_budget={el.total_budget}
                      />
                    ))
                  ) : (
                    <EmptyChart type="bar" title={translate('commons.track_type.all_tracks')} />
                  )}
                </ContentStyle>
              </TabPanel>
              <TabPanel value={valueTab} index={3} dir={theme.direction}>
                <ContentStyle sx={{ mt: 3 }}>
                  <AverageTransaction data={avgTransactionCard} loading={isSubmitting} />
                  <AchievementEffectiveness data={avgEmployeeEffective} loading={isSubmitting} />
                </ContentStyle>
              </TabPanel>
            </>
          )}
        </Box>
      </Stack>
    </>
  );
}

import {
  Grid,
  Stack,
  Tab,
  Tabs,
  Container,
  Button,
  Checkbox,
  Typography,
  Box,
} from '@mui/material';

import React from 'react';
import { useTheme } from '@mui/material/styles';
import EmptyFollowUps from './EmptyFollowUps';
import { useParams } from 'react-router';
import FollowUpsFile from './FollowUpsFile';
import FollowUpsText from './FollowUpsText';
import useLocales from 'hooks/useLocales';
import { getProposal, setEmployeeOnly } from 'redux/slices/proposal';
import { useDispatch, useSelector } from 'redux/store';
import FollowUpsAction from './FollowUpsAction';
import useAuth from 'hooks/useAuth';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Grid
      container
      spacing={2}
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
      sx={{ marginTop: '5px' }}
    >
      {value === index && <>{children}</>}
    </Grid>
  );
}

function EmployeeFollowUpsPage() {
  const { id, actionType } = useParams();
  const { activeRole } = useAuth();
  const dispatch = useDispatch();
  const { proposal, isLoading, error } = useSelector((state) => state.proposal);
  const { translate } = useLocales();
  const datesEmployee = new Set();
  const datesClient = new Set();

  const theme = useTheme();

  const [switchState, setSwitchState] = React.useState(0);

  const role = activeRole!;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSwitchState(newValue);
  };

  React.useEffect(() => {
    if (switchState === 0) {
      dispatch(setEmployeeOnly(true));
    } else {
      dispatch(setEmployeeOnly(false));
    }
    dispatch(getProposal(id as string, role as string));
  }, [dispatch, id, switchState, role]);

  if (isLoading) return <>... Loading</>;

  if (error) return <>{error}</>;

  function formattedDate(date: Date) {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  const followUpsEmployee = proposal.follow_ups.filter((items) => {
    for (const item of items.user.roles) {
      return item.role !== 'CLIENT' && items.employee_only === true;
    }
    return false;
  });

  const followUpsPartner = proposal.follow_ups.filter((items) => {
    for (const item of items.user.roles) {
      return item.role && items.employee_only === false;
    }
    return false;
  });

  return (
    <Grid container spacing={3}>
      <Grid item md={12} xs={12} sx={{ alignSelf: 'center' }}>
        <Stack justifyContent={'center'} direction="row">
          <Tabs
            value={switchState}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="inherit"
            sx={{
              bgcolor: '#93A3B029',
              borderRadius: 1,
            }}
          >
            <Tab
              label={translate('content.client.main_page.employee_followup')}
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
              label={translate('content.client.main_page.partner_followup')}
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
          </Tabs>
        </Stack>
      </Grid>

      <TabPanel value={switchState} index={0} dir={theme.direction}>
        <Container sx={{ py: 2, width: '100%', mt: 1 }}>
          <Grid container spacing={3}>
            {proposal.follow_ups.length === 0 || followUpsEmployee.length === 0 ? (
              <Grid item md={12} xs={12}>
                <EmptyFollowUps />
              </Grid>
            ) : (
              followUpsEmployee
                .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                .map((item, index) => (
                  <Grid item md={12} xs={12} key={index}>
                    {item.employee_only === true && (
                      <React.Fragment>
                        {!datesEmployee.has(formattedDate(new Date(item.created_at))) && (
                          <React.Fragment>
                            <Typography sx={{ textAlign: 'center', color: '#A4A4A4', mb: 2 }}>
                              {formattedDate(new Date(item.created_at))}
                            </Typography>
                            <Typography visibility="hidden">
                              <>{datesEmployee.add(formattedDate(new Date(item.created_at)))}</>
                            </Typography>
                          </React.Fragment>
                        )}
                        {item.attachments && <FollowUpsFile {...item} />}
                        {item.content && <FollowUpsText {...item} />}
                      </React.Fragment>
                    )}
                  </Grid>
                ))
            )}
          </Grid>
        </Container>
      </TabPanel>
      <TabPanel value={switchState} index={1} dir={theme.direction}>
        <Container sx={{ py: 2, width: '100%' }}>
          <Grid container spacing={3}>
            {proposal.follow_ups.length === 0 || followUpsPartner.length === 0 ? (
              <Grid item md={12} xs={12}>
                <EmptyFollowUps />
              </Grid>
            ) : (
              followUpsPartner
                .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
                .map((item, index) => (
                  <Grid item md={12} xs={12} key={index}>
                    {item.employee_only === false && (
                      <React.Fragment>
                        {!datesClient.has(formattedDate(new Date(item.created_at))) && (
                          <React.Fragment>
                            <Typography sx={{ textAlign: 'center', color: '#A4A4A4', mb: 2 }}>
                              {formattedDate(new Date(item.created_at))}
                            </Typography>
                            <Typography visibility="hidden">
                              <>{datesClient.add(formattedDate(new Date(item.created_at)))}</>
                            </Typography>
                          </React.Fragment>
                        )}
                        {item.attachments && <FollowUpsFile {...item} />}
                        {item.content && <FollowUpsText {...item} />}
                      </React.Fragment>
                    )}
                  </Grid>
                ))
            )}
          </Grid>
        </Container>
      </TabPanel>
      {/* {actionType && actionType !== 'show-project' && (
        <Box sx={{ m: 'auto', pt: 7 }}>
          <FollowUpsAction />
        </Box>
      )} */}
    </Grid>
  );
}
export default EmployeeFollowUpsPage;

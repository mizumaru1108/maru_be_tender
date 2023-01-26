/* eslint-disable array-callback-return */

import { Grid, Stack, Tab, Tabs, Container } from '@mui/material';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import EmptyFollowUps from './EmptyFollowUps';
import FollowUpsFile from './FollowUpsFile';
import FollowUpsText from './FollowUpsText';
import { useSelector } from 'redux/store';
import useLocales from 'hooks/useLocales';

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
      sx={{ marginTop: '10px' }}
    >
      {value === index && <>{children}</>}
    </Grid>
  );
}

function EmployeeFollowUpsPage() {
  const { proposal } = useSelector((state) => state.proposal);
  const { translate } = useLocales();

  const theme = useTheme();

  const [switchState, setSwitchState] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSwitchState(newValue);
  };

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
        <Container sx={{ py: 2, width: '100%' }}>
          <Grid container spacing={3}>
            {proposal.follow_ups.length === 0 ||
            proposal.follow_ups.filter((items) => {
              for (const item of items.user.roles) {
                return item.role !== 'CLIENT';
              }
            }).length === 0 ? (
              <Grid item md={12} xs={12}>
                <EmptyFollowUps />
              </Grid>
            ) : (
              proposal.follow_ups
                .filter((items) => {
                  for (const item of items.user.roles) {
                    return item.role !== 'CLIENT';
                  }
                })
                .map((item, index) => (
                  <Grid item md={12} xs={12} key={index}>
                    {item.attachments && <FollowUpsFile {...item} />}
                    {item.content && <FollowUpsText {...item} />}
                  </Grid>
                ))
            )}
          </Grid>
        </Container>
      </TabPanel>
      <TabPanel value={switchState} index={1} dir={theme.direction}>
        <Container sx={{ py: 2, width: '100%' }}>
          <Grid container spacing={3}>
            {proposal.follow_ups.length === 0 ||
            proposal.follow_ups.filter((items) => {
              for (const item of items.user.roles) {
                return item.role === 'CLIENT';
              }
            }).length === 0 ? (
              <Grid item md={12} xs={12}>
                <EmptyFollowUps />
              </Grid>
            ) : (
              proposal.follow_ups
                .filter((items) => {
                  for (const item of items.user.roles) {
                    return item.role === 'CLIENT';
                  }
                })
                .map((item, index) => (
                  <Grid item md={12} xs={12} key={index}>
                    {item.attachments && <FollowUpsFile {...item} />}
                    {item.content && <FollowUpsText {...item} />}
                  </Grid>
                ))
            )}
          </Grid>
        </Container>
      </TabPanel>
    </Grid>
  );
}
export default EmployeeFollowUpsPage;

import { Grid, Stack, Tab, Tabs } from '@mui/material';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { useQuery } from 'urql';
import { getFollowUpsEmployee } from 'queries/client/getFollowUps';
import { useParams } from 'react-router';
import EmptyFollowUps from './EmptyFollowUps';
import FollowUpsFile from './FollowUpsFile';
import FollowUpsText from './FollowUpsText';

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
  const { id } = useParams();

  const [result] = useQuery({
    query: getFollowUpsEmployee,
    variables: {
      proposal_id: id,
    },
  });

  const { data, fetching, error } = result;

  const theme = useTheme();

  const [switchState, setSwitchState] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSwitchState(newValue);
  };

  if (fetching) return <>... Loading</>;

  if (error) return <>... Opss something went Wrong</>;

  console.log(data);
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
              label={'متابعات الموظفين'}
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
              label={'متابعات الشريك'}
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
      <Grid container md={12} xs={12}>
        <TabPanel value={switchState} index={0} dir={theme.direction}>
          <>
            {data.employee_follow_ups.length === 0 && (
              <Grid item md={12} xs={12}>
                <EmptyFollowUps />
              </Grid>
            )}
            {data.employee_follow_ups.length !== 0 && (
              <>
                {data.employee_follow_ups.map((item: any, index: any) => (
                  <Grid item md={12} xs={12} key={index}>
                    {item.file && <FollowUpsFile {...item} />}
                    {item.action && <FollowUpsText {...item} />}
                  </Grid>
                ))}
              </>
            )}
          </>
        </TabPanel>
      </Grid>
      <Grid container md={12} xs={12}>
        <TabPanel value={switchState} index={1} dir={theme.direction}>
          <>
            {data.client_follow_ups.length === 0 && (
              <Grid item md={12} xs={12}>
                <EmptyFollowUps />
              </Grid>
            )}
            {data.client_follow_ups.length !== 0 && (
              <>
                {data.client_follow_ups.map((item: any, index: any) => (
                  <Grid item md={12} xs={12} key={index}>
                    {item.file && <FollowUpsFile {...item} />}
                    {item.action && <FollowUpsText {...item} />}
                  </Grid>
                ))}
              </>
            )}
          </>
        </TabPanel>
      </Grid>
    </Grid>
  );
}

export default EmployeeFollowUpsPage;

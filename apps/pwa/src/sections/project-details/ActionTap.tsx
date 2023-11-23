import { Box, Tab, Tabs } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import React from 'react';
import { useParams } from 'react-router';
import { setActiveTap } from 'redux/slices/proposal';
import { useDispatch, useSelector } from 'redux/store';
import { ActiveTap } from '../../@types/proposal';
import { Taps } from './action-bar-taps';
import { FollowUps } from './follow-ups';
import { ProjectPath } from './project-path';
import { MainPage, Payments, ProjectBudget, SupervisorRevision, TimeLine } from './taps-pages';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: string;
  value: string;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
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

function ActionTap() {
  const { activeTap, proposal } = useSelector((state) => state.proposal);

  const dispatch = useDispatch();

  const { translate } = useLocales();

  const theme = useTheme();

  const { activeRole } = useAuth();

  const { actionType } = useParams();

  const [active, setActive] = React.useState<string>(
    activeRole === 'tender_client' ||
      activeRole === 'tender_admin' ||
      activeRole === 'tender_accounts_manager' ||
      actionType === 'old-proposal'
      ? 'main'
      : 'project-path'
  );

  const handleChange = (event: React.SyntheticEvent, newValue: ActiveTap) => {
    setActive(newValue);
    dispatch(setActiveTap(newValue));
  };

  React.useEffect(() => {
    if (activeRole !== 'tender_client' && actionType !== 'old-proposal') {
      dispatch(setActiveTap('project-path'));
    }
  }, [proposal, activeRole, actionType, dispatch]);

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Tabs
        value={active}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="inherit"
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          bgcolor: theme.palette.background.default,
          borderRadius: 2,
          padding: { xs: 1, sm: 1.25 },
          width: '100%',
        }}
      >
        {Taps[`${activeRole!}`][
          `${
            actionType === 'show-details' ||
            actionType === 'completing-exchange-permission' ||
            actionType === 'old-proposal'
              ? actionType
              : 'show-details'
          }`
        ].map((item, index) => (
          <Tab
            label={translate(item?.title)}
            value={item.value}
            key={index}
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
                borderRadius: '10px',
              },
            }}
          />
        ))}
      </Tabs>
      <TabPanel value={active} index="project-path" dir={theme.direction}>
        <ProjectPath />
      </TabPanel>
      <TabPanel value={active} index="main" dir={theme.direction}>
        <MainPage />
      </TabPanel>
      <TabPanel value={active} index="project-budget" dir={theme.direction}>
        <ProjectBudget />
      </TabPanel>
      <TabPanel value={active} index="follow-ups" dir={theme.direction}>
        <FollowUps />
      </TabPanel>
      <TabPanel value={active} index="payments" dir={theme.direction}>
        <Payments />
      </TabPanel>
      <TabPanel value={activeTap} index="project-timeline" dir={theme.direction}>
        <TimeLine />
      </TabPanel>
      <TabPanel value={active} index="supervisor-revision" dir={theme.direction}>
        <SupervisorRevision />
      </TabPanel>
    </Box>
  );
}

export default ActionTap;

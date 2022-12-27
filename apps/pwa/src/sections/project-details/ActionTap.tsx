import { Taps } from './action-bar-taps';
import { useParams } from 'react-router';
import useAuth from 'hooks/useAuth';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Tabs, Tab, Box } from '@mui/material';
import useLocales from 'hooks/useLocales';
import { ProjectPath } from './project-path';
import { MainPage, Payments, ProjectBudget, SupervisorRevision, TimeLine } from './taps-pages';
import { FollowUps } from './follow-ups';
import { useDispatch, useSelector } from 'redux/store';
import { setActiveTap } from 'redux/slices/proposal';
import { ActiveTap } from '../../@types/proposal';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: string;
  value: string;
}

interface TopActionProps {
  data: any;
  activeTap: string;
  setActiveTap: (newValue: string) => void;
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

  const handleChange = (event: React.SyntheticEvent, newValue: ActiveTap) => {
    dispatch(setActiveTap(newValue));
  };

  React.useEffect(() => {}, [proposal]);

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Tabs
        value={activeTap}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="inherit"
        sx={{
          bgcolor: theme.palette.background.default,
          borderRadius: 2,
          padding: 1.25,
        }}
      >
        {Taps[`${activeRole!}`][
          `${
            actionType === 'show-details' || actionType === 'completing-exchange-permission'
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
      <TabPanel value={activeTap} index="main" dir={theme.direction}>
        <MainPage />
      </TabPanel>
      <TabPanel value={activeTap} index="project-budget" dir={theme.direction}>
        <ProjectBudget />
      </TabPanel>
      <TabPanel value={activeTap} index="follow-ups" dir={theme.direction}>
        <FollowUps />
      </TabPanel>
      <TabPanel value={activeTap} index="payments" dir={theme.direction}>
        <Payments />
      </TabPanel>
      <TabPanel value={activeTap} index="project-timeline" dir={theme.direction}>
        <TimeLine />
      </TabPanel>
      <TabPanel value={activeTap} index="project-path" dir={theme.direction}>
        <ProjectPath />
      </TabPanel>
      <TabPanel value={activeTap} index="supervisor-revision" dir={theme.direction}>
        <SupervisorRevision />
      </TabPanel>
    </Box>
  );
}

export default ActionTap;
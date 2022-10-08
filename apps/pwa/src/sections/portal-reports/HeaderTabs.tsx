import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Tabs, Tab, Typography, Box, styled } from '@mui/material';
import useLocales from 'hooks/useLocales';
// sections
import AverageTransaction from './AverageTransactions';
import AchievementEffectiveness from './AchievementEffectiveness';
import MosqueTrack from './MosqueTrack';
import ConcessionalTrack from './ConcessionalTrack';
import InitiativeTrack from './InitiativeTrack';
import ComplexityTrack from './ComplexityTrack';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

const ContentStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 24,
}));

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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="inherit"
        sx={{
          bgcolor: theme.palette.grey[400],
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
      <TabPanel value={value} index={0} dir={theme.direction}>
        <ContentStyle sx={{ mt: 3 }}>
          <Typography variant="h4">You can put component in this sections</Typography>
        </ContentStyle>
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <ContentStyle sx={{ mt: 3 }}>
          <Typography variant="h4">You can put component in this sections</Typography>
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
      </TabPanel>
    </Box>
  );
}

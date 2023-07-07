import { Grid, Tab, Tabs, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Space from 'components/space/space';
import AdvertisingTapeListTable from 'components/table/admin/system-messages/advertising-tape/AdvertisingTapeListTable';
import useLocales from 'hooks/useLocales';
import React from 'react';

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

interface Props {
  tabsValue: number;
}

export default function TabAdvertisingTape({ tabsValue = 0 }: Props) {
  const theme = useTheme();
  const { translate } = useLocales();

  return (
    <React.Fragment>
      <TabPanel
        data-cy="tab_panel_advertising_tape"
        value={tabsValue}
        index={1}
        dir={theme.direction}
      >
        <Typography variant="h4">
          {translate('system_messages.tab.panel.advertising_tape')}
        </Typography>
        <Space direction="horizontal" size="medium" />
        <AdvertisingTapeListTable />
      </TabPanel>
    </React.Fragment>
  );
}

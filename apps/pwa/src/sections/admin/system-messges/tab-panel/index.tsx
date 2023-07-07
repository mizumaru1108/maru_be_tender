import { Grid, Tab, Tabs, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useLocales from 'hooks/useLocales';
import React from 'react';
import TabAdvertisingTape from 'sections/admin/system-messges/tab-panel/tab-advertising-tape';
import TabInternalMessage from 'sections/admin/system-messges/tab-panel/tab-internal-message';

interface Props {
  tabsValue: number;
}

export default function TabPanelSystemMessages({ tabsValue = 0 }: Props) {
  const theme = useTheme();
  const { translate } = useLocales();

  return (
    <React.Fragment>
      <Grid container>
        <Grid item md={12} xs={12}>
          <TabInternalMessage tabsValue={tabsValue} />
        </Grid>
        <Grid item md={12} xs={12}>
          <TabAdvertisingTape tabsValue={tabsValue} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

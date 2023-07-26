import { Button, Grid, Tab, Tabs, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Space from 'components/space/space';
import { InternalMessageTable } from 'components/table/admin/system-messages';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import React from 'react';
import { useNavigate } from 'react-router';
import TabOptionSystemMessages from 'sections/admin/system-messges/tab-options';
import TabPanelSystemMessages from 'sections/admin/system-messges/tab-panel';
import { role_url_map } from '../../../@types/commons';

export default function SystemMessages() {
  const theme = useTheme();
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { activeRole } = useAuth();

  const [value, setValue] = React.useState(0);

  const handleChange = (newValue: number) => {
    setValue(newValue);
  };
  const handleAddForm = () => {
    // setValue(newValue);
    if (value === 0) {
      navigate(`/${role_url_map[activeRole!]}/dashboard/system-messages/internal`);
    } else {
      navigate(`/${role_url_map[activeRole!]}/dashboard/system-messages/external`);
    }
  };
  // console.log({ value });
  return (
    <React.Fragment>
      <Grid container display="flex" justifyContent="center">
        <Space direction="horizontal" size="small" />
        <Grid item md={12} xs={12}>
          <Typography variant="h4">{translate('pages.admin.system_messages')}</Typography>
        </Grid>
        <Space direction="horizontal" size="medium" />
        <Grid item md={12} xs={12} display="flex" justifyContent="center">
          <Grid item md={5} xs={12}>
            <TabOptionSystemMessages tabsValue={value} onReturnValue={handleChange} />
          </Grid>
        </Grid>
        <Space direction="horizontal" size="medium" />

        <Grid item md={12} xs={12} display="flex" justifyContent={'space-between'}>
          <Grid item md={4} xs={12} display="flex" justifyContent={'flex-start'}>
            <Typography variant="h5">{translate('system_messages.current_slides')}</Typography>
          </Grid>
          <Grid item md={3} xs={12} display="flex" justifyContent={'flex-end'}>
            <Button variant="contained" size="medium" onClick={handleAddForm}>
              {translate('system_messages.button.add_new_slide')}
            </Button>
          </Grid>
        </Grid>
        <Space direction="horizontal" size="medium" />

        <Grid item md={12} xs={12}>
          <TabPanelSystemMessages tabsValue={value} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

import { Button, Container, Grid, Stack, Tab, Tabs, Typography } from '@mui/material';
import { getFollowUps } from 'queries/client/getFollowUps';
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { useQuery } from 'urql';
import EmptyFollowUps from './EmptyFollowUps';
import FollowUpsFile from './FollowUpsFile';
import FollowUpsText from './FollowUpsText';
import { useTheme } from '@mui/material/styles';
import useAuth from 'hooks/useAuth';
import ClientFollowUpsPage from './ClientFollowUpsPage';
import EmployeeFollowUpsPage from './EmployeeFollowUpsPage';

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

function FollowUps() {
  const { activeRole } = useAuth();
  return (
    <Grid container spacing={4}>
      <Grid item md={12} xs={12}>
        <Typography variant="h6">متابعات المشروع</Typography>
      </Grid>
      <Grid item md={12} xs={12}>
        {activeRole === 'tender_client' ? <ClientFollowUpsPage /> : <EmployeeFollowUpsPage />}
      </Grid>
    </Grid>
  );
}

export default FollowUps;

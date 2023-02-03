import { ReactNode, useState } from 'react';
// material
import { Grid, Typography, TextField, Stack, Button, useTheme } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useLocales from 'hooks/useLocales';
// sections
import HeaderTabs from './HeaderTabs';
// configuration_feature_flag
import { FEATURE_PORTAL_REPORTS } from 'config';

// -------------------------------------------------------------------------------

export default function MainPortalReports() {
  const { translate } = useLocales();

  return (
    <>
      {FEATURE_PORTAL_REPORTS ? (
        <HeaderTabs />
      ) : (
        <Typography variant="inherit" sx={{ fontStyle: 'italic' }}>
          {translate('commons.maintenance_feature_flag')} ...
        </Typography>
      )}
    </>
  );
}

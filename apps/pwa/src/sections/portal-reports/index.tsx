import { ReactNode, useState } from 'react';
// material
import { Grid, Typography, TextField, Stack, Button, useTheme } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useLocales from 'hooks/useLocales';
// sections
import HeaderTabs from './HeaderTabs';

// -------------------------------------------------------------------------------

export default function MainPortalReports() {
  return <HeaderTabs />;
}

import React, { useState } from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';
import useLocales from 'hooks/useLocales';
// sections
import TableEmployee from './TableEmployee';
// types
import { IPropsAvgEmployeeEfectiveness } from './types';
//
import { MockTableEmployee } from '_mock/portal_reports';

//
interface IPropsEmployeeComponent {
  data: IPropsAvgEmployeeEfectiveness[] | [];
  loading: boolean;
}

export default function AchievementEffectiveness({ data, loading }: IPropsEmployeeComponent) {
  const { translate } = useLocales();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'start',
        flexDirection: 'column',
        rowGap: 4,
        mt: 1,
      }}
    >
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '50vh',
          }}
        >
          <CircularProgress size={50} />
        </Box>
      ) : (
        <React.Fragment>
          <Typography variant="h4" sx={{ mt: 1 }}>
            {translate('section_portal_reports.heading.achievement_effectiveness')}
          </Typography>
          <TableEmployee data={data} />
        </React.Fragment>
      )}
    </Box>
  );
}

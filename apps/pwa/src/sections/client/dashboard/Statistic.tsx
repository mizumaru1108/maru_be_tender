import React from 'react';
// components
import { Box, Grid, Typography } from '@mui/material';
// hooks
import useLocales from 'hooks/useLocales';
// gql
import {} from 'queries/Cashier/getDailyCashierStatistics';
import { useQuery } from 'urql';
// config
import { FEATURE_DAILY_STATUS } from 'config';

export default function Statistics() {
  const { translate } = useLocales();

  return (
    <Grid container spacing={2}>
      <Grid item md={12}>
        <Typography variant="h4">{translate('finance_pages.heading.daily_stats')}</Typography>
      </Grid>
      {!FEATURE_DAILY_STATUS ? (
        <Grid item md={12}>
          <Typography variant="inherit" sx={{ fontStyle: 'italic' }}>
            {translate('commons.maintenance_feature_flag')} ...
          </Typography>
        </Grid>
      ) : (
        <React.Fragment>
          <Grid item md={2} xs={12}>
            <Box
              sx={{
                borderRadius: '8px',
                backgroundColor: '#fff',
                p: 2,
              }}
            >
              <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
                {translate('content.client.main_page.required_budget')}
              </Typography>
              <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
                <Typography component="span" sx={{ fontWeight: 700 }}>
                  {/* {data.incoming_requests.aggregate.count} &nbsp; */}
                  Title
                </Typography>
                <Typography component="span" sx={{ fontWeight: 700 }}>
                  {translate('finance_pages.heading.projects')}
                </Typography>
              </Typography>
            </Box>
          </Grid>
        </React.Fragment>
      )}
    </Grid>
  );
}

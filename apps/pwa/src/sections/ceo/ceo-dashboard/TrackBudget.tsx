// component
import { Box, Grid, Stack, Typography, useTheme } from '@mui/material';
import Label from 'components/Label';
import Image from 'components/Image';
// hooks
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
// urql + query
import { useQuery } from 'urql';
import { getDailyTrackBudget } from 'queries/project-supervisor/getTrackBudget';
//
import moment from 'moment';
import { fCurrencyNumber } from 'utils/formatNumber';
import React from 'react';
// config
import { FEATURE_DAILY_STATUS } from 'config';

function TrackBudget() {
  const theme = useTheme();
  const { translate } = useLocales();
  const { user } = useAuth();

  const [result] = useQuery({
    query: getDailyTrackBudget,
    variables: {
      // first_date: moment().startOf('day').toISOString(),
      // first_date: '2022-01-01T17:00:00.000Z',
      // second_date: moment().endOf('day').toISOString(),
    },
  });

  const { data, fetching, error } = result;

  if (fetching) return <>... Loading</>;
  if (error) return <>{error.message}</>;

  return (
    <Grid container spacing={2} sx={{ mt: '1px' }}>
      <Grid item md={12}>
        <Typography variant="h4">{translate('content.client.main_page.track_budget')}</Typography>
      </Grid>
      {!FEATURE_DAILY_STATUS ? (
        <Grid item md={12} sx={{ mb: 0 }}>
          <Typography variant="inherit" sx={{ fontStyle: 'italic' }}>
            {translate('commons.maintenance_feature_flag')} ...
          </Typography>
        </Grid>
      ) : (
        <React.Fragment>
          {!fetching && data ? (
            <React.Fragment>
              <Grid item md={2} xs={12}>
                <Box
                  sx={{
                    borderRadius: 1,
                    backgroundColor: '#fff',
                    p: 2,
                  }}
                >
                  <Image
                    src={`/icons/rial-currency.svg`}
                    alt="icon_riyals"
                    sx={{ display: 'inline-flex' }}
                  />
                  <Typography sx={{ color: '#93A3B0', fontSize: '12px', my: '5px' }}>
                    {translate('content.administrative.statistic.heading.totalBudget')}
                  </Typography>
                  <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
                    {fCurrencyNumber(data.totalBudget.aggregate.sum.amount_required_fsupport)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item md={2} xs={12}>
                <Box
                  sx={{
                    borderRadius: 1,
                    backgroundColor: '#fff',
                    p: 2,
                  }}
                >
                  <Image
                    src={`/icons/rial-currency.svg`}
                    alt="icon_riyals"
                    sx={{ display: 'inline-flex' }}
                  />
                  <Typography sx={{ color: '#93A3B0', fontSize: '12px', my: '5px' }}>
                    {translate('content.administrative.statistic.heading.totalAcceptingBudget')}
                  </Typography>
                  <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
                    {fCurrencyNumber(
                      data.totalAcceptingBudget.aggregate.sum.fsupport_by_supervisor
                    )}
                  </Typography>
                </Box>
              </Grid>
            </React.Fragment>
          ) : null}
        </React.Fragment>
      )}
    </Grid>
  );
}

export default TrackBudget;

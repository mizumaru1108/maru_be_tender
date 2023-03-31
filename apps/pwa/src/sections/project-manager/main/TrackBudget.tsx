// component
import { Box, Grid, Typography, useTheme } from '@mui/material';
import Image from 'components/Image';
// hooks
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
// urql + query
import { useQuery } from 'urql';
import { getOneTrackBudget } from 'queries/project-supervisor/getTrackBudget';
//
import moment from 'moment';
import { fCurrencyNumber } from 'utils/formatNumber';
import React from 'react';
// config
import { FEATURE_DAILY_STATUS } from 'config';

// ------------------------------------------------------------------------------------------

interface IPropTrackBudgets {
  path?: string;
}

// ------------------------------------------------------------------------------------------

function TrackBudget({ path }: IPropTrackBudgets) {
  const { translate } = useLocales();
  const theme = useTheme();

  const [{ data, fetching, error }] = useQuery({
    query: getOneTrackBudget,
    variables: {
      track_id: path,
    },
  });

  if (fetching) return <>{translate('pages.common.loading')}</>;
  if (error) return <>{error.message}</>;

  return (
    <Grid container spacing={2} sx={{ mt: '1px' }}>
      <Grid item md={12}>
        <Typography variant="h4">{translate('content.client.main_page.track_budget')}</Typography>
      </Grid>
      {!FEATURE_DAILY_STATUS ? (
        <Grid item md={12}>
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
                    {translate('content.administrative.statistic.heading.totalReservedBudget')}
                  </Typography>
                  <Typography
                    sx={{
                      color:
                        data.track[0].totalBudget.aggregate.sum.budget -
                          data.track[0].totalSpendBudget.aggregate.sum.fsupport_by_supervisor <
                        0
                          ? theme.palette.error.main
                          : 'text.tertiary',
                      fontWeight: 700,
                    }}
                  >
                    {fCurrencyNumber(
                      data.track[0].totalBudget.aggregate.sum.budget -
                        data.track[0].totalSpendBudget.aggregate.sum.fsupport_by_supervisor
                    )}
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
                    {translate('content.administrative.statistic.heading.totalSpendBudget')}
                  </Typography>
                  <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
                    {fCurrencyNumber(
                      data.track[0].totalSpendBudget.aggregate.sum.fsupport_by_supervisor
                    )}
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
                    {translate('content.administrative.statistic.heading.totalBudget')}
                  </Typography>
                  <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
                    {fCurrencyNumber(data.track[0].totalBudget.aggregate.sum.budget)}
                  </Typography>
                </Box>
              </Grid>
              {/* <Grid item md={2} xs={12}>
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
              </Grid> */}
              {/* <Grid item md={2} xs={12}>
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
              </Grid> */}
            </React.Fragment>
          ) : null}
        </React.Fragment>
      )}
    </Grid>
  );
}

export default TrackBudget;

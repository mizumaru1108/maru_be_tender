// component
import { Box, Grid, Typography } from '@mui/material';
import Image from 'components/Image';
// hooks
import useLocales from 'hooks/useLocales';
// urql + query
//
import React, { useEffect, useMemo } from 'react';
import { fCurrencyNumber, getTrackSpendingBudget } from 'utils/formatNumber';
// config
import { FEATURE_DAILY_STATUS } from 'config';
import { useSelector } from 'redux/store';

// ------------------------------------------------------------------------------------------

interface IPropTrackBudgets {
  path?: string;
  track_id?: string;
}

// ------------------------------------------------------------------------------------------

export default function TrackBudget(props: IPropTrackBudgets) {
  const { translate } = useLocales();
  const { isLoading, track } = useSelector((state) => state.tracks);

  const budgets = useMemo(() => {
    const totalBudget = track.total_budget ?? 0;
    const reservedBudget = track.total_reserved_budget ?? 0;
    const spendBudget = track.total_spending_budget ?? 0;
    const spendBudgetCeo = track.total_spending_budget_by_ceo ?? 0;
    const remainBudget = totalBudget - (reservedBudget + (spendBudgetCeo - reservedBudget));

    return {
      totalBudget,
      reservedBudget,
      spendBudget,
      spendBudgetCeo,
      remainBudget,
    };
  }, [track]);

  if (isLoading) return <>{translate('pages.common.loading')}</>;

  return (
    <Grid container spacing={2}>
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
          {!isLoading && track ? (
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
                    {/* {translate('content.administrative.statistic.heading.totalSpendBudget')} */}
                  </Typography>
                  <Typography
                    sx={{
                      color: 'text.tertiary',
                      fontWeight: 700,
                    }}
                  >
                    {fCurrencyNumber(track?.total_reserved_budget || 0)}
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
                    {/* {translate('content.administrative.statistic.heading.totalReservedBudget')} */}
                  </Typography>
                  <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
                    {fCurrencyNumber(getTrackSpendingBudget({ ...track }))}
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
                    {/* {translate('content.administrative.statistic.heading.totalSpendBudget')} */}
                    {translate('content.administrative.statistic.heading.totalRemainingBudget')}
                  </Typography>
                  <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
                    {fCurrencyNumber(budgets.remainBudget)}
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
                    {fCurrencyNumber(track?.total_budget || 0)}
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

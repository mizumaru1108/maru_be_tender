// component
import { Box, Grid, Typography, useTheme } from '@mui/material';
import Image from 'components/Image';
// hooks
import useLocales from 'hooks/useLocales';
// urql + query
import { useQuery } from 'urql';
import { getOneTrackBudget } from 'queries/project-supervisor/getTrackBudget';
//
import { fCurrencyNumber } from 'utils/formatNumber';
import React, { useState, useEffect } from 'react';
// config
import { FEATURE_DAILY_STATUS } from 'config';
import { ITrackList } from 'sections/ceo/ceo-dashboard/TrackBudget';

// ------------------------------------------------------------------------------------------

interface IPropTrackBudgets {
  path?: string;
}

// ------------------------------------------------------------------------------------------

function TrackBudget({ path }: IPropTrackBudgets) {
  const { translate } = useLocales();
  const theme = useTheme();
  const [trackList, setTrackList] = useState<ITrackList | null>(null);

  const [{ data, fetching, error }] = useQuery({
    query: getOneTrackBudget,
    variables: {
      track_id: path,
    },
  });

  useEffect(() => {
    if (data) {
      const newData = data.track.map((el: any) => ({
        name: el.name,
        total_budget: el.totalBudget.aggregate.sum.budget ?? 0,
        total_reserved_budget: el.totalReservedBudget.aggregate.sum.fsupport_by_supervisor ?? 0,
        total_spend_budget: el.totalSpendBudget.reduce(
          (
            acc: any,
            curr: { payments_aggregate: { aggregate: { sum: { payment_amount: any } } } }
          ) => {
            const paymentAmount = curr.payments_aggregate.aggregate.sum.payment_amount;
            return acc + (paymentAmount ? paymentAmount : 0);
          },
          0
        ),
      }));

      setTrackList(newData[0]);
    }
  }, [data]);

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
                      // color:
                      //   data.track.length > 0 &&
                      //   data.track[0].totalBudget.aggregate.sum.budget -
                      //     data.track[0].totalSpendBudget.aggregate.sum.fsupport_by_supervisor <
                      //     0
                      //     ? theme.palette.error.main
                      //     : 'text.tertiary',
                      color: 'text.tertiary',
                      fontWeight: 700,
                    }}
                  >
                    {trackList
                      ? fCurrencyNumber(trackList.total_reserved_budget)
                      : fCurrencyNumber(0)}
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
                    {trackList ? fCurrencyNumber(trackList.total_spend_budget) : fCurrencyNumber(0)}
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
                    {data.track.length > 0
                      ? fCurrencyNumber(data.track[0].totalBudget.aggregate.sum.budget)
                      : fCurrencyNumber(0)}
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

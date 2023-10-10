import React, { useEffect, useState } from 'react';
// component
import { Box, Grid, Typography, useTheme } from '@mui/material';
import TrackCardBudget from './TrackCardBudget';
// hooks
import useLocales from 'hooks/useLocales';
// urql + query
import { useQuery } from 'urql';
import { getTrackBudgetAdmin } from 'queries/project-supervisor/getTrackBudget';
//
import { FEATURE_DAILY_STATUS } from 'config';
import { useSnackbar } from 'notistack';
import useAuth from 'hooks/useAuth';
import axiosInstance from 'utils/axios';
import Image from 'components/Image';
import { fCurrencyNumber } from 'utils/formatNumber';

// ------------------------------------------------------------------------------------------

export interface ITrackList {
  name: string;
  total_budget: number;
  total_spend_budget: number;
  total_reserved_budget: number;
}

interface IPropTrackBudgets {
  path?: string;
  track_id?: string;
}

// ------------------------------------------------------------------------------------------

export default function TrackBudget({ path, track_id }: IPropTrackBudgets) {
  const { translate } = useLocales();
  const theme = useTheme();
  const [trackList, setTrackList] = useState<ITrackList | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { activeRole } = useAuth();

  // const [{ data, fetching, error }] = useQuery({
  //   query: getOneTrackBudget,
  //   variables: {
  //     track_id: path,
  //   },
  // });

  const fetchingSchedule = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const rest = await axiosInstance.get(
        `/tender/proposal/payment/find-track-budget?id=${track_id as string}`,
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      // console.log('rest', rest.data);
      if (rest) {
        const tmpValue = rest.data.data.data;
        setTrackList((item: any) => {
          const tmpItem = { ...item };
          return {
            ...tmpItem,
            name: tmpValue.name,
            total_budget: tmpValue.total_budget,
            total_spend_budget: tmpValue.total_spending_budget,
            total_reserved_budget: tmpValue.total_reserved_budget,
          };
        });
      }
    } catch (err) {
      // console.log('err', err);
      // enqueueSnackbar(err.message, {
      //   variant: 'error',
      //   preventDuplicate: true,
      //   autoHideDuration: 3000,
      //   anchorOrigin: {
      //     vertical: 'bottom',
      //     horizontal: 'center',
      //   },
      // });
      const statusCode = (err && err.statusCode) || 0;
      const message = (err && err.message) || null;
      enqueueSnackbar(
        `${
          statusCode < 500 && message ? message : translate('pages.common.internal_server_error')
        }`,
        {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        }
      );
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRole, track_id, enqueueSnackbar]);

  React.useEffect(() => {
    fetchingSchedule();
  }, [fetchingSchedule]);

  if (isLoading) return <>{translate('pages.commo.loading')}</>;
  // if (error) return <>{error.message}</>;n

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
          {!isLoading && trackList ? (
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
                    {trackList.total_budget
                      ? fCurrencyNumber(trackList.total_budget)
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

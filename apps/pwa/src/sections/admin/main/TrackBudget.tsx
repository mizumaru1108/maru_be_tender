import React, { useState } from 'react';
// component
import { Grid, Typography, useTheme } from '@mui/material';
// hooks
import useLocales from 'hooks/useLocales';
// urql + query
import Image from 'components/Image';
import { FEATURE_DAILY_STATUS } from 'config';
import useAuth from 'hooks/useAuth';
import { useSnackbar } from 'notistack';
import axiosInstance from 'utils/axios';
import { formatCapitalizeText } from 'utils/formatCapitalizeText';
import { fCurrencyNumber } from 'utils/formatNumber';

// ------------------------------------------------------------------------------------------

export interface ITrackList {
  name: string;
  total_budget: number;
  total_spending_budget: number;
  total_reserved_budget: number;
}

interface IPropTrackBudgets {
  path?: string;
  track_id?: string;
}

const styleBox = {
  borderRadius: 1,
  backgroundColor: '#fff',
  p: 2,
};

// ------------------------------------------------------------------------------------------

export default function TrackBudget({ path, track_id }: IPropTrackBudgets) {
  const { translate } = useLocales();
  const theme = useTheme();
  const [trackList, setTrackList] = useState<ITrackList[] | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { activeRole } = useAuth();
  // console.log({ trackList });

  const fetchingSchedule = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const rest = await axiosInstance.get(`/tender/proposal/payment/find-track-budgets`, {
        headers: { 'x-hasura-role': activeRole! },
        params: { is_deleted: '0' },
      });
      // console.log('rest', rest.data);
      if (rest) {
        const tmpValue = rest.data.data;
        // console.log('value tmpValue', tmpValue);
        setTrackList(tmpValue);
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
  }, [activeRole, enqueueSnackbar]);

  React.useEffect(() => {
    fetchingSchedule();
  }, [fetchingSchedule]);

  if (isLoading) return <>{translate('pages.common.loading')}</>;
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
          {!isLoading && trackList && trackList?.length > 0
            ? trackList
                .filter((item: ITrackList) => item.name !== 'GENERAL')
                .map((item: ITrackList, index: number) => (
                  <Grid
                    item
                    md={6}
                    xs={12}
                    key={index}
                    sx={{ display: 'flex', flexDirection: 'column' }}
                  >
                    <Grid item xs={12}>
                      <Typography variant="h5">{formatCapitalizeText(item?.name)}</Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'row' }} gap={2}>
                      <Grid item md={4} xs={12} sx={styleBox}>
                        <Image
                          src={`/icons/rial-currency.svg`}
                          alt="icon_riyals"
                          sx={{ display: 'inline-flex' }}
                        />
                        <Typography sx={{ color: '#93A3B0', fontSize: '12px', my: '5px' }}>
                          {translate(
                            'content.administrative.statistic.heading.totalReservedBudget'
                          )}
                        </Typography>
                        <Typography
                          sx={{
                            color: 'text.tertiary',
                            fontWeight: 700,
                          }}
                        >
                          {fCurrencyNumber(item.total_reserved_budget || 0)}
                        </Typography>
                      </Grid>
                      <Grid item md={4} xs={12} sx={styleBox}>
                        <Image
                          src={`/icons/rial-currency.svg`}
                          alt="icon_riyals"
                          sx={{ display: 'inline-flex' }}
                        />
                        <Typography sx={{ color: '#93A3B0', fontSize: '12px', my: '5px' }}>
                          {translate('content.administrative.statistic.heading.totalSpendBudget')}
                        </Typography>
                        <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
                          {fCurrencyNumber(item.total_spending_budget || 0)}
                        </Typography>
                      </Grid>
                      <Grid item md={4} xs={12} sx={styleBox}>
                        <Image
                          src={`/icons/rial-currency.svg`}
                          alt="icon_riyals"
                          sx={{ display: 'inline-flex' }}
                        />
                        <Typography sx={{ color: '#93A3B0', fontSize: '12px', my: '5px' }}>
                          {translate('content.administrative.statistic.heading.totalBudget')}
                        </Typography>
                        <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
                          {fCurrencyNumber(item.total_budget || 0)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                ))
            : null}
        </React.Fragment>
      )}
    </Grid>
  );
}

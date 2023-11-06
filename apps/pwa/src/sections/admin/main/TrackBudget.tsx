import React from 'react';
// component
import { Grid, Typography } from '@mui/material';
// hooks
import useLocales from 'hooks/useLocales';
// urql + query
import Image from 'components/Image';
import { FEATURE_DAILY_STATUS } from 'config';
import useAuth from 'hooks/useAuth';
import { getTracks } from 'redux/slices/track';
import { dispatch, useSelector } from 'redux/store';
import { formatCapitalizeText } from 'utils/formatCapitalizeText';
import { fCurrencyNumber } from 'utils/formatNumber';
import { TrackProps } from '../../../@types/commons';

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
  const { tracks, isLoading: loadingTrack } = useSelector((state) => state.tracks);
  const { activeRole } = useAuth();

  React.useEffect(() => {
    dispatch(getTracks(activeRole!));
  }, [activeRole]);

  if (loadingTrack) return <>{translate('pages.common.loading')}</>;

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
          {!loadingTrack && tracks && tracks?.length > 0
            ? tracks.map((item: TrackProps, index: number) => (
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
                    <Grid item md={3} xs={12} sx={styleBox}>
                      <Image
                        src={`/icons/rial-currency.svg`}
                        alt="icon_riyals"
                        sx={{ display: 'inline-flex' }}
                      />
                      <Typography sx={{ color: '#93A3B0', fontSize: '12px', my: '5px' }}>
                        {/* {translate('content.administrative.statistic.heading.totalReservedBudget')} */}
                        {translate('content.administrative.statistic.heading.totalSpendBudget')}
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
                    <Grid item md={3} xs={12} sx={styleBox}>
                      <Image
                        src={`/icons/rial-currency.svg`}
                        alt="icon_riyals"
                        sx={{ display: 'inline-flex' }}
                      />
                      <Typography sx={{ color: '#93A3B0', fontSize: '12px', my: '5px' }}>
                        {/* {translate('content.administrative.statistic.heading.totalSpendBudget')} */}
                        {translate('content.administrative.statistic.heading.totalReservedBudget')}
                      </Typography>
                      <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
                        {fCurrencyNumber(item.total_spending_budget_by_ceo || 0)}
                      </Typography>
                    </Grid>
                    <Grid item md={3} xs={12} sx={styleBox}>
                      <Image
                        src={`/icons/rial-currency.svg`}
                        alt="icon_riyals"
                        sx={{ display: 'inline-flex' }}
                      />
                      <Typography sx={{ color: '#93A3B0', fontSize: '12px', my: '5px' }}>
                        {translate('content.administrative.statistic.heading.totalRemainingBudget')}
                      </Typography>
                      <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
                        {fCurrencyNumber(item.total_remaining_budget || 0)}
                      </Typography>
                    </Grid>
                    <Grid item md={3} xs={12} sx={styleBox}>
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

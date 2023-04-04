import React, { useEffect, useState } from 'react';
// component
import { Grid, Typography } from '@mui/material';
import TrackCardBudget from './TrackCardBudget';
// hooks
import useLocales from 'hooks/useLocales';
// urql + query
import { useQuery } from 'urql';
import { getTrackBudgetAdmin } from 'queries/project-supervisor/getTrackBudget';
//
import { FEATURE_DAILY_STATUS } from 'config';

// ------------------------------------------------------------------------------------------

export interface ITrackList {
  name: string;
  total_budget: number;
  total_spend_budget: number;
  total_reserved_budget: number;
}

// ------------------------------------------------------------------------------------------

export default function TrackBudget() {
  const { translate } = useLocales();
  const [trackList, setTrackList] = useState<ITrackList[] | []>([]);

  const [{ data, fetching, error }] = useQuery({
    query: getTrackBudgetAdmin,
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

      setTrackList(newData);
    }
  }, [data]);

  if (fetching) return <>{translate('pages.common.loading')}</>;
  if (error) return <>{error.message}</>;

  return (
    <Grid container columnSpacing={2} rowSpacing={4} sx={{ mt: '1px' }}>
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
              {trackList.map((el, i) => (
                <TrackCardBudget data={el} key={i} />
              ))}
            </React.Fragment>
          ) : null}
        </React.Fragment>
      )}
    </Grid>
  );
}

// component
import { Box, Grid, Typography } from '@mui/material';
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
import React, { useState, useEffect } from 'react';

export default function TrackBudget() {
  const { translate } = useLocales();
  const { user } = useAuth();

  const [valueTotal, setValueTotal] = useState<number>(0);

  const [result] = useQuery({
    query: getDailyTrackBudget,
    variables: {
      first_date: moment().startOf('day').toISOString(),
      // first_date: '2022-01-18T17:00:00.000Z',
      second_date: moment().endOf('day').toISOString(),
    },
  });

  const { data, fetching, error } = result;

  useEffect(() => {
    if (!fetching && data) {
      const newArr = data?.totalBudget.map(
        (el: { amount_required_fsupport: number }) => el.amount_required_fsupport
      );

      const totalValue = newArr.reduce((acc: number, curr: number) => acc + (curr || 0), 0);

      setValueTotal(totalValue);
    }
  }, [data, fetching]);

  // if (fetching) return <>... Loading</>;
  // if (error) return <>{error.message}</>;

  return (
    <Grid container spacing={2}>
      {!fetching && data ? (
        <React.Fragment>
          <Grid item md={12}>
            <Typography variant="h4">
              {translate('content.client.main_page.track_budget')}
            </Typography>
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
              <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
                {translate('content.client.main_page.total_track_budget')}
              </Typography>
              <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
                {fCurrencyNumber(valueTotal)}
              </Typography>
            </Box>
          </Grid>
        </React.Fragment>
      ) : (
        <>... Loading</>
      )}
    </Grid>
  );
}

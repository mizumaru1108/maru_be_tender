import React from 'react';
// components
import { Box, Grid, Typography } from '@mui/material';
import Image from 'components/Image';
// hooks
import useLocales from 'hooks/useLocales';
// gql
import { getSummaryClientProposal } from 'queries/client/getProposalStatistic';
import { useQuery } from 'urql';
// plugin
import moment from 'moment';
// config
import { FEATURE_DAILY_STATUS } from 'config';
import { fCurrencyNumber } from 'utils/formatNumber';

export default function Statistics() {
  const { translate } = useLocales();

  const [resQuery] = useQuery({
    query: getSummaryClientProposal,
    // variables: {
    //   first_date: moment().startOf('day').toISOString(),
    //   second_date: moment().endOf('day').toISOString(),
    // },
  });

  const { data, fetching, error } = resQuery;

  if (fetching) return <>... Loading</>;
  if (error) return <>{error.message}</>;

  return (
    <Grid container spacing={2}>
      <Grid item md={12}>
        <Typography variant="h4">
          {translate('content.administrative.statistic.heading.proposalStatistic')}
        </Typography>
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
              {Object.keys(data).map((item, i) => {
                const title = translate(`content.administrative.statistic.heading.${item}`);
                let value = data[item].aggregate.count
                  ? data[item].aggregate.count
                  : data[item].aggregate.sum;
                let budgetType: boolean = false;

                if (typeof value === 'object') {
                  value = Object.values(value)[0];
                  budgetType = true;
                }

                return (
                  <Grid item md={2} xs={12} key={i}>
                    <Box
                      sx={{
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        p: 2,
                      }}
                    >
                      {budgetType ? (
                        <Image
                          src={`/icons/rial-currency.svg`}
                          alt="icon_riyals"
                          sx={{ display: 'inline-flex' }}
                        />
                      ) : null}
                      <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
                        {title}
                      </Typography>
                      <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
                        <Typography component="span" sx={{ fontWeight: 700 }}>
                          {budgetType ? fCurrencyNumber(value) : value} &nbsp;
                        </Typography>
                        {!budgetType ? (
                          <Typography component="span" sx={{ fontWeight: 700 }}>
                            {translate('finance_pages.heading.projects')}
                          </Typography>
                        ) : null}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </React.Fragment>
          ) : null}
        </React.Fragment>
      )}
    </Grid>
  );
}

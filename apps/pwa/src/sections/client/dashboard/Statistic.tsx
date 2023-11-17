import React from 'react';
// components
import { Box, Grid, Typography } from '@mui/material';
import Image from 'components/Image';
// hooks
import useLocales from 'hooks/useLocales';
// gql
import { getSummaryClientProposal } from 'queries/client/getProposalStatistic';
import { useQuery } from 'urql';
// config
import { FEATURE_DAILY_STATUS } from 'config';
import { fCurrencyNumber } from 'utils/formatNumber';
import { useNavigate } from 'react-router';

export default function Statistics() {
  const { translate } = useLocales();
  const navigate = useNavigate();

  const [resQuery] = useQuery({
    query: getSummaryClientProposal,
    // variables: {
    //   first_date: moment().startOf('day').toISOString(),
    //   second_date: moment().endOf('day').toISOString(),
    // },
  });

  const { data, fetching, error } = resQuery;

  const handleClick = () => {
    navigate('/client/dashboard/old-proposal');
  };

  if (fetching) return <>{translate('pages.common.loading')}</>;
  if (error) return <>{error.message}</>;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4">
          {translate('content.administrative.statistic.heading.proposalStatistic')}
        </Typography>
      </Grid>
      {!FEATURE_DAILY_STATUS ? (
        <Grid item xs={12}>
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
                  <Grid item xs={12} sm={3} md={3} lg={2} key={i}>
                    <Box
                      sx={{
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        p: 2,
                        minHeight: '100px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        cursor: budgetType ? undefined : 'pointer',
                      }}
                      onClick={() => {
                        if (!budgetType) {
                          handleClick();
                        }
                      }}
                    >
                      {budgetType ? (
                        <Image
                          src={`/icons/rial-currency.svg`}
                          alt="icon_riyals"
                          sx={{
                            mb: 0.5,
                            '.lazy-load-image-background.blur.lazy-load-image-loaded > img': {
                              width: 'auto !important',
                            },
                          }}
                        />
                      ) : null}
                      <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
                        {title}
                      </Typography>
                      <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
                        <Typography component="span" sx={{ fontWeight: 700 }}>
                          {budgetType ? fCurrencyNumber(value) : value || 0} &nbsp;
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

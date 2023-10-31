import { Box, Grid, Typography } from '@mui/material';
import useAuth from 'hooks/useAuth';
import { getDailyFinanceStatistics } from 'queries/finance/getDailyFinanceStatistics';
import { useQuery } from 'urql';
import useLocales from 'hooks/useLocales';
//
import { FEATURE_DAILY_STATUS } from 'config';
import React from 'react';
import { useNavigate } from 'react-router';

function DailyStatistics() {
  const { translate } = useLocales();
  const navigate = useNavigate();

  const base_date = new Date();
  const first_date = base_date.toISOString().slice(0, 10);
  const second_date = new Date(base_date.setDate(base_date.getDate() + 1))
    .toISOString()
    .slice(0, 10);
  const [result] = useQuery({
    query: getDailyFinanceStatistics,
    variables: { first_date, second_date },
  });
  const { data, fetching, error } = result;

  const handleClick = (link: string) => {
    navigate(link);
  };

  if (fetching) return <>{translate('pages.common.loading')}</>;
  if (error) return <>{error.message}</>;
  return (
    <Grid container spacing={2}>
      <Grid item md={12}>
        <Typography variant="h4">{translate('finance_pages.heading.daily_stats')}</Typography>
      </Grid>
      {!FEATURE_DAILY_STATUS ? (
        <Grid item md={12}>
          <Typography variant="inherit" sx={{ fontStyle: 'italic' }}>
            {translate('commons.maintenance_feature_flag')} ...
          </Typography>
        </Grid>
      ) : (
        <React.Fragment>
          <Grid item md={2} xs={12}>
            <Box
              sx={{
                borderRadius: '8px',
                backgroundColor: '#fff',
                p: 2,
                cursor: 'pointer',
              }}
              onClick={() => handleClick('/finance/dashboard/old-proposal')}
            >
              <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
                {translate('finance_pages.card.total_projects')}
              </Typography>
              <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
                <Typography component="span" sx={{ fontWeight: 700 }}>
                  {data.incoming_requests.aggregate.count} &nbsp;
                </Typography>
                <Typography component="span" sx={{ fontWeight: 700 }}>
                  {translate('finance_pages.heading.projects')}
                </Typography>
              </Typography>
            </Box>
          </Grid>
          <Grid item md={2} xs={12}>
            <Box
              sx={{
                borderRadius: '8px',
                backgroundColor: '#fff',
                p: 2,
                cursor: 'pointer',
              }}
              onClick={() => handleClick('/finance/dashboard/requests-in-process')}
            >
              <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
                {translate('finance_pages.card.new_incoming_projects')}
              </Typography>
              <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
                <Typography component="span" sx={{ fontWeight: 700 }}>
                  {data.incoming_requests.aggregate.count} &nbsp;
                </Typography>
                <Typography component="span" sx={{ fontWeight: 700 }}>
                  {translate('finance_pages.heading.projects')}
                </Typography>
              </Typography>
            </Box>
          </Grid>
        </React.Fragment>
      )}
    </Grid>
  );
}

export default DailyStatistics;

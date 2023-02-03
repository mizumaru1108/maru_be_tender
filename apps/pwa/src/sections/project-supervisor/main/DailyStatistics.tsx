import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import useAuth from 'hooks/useAuth';
import { getDailySupervisorStatistics } from 'queries/project-supervisor/getDailyStatistics';
import { useQuery } from 'urql';
//
import useLocales from 'hooks/useLocales';
import moment from 'moment';
// config
import { FEATURE_DAILY_STATUS } from 'config';

function DailyStatistics() {
  const { translate } = useLocales();

  const { user } = useAuth();
  const [result] = useQuery({
    query: getDailySupervisorStatistics,
    variables: {
      user_id: user?.id!,
      first_date: moment().startOf('day').toISOString(),
      second_date: moment().endOf('day').toISOString(),
    },
  });

  const { data, fetching, error } = result;

  if (fetching) return <>... Loading</>;
  if (error) return <>{error.message}</>;

  return (
    <Grid container spacing={2}>
      <Grid item md={12}>
        <Typography variant="h4">{translate('account_manager.heading.daily_stats')}</Typography>
        {!FEATURE_DAILY_STATUS ? (
          <Typography variant="inherit" sx={{ fontStyle: 'italic' }}>
            {translate('commons.maintenance_feature_flag')} ...
          </Typography>
        ) : null}
      </Grid>
      {!FEATURE_DAILY_STATUS ? null : (
        <React.Fragment>
          {!fetching && data ? (
            <React.Fragment>
              {Object.keys(data).map((item, i) => {
                const title = translate(`${item}`);
                const value = data[`${item}`].aggregate.count;

                return (
                  <Grid item md={2} xs={12} key={i}>
                    <Box
                      sx={{
                        borderRadius: 1,
                        backgroundColor: '#fff',
                        p: 2,
                      }}
                    >
                      <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
                        {title}
                      </Typography>
                      <Typography
                        sx={{ color: 'text.tertiary', fontWeight: 700 }}
                      >{`${value} ${translate('projects')}`}</Typography>
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

export default DailyStatistics;

import { Box, Grid, Typography } from '@mui/material';
import useAuth from 'hooks/useAuth';
import { getDailyConsultantStatistics } from 'queries/consultant/getDailyConsultantStatistics';
import { useQuery } from 'urql';
import useLocales from 'hooks/useLocales';
//
import { FEATURE_DAILY_STATUS } from 'config';
import React from 'react';

function DailyStatistics() {
  const { translate } = useLocales();
  const base_date = new Date();
  const first_date = base_date.toISOString().slice(0, 10);
  const second_date = new Date(base_date.setDate(base_date.getDate() + 1))
    .toISOString()
    .slice(0, 10);
  const { user } = useAuth();
  const [result] = useQuery({
    //needs some edits
    query: getDailyConsultantStatistics,
    variables: { user_id: user?.id!, first_date, second_date },
  });
  const { data, fetching, error } = result;
  if (fetching) return <>... Loading</>;
  if (error) return <>{error.message}</>;
  return (
    <Grid container spacing={2}>
      <Grid item md={12}>
        <Typography variant="h4">{translate('account_manager.heading.daily_stats')}</Typography>
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
                      <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
                        {`${value} ${translate('projects')}`}
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

export default DailyStatistics;

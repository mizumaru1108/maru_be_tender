import { Box, Grid, Typography } from '@mui/material';
import useAuth from 'hooks/useAuth';
import { getDailyConsultantStatistics } from 'queries/consultant/getDailyConsultantStatistics';
import { useQuery } from 'urql';
import useLocales from 'hooks/useLocales';
//
import { FEATURE_DAILY_STATUS } from 'config';
import React, { useMemo } from 'react';

function DailyStatistics() {
  const { translate } = useLocales();
  const base_date = new Date();
  const { user } = useAuth();
  const [result] = useQuery({
    //needs some edits
    query: getDailyConsultantStatistics,
  });
  const { data, fetching, error } = result;

  const count = useMemo(() => {
    let totalProject = 0;
    if (data && !fetching) {
      totalProject =
        (data?.acceptableRequest?.aggregate?.count || 0) +
        (data?.incomingNewRequest?.aggregate?.count || 0) +
        (data?.rejectedRequest?.aggregate?.count || 0);
    }
    return totalProject;
  }, [data, fetching]);

  if (fetching) return <>{translate('pages.common.loading')}</>;
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
                        {`${item !== 'totalRequest' ? value : count} ${translate('projects')}`}
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

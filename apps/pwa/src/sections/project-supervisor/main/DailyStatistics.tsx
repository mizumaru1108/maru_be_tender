import React, { useMemo } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import useAuth from 'hooks/useAuth';
import { getDailySupervisorStatistics } from 'queries/project-supervisor/getDailyStatistics';
import { useQuery } from 'urql';
//
import useLocales from 'hooks/useLocales';
import moment from 'moment';
// config
import { FEATURE_DAILY_STATUS } from 'config';
import { useNavigate } from 'react-router';
import { getOneEmployee } from '../../../queries/admin/getAllTheEmployees';

function DailyStatistics() {
  const { translate } = useLocales();
  const navigate = useNavigate();

  const { user } = useAuth();
  const [resultEmployee] = useQuery({
    query: getOneEmployee,
    variables: { id: user?.id },
  });
  const { data: employeeData, fetching: fetchingEmployee, error: errorEmployee } = resultEmployee;
  // console.log({});
  const track_id = employeeData?.data?.track_id || undefined;

  const [result] = useQuery({
    query: getDailySupervisorStatistics,
    variables: {
      user_id: user?.id!,
      track_id: track_id,
    },
    pause: !track_id || !user?.id,
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

  const handleClick = (link: string) => {
    navigate(link);
  };

  if (fetching || fetchingEmployee) return <>{translate('pages.common.loading')}</>;
  if (error || errorEmployee) return <>{error?.message || errorEmployee?.message}</>;

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
                const redirect_link =
                  (item === 'totalRequest' && '/project-supervisor/dashboard/old-proposal') ||
                  (item === 'pendingRequest' &&
                    '/project-supervisor/dashboard/requests-in-process') ||
                  '/project-supervisor/dashboard/previous-funding-requests';

                return (
                  <Grid
                    item
                    md={2}
                    xs={12}
                    key={i}
                    sx={{ cursor: redirect_link ? 'pointer' : undefined }}
                    onClick={() => {
                      if (redirect_link) {
                        handleClick(redirect_link);
                      }
                    }}
                  >
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
                      <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>{`${
                        item !== 'totalRequest' ? value : count
                      } ${translate('projects')}`}</Typography>
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

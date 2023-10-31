import { Box, Grid, Typography } from '@mui/material';
import useLocales from 'hooks/useLocales';
import useAuth from 'hooks/useAuth';
import { getDailyStatisticCeo } from 'queries/ceo/getDailyStatisticCeo';
import { useQuery } from 'urql';
import moment from 'moment';
//
import { FEATURE_DAILY_STATUS } from 'config';
import React from 'react';
import { useNavigate } from 'react-router';

function DailyStatistics() {
  const { translate } = useLocales();
  const navigate = useNavigate();

  const { user } = useAuth();
  const [result] = useQuery({
    query: getDailyStatisticCeo,
    variables: {
      user_id: user?.id!,
      first_date: moment().startOf('day').toISOString(),
      second_date: moment().endOf('day').toISOString(),
    },
  });

  const { data, fetching, error } = result;

  const handleClick = (link: string) => {
    navigate(link);
  };

  if (fetching) return <>{translate('pages.common.loading')}</>;
  if (error) return <>{error.message}</>;

  // console.log('data', data);

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
                const redirect_link =
                  ((item === 'acceptableRequest' || item === 'totalRequest') &&
                    '/ceo/dashboard/previous-funding-requests') ||
                  (item === 'rejectedRequest' && '/ceo/dashboard/rejection-list') ||
                  undefined;

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
                      <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>
                        {`${value} ${translate('projects')}`}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </React.Fragment>
          ) : null}
          {/* <Grid item md={2} xs={12}>
            <Box
              sx={{
                borderRadius: '8px',
                backgroundColor: '#fff',
                py: '30px',
                paddingRight: '40px',
                paddingLeft: '5px',
              }}
            >
              <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
                عدد مشاريع الكلي
              </Typography>
              <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>10 مشاريع</Typography>
            </Box>
          </Grid>
          <Grid item md={2} xs={12}>
            <Box
              sx={{
                borderRadius: '8px',
                backgroundColor: '#fff',
                py: '30px',
                paddingRight: '40px',
                paddingLeft: '5px',
              }}
            >
              <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
                مشاريع جديدة واردة
              </Typography>
              <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>4 مشاريع</Typography>
            </Box>{' '}
          </Grid>
          <Grid item md={2} xs={12}>
            <Box
              sx={{
                borderRadius: '8px',
                backgroundColor: '#fff',
                py: '30px',
                paddingRight: '40px',
                paddingLeft: '5px',
              }}
            >
              <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
                مشاريع معلقة
              </Typography>
              <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>2 مشاريع</Typography>
            </Box>{' '}
          </Grid>
          <Grid item md={2} xs={12}>
            <Box
              sx={{
                borderRadius: '8px',
                backgroundColor: '#fff',
                py: '30px',
                paddingRight: '40px',
                paddingLeft: '5px',
              }}
            >
              <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
                مشاريع مقبولة
              </Typography>
              <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>2 مشاريع</Typography>
            </Box>{' '}
          </Grid>
          <Grid item md={2} xs={12}>
            <Box
              sx={{
                borderRadius: '8px',
                backgroundColor: '#fff',
                py: '30px',
                paddingRight: '40px',
                paddingLeft: '5px',
              }}
            >
              <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
                مشاريع مرفوضة
              </Typography>
              <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>2 مشاريع</Typography>
            </Box>{' '}
          </Grid> */}
        </React.Fragment>
      )}
    </Grid>
  );
}

export default DailyStatistics;

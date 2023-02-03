import { Box, Grid, Typography } from '@mui/material';
import useLocales from 'hooks/useLocales';
//
import { FEATURE_DAILY_STATUS } from 'config';
import React from 'react';

function DailyStatistics() {
  const { translate } = useLocales();

  return (
    <Grid container spacing={2}>
      <Grid item md={12}>
        <Typography variant="h4">احصائيات يومية</Typography>
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
          </Grid>
        </React.Fragment>
      )}
    </Grid>
  );
}

export default DailyStatistics;

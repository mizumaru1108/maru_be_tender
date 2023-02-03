import { Box, Grid, Typography } from '@mui/material';
import useLocales from 'hooks/useLocales';
//
import { FEATURE_DAILY_STATUS } from 'config';
import React from 'react';

function TrackBudget() {
  const { translate } = useLocales();
  return (
    <Grid container spacing={2} sx={{ mt: '1px' }}>
      <Grid item md={12}>
        <Typography variant="h4">ميزانية المسار</Typography>
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
              <img src={`/icons/rial-currency.svg`} alt="" />
              <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
                الميزانية الكلية للمشروع
              </Typography>
              <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>500 ريال</Typography>
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
              <img src={`/icons/rial-currency.svg`} alt="" />
              <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
                الميزانية الكلية للمشروع
              </Typography>
              <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>500 ريال</Typography>
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
              <img src={`/icons/rial-currency.svg`} alt="" />
              <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
                الميزانية الكلية للمشروع
              </Typography>
              <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>500 ريال</Typography>
            </Box>
          </Grid>
        </React.Fragment>
      )}
    </Grid>
  );
}

export default TrackBudget;

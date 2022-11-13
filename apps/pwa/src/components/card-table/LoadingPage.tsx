import { Grid, Skeleton } from '@mui/material';
import React from 'react';

function LoadingPage() {
  return (
    <Grid container md={12} xs={12}>
      <Grid item md={6} xs={12}>
        <Skeleton
          variant="rectangular"
          height="250px"
          animation="wave"
          sx={{ bgcolor: 'grey.250' }}
        />
      </Grid>
      <Grid item md={6} xs={12}>
        <Skeleton
          variant="rectangular"
          height="250px"
          animation="wave"
          sx={{ bgcolor: 'grey.250' }}
        />
      </Grid>
    </Grid>
  );
}

export default LoadingPage;

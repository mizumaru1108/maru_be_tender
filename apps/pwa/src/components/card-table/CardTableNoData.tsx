import { Box, Grid, Typography } from '@mui/material';
import React from 'react';

function CardTableNoData() {
  return (
    <Box sx={{ height: '100px', borderRadius: '10px' }}>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        p="20px"
      >
        <Grid item>
          <Typography variant="h5">لا يوجد مشاريع</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CardTableNoData;

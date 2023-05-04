import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import React from 'react';
import useLocales from 'hooks/useLocales';

function CardTableLoading() {
  const { translate } = useLocales();

  return (
    <Box sx={{ height: '100px', borderRadius: '10px' }}>
      <Grid
        container
        spacing={0}
        direction="column"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <Grid item>
          {/* <Typography variant="h5">{translate('content.client.main_page.no_projects')}</Typography> */}
          <CircularProgress />
        </Grid>
      </Grid>
    </Box>
  );
}

export default CardTableLoading;

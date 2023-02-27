import { Box, Grid, Typography } from '@mui/material';
import React from 'react';
import useLocales from 'hooks/useLocales';

function CardTableNoData() {
  const { translate } = useLocales();

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
          <Typography variant="h5">{translate('content.client.main_page.no_projects')}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CardTableNoData;

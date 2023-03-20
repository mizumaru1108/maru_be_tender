import React from 'react';
import { Grid, Typography, Card, Box, Button, Stack } from '@mui/material';
import BaseField from 'components/hook-form/BaseField';
import { RHFUploadSingleFileBe } from 'components/hook-form/RHFUploadBe';
import useLocales from 'hooks/useLocales';
import ContentTrackCard from './ContentTrackCard';

const TransactionProgressionPage = () => {
  const { translate } = useLocales();

  // const TRACKS = [
  //   { id: 1, track: 'Concessional Grant Track' },
  //   { id: 2, track: 'The tracks of the mosque' },
  //   { id: 3, track: "The track of the Sheikh's baptisms" },
  //   { id: 4, track: 'Initiatives Track' },
  // ];

  const TRACKS = [
    'Concessional Grant Track',
    'The tracks of the mosque',
    "The track of the Sheikh's baptisms",
    'Initiatives Track',
  ];

  return (
    <Grid>
      <Grid sx={{ display: 'flex', justifyContent: 'space-between', mt: 6, mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Cairo', fontStyle: 'Bold' }}>
          Transaction Progress
        </Typography>
        <Box
          sx={{
            borderRadius: '10px',
            backgroundColor: '#0E847829',
            py: 1,
            px: 4,
          }}
        >
          <Typography sx={{ color: '#0E8478', fontWeight: 700 }}>Project State</Typography>
        </Box>
      </Grid>
      <Grid container spacing={2}>
        <Grid item md={4} sm={6} xs={12}>
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{
              py: 8,
              px: 5,
              background: '#F5F6FA',
              border: '1px dashed #0E8478',
              borderRadius: '5px',
              // borderSpacing: '10px',
            }}
          >
            <Typography>Create a new transaction flow track</Typography>
            <Button
              size="large"
              sx={{
                '&.MuiButtonBase-root:hover': {
                  bgcolor: 'transparent',
                },
                bgcolor: 'transparent',
                mt: 0.5,
              }}
            >
              <img src={`/icons/uploading-field/second-field-icon.svg`} alt="" />
            </Button>
          </Stack>
        </Grid>
        {TRACKS.map((track, index) => (
          <Grid item md={4} sm={6} xs={12} key={index}>
            <Card sx={{ py: 3, background: '#fff' }}>
              <ContentTrackCard name={track} />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default TransactionProgressionPage;

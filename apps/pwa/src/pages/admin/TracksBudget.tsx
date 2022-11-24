import { styled, Button, Container, Grid, Typography } from '@mui/material';
import Page from 'components/Page';
import React from 'react';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 42,
}));

function TracksBudget() {
  return (
    <Page title="Tracks Budget | Page">
      <Container>
        <Grid container spacing={3}>
          <Grid item md={6} xs={6}>
            <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Cairo', fontStyle: 'Bold' }}>
              ميزانية المسارات
            </Typography>
          </Grid>
          <Grid item md={6} xs={6}>
            <Button
              sx={{
                backgroundColor: '#0E8478',
                color: '#fff',
                ':hover': { backgroundColor: '#13B2A2' },
              }}
            >
              اضافة ميزانية
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export default TracksBudget;

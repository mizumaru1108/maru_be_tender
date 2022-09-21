import { Button, Container, Grid } from '@mui/material';
import { useState } from 'react';
import ClientCarousel from './ClientCarousel';
import CurrentProject from './CurrentProject';
import DraftProject from './DraftProject';
import PreviousFundingInqueries from './PreviousFundingInqueries';
import UnActivatedAccount from './UnActivatedAccount';

function DashboardPage() {
  const [activated, setActivated] = useState(false);
  return (
    <Grid container rowSpacing={8}>
      <Grid item>
        <Button
          onClick={() => {
            setActivated(true);
          }}
        >
          Test Activate Me
        </Button>
      </Grid>
      {!activated && <UnActivatedAccount />}
      {activated && (
        <>
          <Grid item md={12} xs={12}>
            <ClientCarousel />
          </Grid>
          <Grid item md={12} xs={12}>
            <CurrentProject />
          </Grid>
          <Grid item md={12} xs={12}>
            <DraftProject />
          </Grid>
          <Grid item md={12} xs={12}>
            <PreviousFundingInqueries />
          </Grid>
        </>
      )}
    </Grid>
  );
}

export default DashboardPage;

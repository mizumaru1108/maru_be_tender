import { Button } from '@mui/material';
import { useState } from 'react';
import ClientCarousel from './ClientCarousel';
import CurrentProject from './CurrentProject';
import DraftProject from './DraftProject';
import PreviousFundingInqueries from './PreviousFundingInqueries';
import UnActivatedAccount from './UnActivatedAccount';

function DashboardPage() {
  const [activated, setActivated] = useState(false);
  return (
    <>
      <Button
        onClick={() => {
          setActivated(true);
        }}
      >
        Test Activate Me
      </Button>
      {!activated && <UnActivatedAccount />}
      {activated && (
        <>
          <ClientCarousel />
          <CurrentProject />
          <DraftProject />
          <PreviousFundingInqueries />
        </>
      )}
    </>
  );
}

export default DashboardPage;

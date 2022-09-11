import { Container, Grid } from '@mui/material';
import ClientCarousel from './ClientCarousel';
import CurrentProject from './CurrentProject';
import DraftProject from './DraftProject';
import PreviousFundingInqueries from './PreviousFundingInqueries';
import UnActivatedAccount from './UnActivatedAccount';

function DashboardPage() {
  const unActivated = false;

  return (
    <>
      {unActivated && <UnActivatedAccount />}
      {!unActivated && (
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

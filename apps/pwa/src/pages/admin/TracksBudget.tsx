import { styled, Container } from '@mui/material';
import Page from 'components/Page';
import { TrackBudgetPage } from 'sections/admin/track-budget';

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
        <ContentStyle>
          <TrackBudgetPage />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default TracksBudget;

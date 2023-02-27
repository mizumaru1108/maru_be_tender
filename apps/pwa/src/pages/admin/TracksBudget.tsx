import { styled, Container } from '@mui/material';
import Page from 'components/Page';
import { TrackBudgetPage } from 'sections/admin/track-budget';
import useLocales from '../../hooks/useLocales';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 42,
}));

function TracksBudget() {
  const { translate } = useLocales();
  return (
    // <Page title="Tracks Budget | Page">
    <Page title={translate('pages.admin.tracks_budget')}>
      <Container>
        <ContentStyle>
          <TrackBudgetPage />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default TracksBudget;

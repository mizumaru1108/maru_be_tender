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
    <Page title={translate('pages.admin.tracks_budget.heading.main')}>
      <Container>
        <ContentStyle>
          <TrackBudgetPage />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default TracksBudget;

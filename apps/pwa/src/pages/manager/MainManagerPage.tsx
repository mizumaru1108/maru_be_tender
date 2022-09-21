// material
import { Container, styled } from '@mui/material';
// components
import Page from 'components/Page';
import { CardInsight } from 'components/card-insight';

// -------------------------------------------------------------------------------

const INSIGHT_DATA = [
  { title: 'number_of_request', value: 57 },
  { title: 'active_partners', value: 14 },
  { title: 'rejected', value: 2 },
  { title: 'suspended_partners', value: 1 },
];

// -------------------------------------------------------------------------------

function MainManagerPage() {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    rowGap: '50px',
  }));
  console.log('adskadkla');
  return (
    <Page title="Manager Dashboard">
      <Container>
        <ContentStyle>
          <CardInsight headline="daily_stats" data={INSIGHT_DATA} />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default MainManagerPage;

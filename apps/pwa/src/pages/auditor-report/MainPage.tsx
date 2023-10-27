import { Container, styled } from '@mui/material';
import Page from 'components/Page';
import useLocales from '../../hooks/useLocales';

import CompleteCloseReports from 'pages/project-supervisor/CompleteCloseReports';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  gap: 20,
}));

function MainPage() {
  const { translate } = useLocales();
  return (
    <Page title={translate('pages.auditor_report.main')}>
      <Container>
        <ContentStyle>
          <CompleteCloseReports />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default MainPage;

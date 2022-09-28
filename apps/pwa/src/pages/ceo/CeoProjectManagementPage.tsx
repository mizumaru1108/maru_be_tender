import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import CeoProjectManagement from '../../sections/ceo/ceo-project-management';

function CeoProjectManagementPage() {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));

  return (
    <Page title="Project Management">
      <Container>
        <ContentStyle>
          <CeoProjectManagement />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default CeoProjectManagementPage;

import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import ClientProfileEditForm from 'sections/client/profile';

function ClientProfileEdit() {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));

  return (
    <Page title="Fundin Project Request">
      <Container>
        <ContentStyle>
          <ClientProfileEditForm />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default ClientProfileEdit;

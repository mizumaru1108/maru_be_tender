import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import { ClientProfileEditForm } from 'sections/client/profile';

export default function NonClientProfileEdit() {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));

  return (
    <Page title="Profile Editing">
      <Container>
        <ContentStyle>
          <ClientProfileEditForm />
        </ContentStyle>
      </Container>
    </Page>
  );
}

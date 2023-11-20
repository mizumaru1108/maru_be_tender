import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import { ClientProfileEditForm } from 'sections/client/profile';
import useLocales from '../../hooks/useLocales';

function ClientProfileEdit() {
  const { translate } = useLocales();
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));

  return (
    <Page title={translate('pages.client.profile_editing')}>
      <Container>
        <ContentStyle>
          <ClientProfileEditForm />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default ClientProfileEdit;

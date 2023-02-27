import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import { ClientUserEditForm } from 'sections/client/profile';
import useLocales from '../../hooks/useLocales';

function ClientUserEdit() {
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
    // <Page title="User Info Editing">
    <Page title={translate('pages.client.user_info_editing')}>
      <Container>
        <ContentStyle>
          <ClientUserEditForm />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default ClientUserEdit;

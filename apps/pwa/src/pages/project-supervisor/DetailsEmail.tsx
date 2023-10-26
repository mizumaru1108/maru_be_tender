import { Container, styled } from '@mui/material';
import { FEATURE_SEND_EMAIL_TO_CLIENT } from 'config';
import Page from '../../components/Page';
import useLocales from '../../hooks/useLocales';
import DetailsEmail from '../../sections/project-supervisor/send-mail/details';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  // minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: '50px',
}));

function DetailsEmailToClient() {
  const { translate } = useLocales();
  return (
    // <Page title="Messages">
    <Page title={translate('email_to_client.new_email')}>
      <Container>
        <ContentStyle>{FEATURE_SEND_EMAIL_TO_CLIENT && <DetailsEmail />}</ContentStyle>
      </Container>
    </Page>
  );
}

export default DetailsEmailToClient;

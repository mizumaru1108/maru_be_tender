import { Container, styled } from '@mui/material';
import { FEATURE_SEND_EMAIL_TO_CLIENT } from 'config';
import SendEmail from 'sections/project-supervisor/send-mail/send-email';
import Page from '../../components/Page';
import useLocales from '../../hooks/useLocales';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  // minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: '50px',
}));

function SendEmailToClient() {
  const { translate } = useLocales();
  return (
    <Page title={translate('email_to_client.new_email')}>
      <Container>
        <ContentStyle>{FEATURE_SEND_EMAIL_TO_CLIENT && <SendEmail />}</ContentStyle>
      </Container>
    </Page>
  );
}

export default SendEmailToClient;

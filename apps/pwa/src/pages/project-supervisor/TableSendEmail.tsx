import { Container, styled } from '@mui/material';
import SendEmailTable from 'components/table/send-email/SendEmailTable';
import { FEATURE_SEND_EMAIL_TO_CLIENT } from 'config';
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
    // <Page title="Messages">
    <Page title={translate('email_to_client.title')}>
      <Container>
        <ContentStyle>{FEATURE_SEND_EMAIL_TO_CLIENT && <SendEmailTable />}</ContentStyle>
      </Container>
    </Page>
  );
}

export default SendEmailToClient;

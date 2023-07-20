import { Container, styled } from '@mui/material';
import { FEATURE_BANNER } from 'config';
import SystemMessages from 'sections/admin/system-messges';
import Page from '../../../components/Page';
import useLocales from '../../../hooks/useLocales';

function SystemMessagesPage() {
  const { translate } = useLocales();
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    rowGap: 40,
  }));

  return (
    // <Page title="System Messages">
    <Page title={translate('pages.admin.system_messages')}>
      <Container>
        <ContentStyle>{FEATURE_BANNER && <SystemMessages />}</ContentStyle>
      </Container>
    </Page>
  );
}

export default SystemMessagesPage;

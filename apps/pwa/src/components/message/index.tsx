import { Stack, Typography, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import Page from 'components/Page';
import useLocales from 'hooks/useLocales';
import useAuth from 'hooks/useAuth';
//
import MessageContent from './content/MessageContent';
import MessageMenu from './menu/MessageMenu';

// config
import { HEADER, FEATURE_MESSAGING_SYSTEM } from 'config';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  width: '50%',
}));

const ContentStyleMessage = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  position: 'fixed',
  top: HEADER.MAIN_DESKTOP_HEIGHT + 10,
  right: theme.spacing(2),
  bottom: theme.spacing(5),
  borderRadius: theme.spacing(1),
  width: '40%',
  padding: theme.spacing(2),
  backgroundColor: '#fff',
}));

// ----------------------------------------------------------------------

function MessagesPage() {
  const { activeRole, user } = useAuth();
  const role = activeRole!;
  const { translate } = useLocales();

  return (
    <Page title="Message Page">
      {FEATURE_MESSAGING_SYSTEM ? (
        <Stack direction="row" spacing={1} component="div" justifyContent="space-between">
          <ContentStyle>
            <MessageMenu accountType={role} user={user} />
          </ContentStyle>
          <ContentStyleMessage>
            <MessageContent />
          </ContentStyleMessage>
        </Stack>
      ) : (
        <Container>
          <Typography variant="inherit" sx={{ fontStyle: 'italic' }}>
            {translate('commons.maintenance_feature_flag')} ...
          </Typography>
        </Container>
      )}
    </Page>
  );
}

export default MessagesPage;

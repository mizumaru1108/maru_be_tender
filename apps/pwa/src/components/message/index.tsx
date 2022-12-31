import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import Page from 'components/Page';
import useAuth from 'hooks/useAuth';
//
import MessageContent from './content/MessageContent';
import MessageMenu from './menu/MessageMenu';

// config
import { HEADER } from '../../config';

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

  return (
    <Page title="Message Page">
      <Stack direction="row" spacing={1} component="div" justifyContent="space-between">
        <ContentStyle>
          <MessageMenu accountType={role} user={user} />
        </ContentStyle>
        <ContentStyleMessage>
          <MessageContent />
        </ContentStyleMessage>
      </Stack>
    </Page>
  );
}

export default MessagesPage;

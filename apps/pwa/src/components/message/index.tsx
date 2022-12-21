import { Grid, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import Page from 'components/Page';
import useAuth from 'hooks/useAuth';
import { useState } from 'react';

import MessageContent from './content/MessageContent';
import MessageMenu from './menu/MessageMenu';
import {
  Message,
  Message1,
  Message2,
  Message3,
  messageContent,
  MessagesExternalCorespondence,
  MessagesInternalCorespondence,
} from './mock-data';

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

function MessagesPage() {
  const { activeRole } = useAuth();
  const role = activeRole!;
  const [content, setContent] = useState<messageContent[]>([]);
  const [room, setRoom] = useState<string>();
  return (
    <Page title="Message Page">
      <Stack direction="row" spacing={1} component="div" justifyContent="space-between">
        <ContentStyle>
          <MessageMenu
            internalData={MessagesInternalCorespondence}
            externalData={MessagesExternalCorespondence}
            accountType={role}
            roomId={(id) => {
              setRoom(id);
            }}
          />
        </ContentStyle>
        <ContentStyleMessage>
          {room === '001' && <MessageContent data={Message} />}
          {room === '002' && <MessageContent data={Message1} />}
          {room === '003' && <MessageContent data={Message2} />}
          {room === '004' && <MessageContent data={Message3} />}
        </ContentStyleMessage>
      </Stack>
    </Page>
  );
}

export default MessagesPage;

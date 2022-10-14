import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Page from 'components/Page';
import useAuth from 'hooks/useAuth';
import { useState } from 'react';
import { FusionAuthRoles } from '../../@types/commons';

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

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  gap: 20,
}));

function MessagesPage() {
  const { user } = useAuth();
  const role = user?.registrations[0].roles[0] as FusionAuthRoles;
  const [content, setContent] = useState<messageContent[]>([]);
  const [room, setRoom] = useState<string>();
  return (
    <Page title="Previous Funding Requests">
      <ContentStyle>
        <Grid container columns={15} spacing={3} direction="row">
          <Grid item xs={7} padding={2}>
            <MessageMenu
              internalData={MessagesInternalCorespondence}
              externalData={MessagesExternalCorespondence}
              accountType={role}
              roomId={(id) => {
                setRoom(id);
                console.log('room', room);
              }}
            />
          </Grid>
          <Grid
            item
            xs={8}
            sx={{
              backgroundColor: '#fff',
            }}
            padding={3}
          >
            {room === '001' && <MessageContent data={Message} />}
            {room === '002' && <MessageContent data={Message1} />}
            {room === '003' && <MessageContent data={Message2} />}
            {room === '004' && <MessageContent data={Message3} />}
          </Grid>
        </Grid>
      </ContentStyle>
    </Page>
  );
}

export default MessagesPage;

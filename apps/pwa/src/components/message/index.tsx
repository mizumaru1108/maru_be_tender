import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Page from 'components/Page';

import MessageContent from './content/MessageContent';
import MessageMenu from './menu/MessageMenu';
import { Message, MessagesExternalCorespondence, MessagesInternalCorespondence } from './mock-data';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  gap: 20,
}));

function MessagesPage() {
  return (
    <Page title="Previous Funding Requests">
      <ContentStyle>
        <Grid container columns={14} spacing={3} direction="row">
          <Grid item xs={6}>
            <MessageMenu
              internalTabData={MessagesInternalCorespondence}
              externalTabData={MessagesExternalCorespondence}
            />
          </Grid>
          <Grid
            item
            xs={8}
            sx={{
              backgroundColor: '#fff',
            }}
          >
            <MessageContent data={Message} />
          </Grid>
        </Grid>
      </ContentStyle>
    </Page>
  );
}

export default MessagesPage;

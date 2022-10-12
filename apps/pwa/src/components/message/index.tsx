import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import Page from 'components/Page';
import useAuth from 'hooks/useAuth';
import { HashuraRoles } from '../../@types/commons';

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
  const { user } = useAuth();
  const role = user?.registrations[0].roles[0] as HashuraRoles;
  return (
    <Page title="Previous Funding Requests">
      <ContentStyle>
        <Grid container columns={15} spacing={3} direction="row">
          <Grid item xs={7} padding={2}>
            <MessageMenu
              internalData={MessagesInternalCorespondence}
              externalData={MessagesExternalCorespondence}
              accountType={role}
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
            <MessageContent data={Message} />
          </Grid>
        </Grid>
      </ContentStyle>
    </Page>
  );
}

export default MessagesPage;

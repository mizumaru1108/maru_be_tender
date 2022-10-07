import { Box, Button, Grid, Tab, Tabs, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Stack } from '@mui/system';
import Page from 'components/Page';
import React, { useEffect, useState } from 'react';

import Iconify from '../Iconify';
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
              internalData={MessagesInternalCorespondence}
              externalData={MessagesExternalCorespondence}
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

import { styled } from '@mui/material';
import React from 'react';
import MessagesPage from '../../components/message';
import Page from '../../components/Page';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: '50px',
}));

function ProjectManagerMessages() {
  return (
    <Page title="Messages">
      <ContentStyle>
        <MessagesPage />
      </ContentStyle>
    </Page>
  );
}

export default ProjectManagerMessages;

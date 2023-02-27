import { styled } from '@mui/material';
import React from 'react';
import MessagesPage from '../../components/message';
import Page from '../../components/Page';
import useLocales from '../../hooks/useLocales';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: '50px',
}));

function AdminMessages() {
  const { translate } = useLocales();
  return (
    // <Page title="Messages">
    <Page title={translate('pages.common.messages')}>
      <ContentStyle>
        <MessagesPage />
      </ContentStyle>
    </Page>
  );
}

export default AdminMessages;

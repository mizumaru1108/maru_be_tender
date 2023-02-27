import { Container, styled } from '@mui/material';
import React from 'react';
import Page from '../../components/Page';
import useLocales from '../../hooks/useLocales';

function SystemMessages() {
  // return <div>SystemMessages</div>;
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
    <Page title={translate('pages.admmin.system_messages')}>
      <Container>
        <ContentStyle>SystemMessages</ContentStyle>
      </Container>
    </Page>
  );
}

export default SystemMessages;

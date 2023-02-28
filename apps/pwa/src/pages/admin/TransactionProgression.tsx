import { Container, styled } from '@mui/material';
import React from 'react';
import Page from '../../components/Page';
import useLocales from '../../hooks/useLocales';

function TransactionProgression() {
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
    <Page title={translate('pages.admin.transaction_progression')}>
      <Container>
        <ContentStyle>TransactionProgression</ContentStyle>
      </Container>
    </Page>
  );
}

export default TransactionProgression;

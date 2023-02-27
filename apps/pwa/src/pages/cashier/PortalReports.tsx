import { Container, styled } from '@mui/material';
import React from 'react';
import Page from '../../components/Page';
import useLocales from '../../hooks/useLocales';

function PortalReports() {
  // return <div>PortalReports</div>;
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
    // <Page title="Portal Reports Page">
    <Page title={translate('pages.common.portal_reports')}>
      <Container>
        <ContentStyle>PortalReports</ContentStyle>
      </Container>
    </Page>
  );
}

export default PortalReports;

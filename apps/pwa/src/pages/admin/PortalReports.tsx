import { Container, styled } from '@mui/material';
import { MENU_ADMIN_PORTAL_REPORTS } from 'config';
import React from 'react';
import AdminPortalReportsPage from 'sections/admin/portal-repports/portal-reports';
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
        <ContentStyle>{MENU_ADMIN_PORTAL_REPORTS ? <AdminPortalReportsPage /> : null}</ContentStyle>
      </Container>
    </Page>
  );
}

export default PortalReports;

// material
import { Container, styled } from '@mui/material';
// components
import Page from 'components/Page';
import { TableAMCustom } from 'components/table';
// mock
import { AM_PARTNER_MANAGEMENT } from '../mock-data';

function PartnerManagementPage() {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    rowGap: '50px',
  }));

  return (
    <Page title="Partner Management">
      <Container>
        <ContentStyle>
          <TableAMCustom
            data={AM_PARTNER_MANAGEMENT}
            headline="info_update_request"
            lengthRowsPerPage={10}
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default PartnerManagementPage;

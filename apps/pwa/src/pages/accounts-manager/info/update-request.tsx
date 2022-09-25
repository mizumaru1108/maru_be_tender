// material
import { Container, styled } from '@mui/material';
// components
import Page from 'components/Page';
import { TableAMCustom } from 'components/table';
// mock
import { AM_UPDATE_REQUEST } from '../mock-data';

// -------------------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 42,
}));

// -------------------------------------------------------------------------------

function InfoUpdateRequestPage() {
  return (
    <Page title="Information Update Request">
      <Container>
        <ContentStyle>
          <TableAMCustom data={AM_UPDATE_REQUEST} headline="info_update_request" />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default InfoUpdateRequestPage;

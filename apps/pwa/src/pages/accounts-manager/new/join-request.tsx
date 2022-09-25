// material
import { Container, styled } from '@mui/material';
// components
import Page from 'components/Page';
import { TableAMCustom } from 'components/table';
// mock
import { AM_NEW_REQUEST } from '../mock-data';

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

function NewJoinRequestPage() {
  return (
    <Page title="Incoming Join Request">
      <Container>
        <ContentStyle>
          <TableAMCustom data={AM_NEW_REQUEST} headline="new_join_request" />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default NewJoinRequestPage;

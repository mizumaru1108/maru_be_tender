import { Box, styled } from '@mui/material';
import Page from 'components/Page';
import EntityClassificationTable from 'sections/admin/entity-classification';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 42,
}));

function EntityClassification() {
  return (
    <Page title="Entity Classification : Table">
      <ContentStyle>
        <Box sx={{ px: '30px' }}>
          <EntityClassificationTable />
        </Box>
      </ContentStyle>
    </Page>
  );
}

export default EntityClassification;

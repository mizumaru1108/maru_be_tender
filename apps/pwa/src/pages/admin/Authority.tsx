import { Box, styled } from '@mui/material';
import Page from 'components/Page';
import AuthorityTable from 'sections/admin/authority';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 42,
}));

function Authority() {
  return (
    <Page title="Authority : Table">
      <ContentStyle>
        <Box sx={{ px: '30px' }}>
          <AuthorityTable />
        </Box>
      </ContentStyle>
    </Page>
  );
}

export default Authority;

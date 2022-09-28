import { Box, styled } from '@mui/material';
import Page from 'components/Page';
import GregorianYearTable from 'sections/admin/gregorian-year';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 42,
}));

function GregorianYear() {
  return (
    <Page title="Bank Name : Table">
      <ContentStyle>
        <Box sx={{ px: '30px' }}>
          <GregorianYearTable />
        </Box>
      </ContentStyle>
    </Page>
  );
}

export default GregorianYear;

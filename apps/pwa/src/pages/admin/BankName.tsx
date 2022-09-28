import { Box, styled } from '@mui/material';
import Page from 'components/Page';
import BankNameTable from 'sections/admin/bank-name';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 42,
}));

function BankName() {
  return (
    <Page title="Bank Name : Table">
      <ContentStyle>
        <Box sx={{ px: '30px' }}>
          <BankNameTable />
        </Box>
      </ContentStyle>
    </Page>
  );
}

export default BankName;

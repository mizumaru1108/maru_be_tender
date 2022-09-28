import { Box, styled } from '@mui/material';
import Page from 'components/Page';
import BeneficiariesTable from 'sections/admin/beneficiaries';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 42,
}));

function Beneficiaries() {
  return (
    <Page title="Beneficiaries : Table">
      <ContentStyle>
        <Box sx={{ px: '30px' }}>
          <BeneficiariesTable />
        </Box>
      </ContentStyle>
    </Page>
  );
}

export default Beneficiaries;

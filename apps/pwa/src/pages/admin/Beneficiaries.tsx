import { Box, styled } from '@mui/material';
import Page from 'components/Page';
import BeneficiariesTable from 'sections/admin/beneficiaries';
import useLocales from '../../hooks/useLocales';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 42,
}));

function Beneficiaries() {
  const { translate } = useLocales();
  return (
    // <Page title="Beneficiaries : Table">
    <Page title={translate('pages.admin.beneficiaries_table')}>
      <ContentStyle>
        <Box sx={{ px: '30px' }}>
          {/* <BeneficiariesTable /> */}
          <BeneficiariesTable />
        </Box>
      </ContentStyle>
    </Page>
  );
}

export default Beneficiaries;

import { Box, styled } from '@mui/material';
import Page from 'components/Page';
import GregorianYearTable from 'sections/admin/gregorian-year';
import useLocales from '../../hooks/useLocales';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 42,
}));

function GregorianYear() {
  const { translate } = useLocales();
  return (
    // <Page title="Gregorian Year : Table">
    <Page title={translate('pages.admin.gregorian_table')}>
      <ContentStyle>
        <Box sx={{ px: '30px' }}>
          <GregorianYearTable />
        </Box>
      </ContentStyle>
    </Page>
  );
}

export default GregorianYear;

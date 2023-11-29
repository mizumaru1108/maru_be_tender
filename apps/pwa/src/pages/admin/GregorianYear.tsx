import { Box, Container, styled } from '@mui/material';
import Page from 'components/Page';
import GregorianYearTable from 'sections/admin/gregorian-year';
import GregorianYearListTable from '../../components/table/admin/gregorian-year/GregorianYearListTable';
import { FEATURE_MENU_ADMIN_GREGORIAN_YEAR } from '../../config';
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
    <Page title={translate('gregorian_year')}>
      <Container>
        <ContentStyle>
          {/* <Box sx={{ px: '30px' }}>{FEATURE_MENU_ADMIN_GREGORIAN_YEAR && <GregorianYearTable />}</Box> */}
          <Box sx={{ px: '30px' }}>
            {FEATURE_MENU_ADMIN_GREGORIAN_YEAR && <GregorianYearListTable />}
          </Box>
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default GregorianYear;

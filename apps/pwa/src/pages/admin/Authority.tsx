import { Box, styled } from '@mui/material';
import Page from 'components/Page';
import AuthorityTable from 'sections/admin/authority';
import useLocales from '../../hooks/useLocales';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 42,
}));

function Authority() {
  const { translate } = useLocales();
  return (
    // <Page title="Authority : Table">
    <Page title={translate('pages.admin.authority_table')}>
      <ContentStyle>
        <Box sx={{ px: '30px' }}>
          <AuthorityTable />
        </Box>
      </ContentStyle>
    </Page>
  );
}

export default Authority;

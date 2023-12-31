import { Box, styled } from '@mui/material';
import Page from 'components/Page';
import BankNameTable from 'sections/admin/bank-name';
import useLocales from '../../hooks/useLocales';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 42,
}));

function BankName() {
  const { translate } = useLocales();
  return (
    <Page title={translate('pages.admin.bank_new_table')}>
      <ContentStyle>
        <BankNameTable />
      </ContentStyle>
    </Page>
  );
}

export default BankName;

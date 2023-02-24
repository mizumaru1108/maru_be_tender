import { styled } from '@mui/material';
import Page from 'components/Page';
import ClientListTable from 'components/table/ceo/client-list/ClientListTable';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 42,
}));

function CeoClientList() {
  return (
    <ContentStyle>
      <ClientListTable />
    </ContentStyle>
  );
}

export default CeoClientList;

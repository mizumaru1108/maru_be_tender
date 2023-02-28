import RejectionListTable from '../../../components/table/ceo/rejection-list/RejectionListTable';
import { styled } from '@mui/material';
import Page from 'components/Page';

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 42,
}));

function CeoRejectionList() {
  return (
    <ContentStyle>
      <RejectionListTable />
    </ContentStyle>
  );
}

export default CeoRejectionList;

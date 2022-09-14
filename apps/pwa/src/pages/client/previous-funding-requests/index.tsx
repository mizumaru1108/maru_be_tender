import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import CardTable from 'components/card-table/CardTable';
import { CardTableDataPrevious } from '../mock-data';

function PreviousFundingRequests() {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));

  return (
    <Page title="Previous Funding Requests">
      <Container>
        <ContentStyle>
          <CardTable
            data={CardTableDataPrevious} // For testing, later on we will send the query to it
            title="طلبات دعم سابقة"
            dateFilter={true}
            taps={['كل المشاريع', 'مشاريع منتهية', 'مشاريع معلقة']}
            cardFooterButtonAction="show-details"
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default PreviousFundingRequests;

import { Container } from '@mui/material';
import Page from 'components/Page';
import { styled } from '@mui/material/styles';
import CardTable from 'components/card-table/CardTable';
import { CardTableData } from '../mock-data';

function DraftsFundingRequest() {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));
  return (
    <Page title="Draft Funding Requests">
      <Container>
        <ContentStyle>
          <CardTable
            data={CardTableData} // For testing, later on we will send the query to it
            title="طلبات دعم مسودة"
            dateFilter={true} // optional
            taps={['كل المشاريع', 'مشاريع منتهية', 'مشاريع معلقة']} // optional
            cardFooterButtonAction="draft" // The most important param
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default DraftsFundingRequest;

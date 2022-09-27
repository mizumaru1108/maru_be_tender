import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import CardTable from 'components/card-table/CardTable';
import Page from 'components/Page';
import { filterInterface } from '../../../components/card-table/types';
import { CardTableIncomingSupportRequests } from '../mock-data';

function IncomingSupportRequests() {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
    gap: 20,
  }));

  const filter: filterInterface = {
    name: 'filter',
    options: [
      {
        label: 'filter',
        value: 'filter',
      },
    ],
  };

  return (
    <Page title="Previous Funding Requests">
      <Container>
        <ContentStyle>
          <CardTable
            data={CardTableIncomingSupportRequests} // For testing, later on we will send the query to it
            title="تلقي طلبات الدعم"
            alphabeticalOrder={true} // optional
            filters={[filter]} // optional
            // taps={['كل المشاريع', 'مشاريع منتهية', 'مشاريع معلقة']}
            cardFooterButtonAction="show-details"
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default IncomingSupportRequests;

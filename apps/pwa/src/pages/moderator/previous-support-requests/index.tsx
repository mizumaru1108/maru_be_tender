import { Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import CardTable from 'components/card-table/CardTable';
import Page from 'components/Page';
import { filterInterface } from '../../../components/card-table/types';
import { CardTablePreviousSupportRequests } from '../mock-data';

function PreviousSupportRequests() {
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
        value: 'a to z',
      },
    ],
  };

  return (
    <Page title="Previous Support Requests">
      <Container>
        <ContentStyle>
          <CardTable
            data={CardTablePreviousSupportRequests} // For testing, later on we will send the query to it
            title="طلبات دعم سابقة"
            filters={[filter]} // optional
            dateFilter={true}
            // taps={['كل المشاريع', 'مشاريع منتهية', 'مشاريع معلقة']}
            cardFooterButtonAction="show-details"
          />
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default PreviousSupportRequests;
